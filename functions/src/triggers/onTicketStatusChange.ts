import { Firestore, Transaction } from 'firebase-admin/firestore';

export interface TicketStatusNotificationPayload {
  eventId: string;
  artistId: string;
  artistName: string;
  city: string;
  venueName: string;
  status: string;
  ticketUrl?: string;
}

/**
 * [원자적 티켓 알림 선점 함수 - Atomic Check-and-Claim]
 * - Firestore runTransaction 내에서 '확인 + 선점 쓰기'를 하나의 원자적 작업으로 묶어
 *   동시에 2개 이상의 트리거가 발생해도 오직 1개의 작업만 이메일 발송 권한을 획득합니다.
 */
export async function claimAndProcessNotification(
  db: Firestore,
  eventRef: any,
  targetStatus: string,
  payload: TicketStatusNotificationPayload
): Promise<{ success: boolean; reason: string; sentCount?: number }> {
  
  // 1단계: Firestore 트랜잭션을 통한 원자적 선점 (Atomic Claim)
  let claimAcquired = false;

  try {
    await db.runTransaction(async (transaction: Transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new Error('EVENT_NOT_FOUND');
      }

      const data = eventDoc.data() || {};
      const notifiedStatuses: string[] = data.notifiedStatuses || [];

      // 이미 선점되었거나 발송된 상태인 경우 -> 즉시 탈출
      if (notifiedStatuses.includes(targetStatus)) {
        claimAcquired = false;
        return;
      }

      // 원자적으로 배열에 즉시 추가하여 다른 동시 요청 차단
      transaction.update(eventRef, {
        notifiedStatuses: [...notifiedStatuses, targetStatus],
        lastNotifiedAt: new Date().toISOString()
      });

      claimAcquired = true;
    });
  } catch (error: any) {
    return { success: false, reason: `TRANSACTION_ERROR: ${error.message}` };
  }

  // 선점 실패 (동시 요청이 이미 처리함)
  if (!claimAcquired) {
    return { success: false, reason: 'DUPLICATE_RACE_CONDITION_PREVENTED' };
  }

  // 2단계: 선점에 성공한 유일한 인스턴스만 이메일 대상 쿼리 및 발송 처리
  const usersRef = db.collection('users');
  const snapshot = await usersRef
    .where('favoriteArtistIds', 'array-contains', payload.artistId)
    .where('notificationPrefs.emailEnabled', '==', true)
    .get();

  if (snapshot.empty) {
    return { success: true, reason: 'CLAIMED_BUT_NO_SUBSCRIBERS', sentCount: 0 };
  }

  // 3단계: Firebase Trigger Email (mail 컬렉션) 일괄 기록
  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    const user = doc.data();
    const mailRef = db.collection('mail').doc();
    batch.set(mailRef, {
      to: user.email,
      message: {
        subject: `🔔 [티켓 오픈] ${payload.artistName} ${payload.city} 공연 예매 시작!`,
        html: `<p>${payload.artistName} ${payload.city} (${payload.venueName}) 티켓 오픈이 시작되었습니다!</p>`
      },
      createdAt: new Date().toISOString()
    });

    // 내부 감사 로그 기록
    const logRef = db.collection('notificationLog').doc();
    batch.set(logRef, {
      userId: doc.id,
      eventId: payload.eventId,
      status: targetStatus,
      sentAt: new Date().toISOString(),
      channel: 'email'
    });
  });

  await batch.commit();
  return { success: true, reason: 'EMAILS_DISPATCHED', sentCount: snapshot.size };
}