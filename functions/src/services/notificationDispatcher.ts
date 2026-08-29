import { Firestore } from 'firebase-admin/firestore';
import { sendDiscordWebhookNotification, DiscordEmbedPayload } from './discordNotifier';
import { buildSignedNotificationEmailHtml, TicketStatusNotificationPayload } from '../triggers/onTicketStatusChange';

export interface DispatcherResult {
  emailSentCount: number;
  discordSent: boolean;
  discordError?: string;
}

/**
 * [멀티채널 알림 디스패처]
 * - Email, Discord 웹훅, (향후 X 포스팅)으로 알림을 독립적으로 팬아웃합니다.
 * - 한 채널(예: Discord)의 실패가 다른 채널(이메일)의 발송을 절대 방해하지 않도록 격리(Promise.allSettled)합니다.
 */
export async function dispatchMultiChannelNotification(
  db: Firestore,
  payload: TicketStatusNotificationPayload & { eventDate: string; imageUrl?: string }
): Promise<DispatcherResult> {
  const result: DispatcherResult = { emailSentCount: 0, discordSent: false };

  // 1. 이메일 구독자 발송 태스크
  const emailTask = async () => {
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('favoriteArtistIds', 'array-contains', payload.artistId)
      .where('notificationPrefs.emailEnabled', '==', true)
      .get();

    if (snapshot.empty) return 0;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      const user = doc.data();
      const emailContent = buildSignedNotificationEmailHtml(payload, user.notificationPrefs?.language || 'ko', doc.id);
      const mailRef = db.collection('mail').doc();
      batch.set(mailRef, {
        to: user.email,
        message: emailContent,
        createdAt: new Date().toISOString()
      });
    });
    await batch.commit();
    return snapshot.size;
  };

  // 2. Discord 웹훅 발송 태스크
  const discordTask = async () => {
    // Firestore 시스템 설정 또는 환경변수에서 웹훅 URL 조회
    const configDoc = await db.collection('system_config').doc('discord_webhooks').get();
    const webhookUrl = configDoc.exists ? configDoc.data()?.webhookUrl : process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return { skipped: true, reason: 'NO_WEBHOOK_CONFIGURED' };
    }

    const discordPayload: DiscordEmbedPayload = {
      artistName: payload.artistName,
      cityName: payload.city,
      venueName: payload.venueName,
      status: payload.status,
      eventDate: payload.eventDate,
      ticketUrl: payload.ticketUrl,
      imageUrl: payload.imageUrl
    };

    return await sendDiscordWebhookNotification(webhookUrl, discordPayload);
  };

  // 3. 장애 격리 동시 실행 (Promise.allSettled)
  const [emailOutcome, discordOutcome] = await Promise.allSettled([
    emailTask(),
    discordTask()
  ]);

  if (emailOutcome.status === 'fulfilled') {
    result.emailSentCount = emailOutcome.value;
  } else {
    console.error('[Dispatcher] Email task failed:', emailOutcome.reason);
  }

  if (discordOutcome.status === 'fulfilled') {
    const res = discordOutcome.value as any;
    result.discordSent = Boolean(res?.success);
    if (!res?.success) result.discordError = res?.error;
  } else {
    console.error('[Dispatcher] Discord task failed (Isolated):', discordOutcome.reason);
    result.discordError = String(discordOutcome.reason);
  }

  // 감사 로그 기록
  await db.collection('pipeline_audit_log').add({
    logId: `dispatch_${Date.now()}`,
    timestamp: new Date().toISOString(),
    articleTitle: `[알림 디스패치] ${payload.artistName} - ${payload.city}`,
    status: 'SUCCESS',
    detail: `Email 발송: ${result.emailSentCount}건, Discord 발송: ${result.discordSent ? '성공' : result.discordError || '미설정'}`
  });

  return result;
}