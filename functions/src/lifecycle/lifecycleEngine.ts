import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

function computeStatus(eventDateISO: string, currentStatus: string): string {
  const eventDate = new Date(eventDateISO);
  const today = new Date();
  const eventDateOnly = new Date(Date.UTC(
    eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate()
  ));
  const todayOnly = new Date(Date.UTC(
    today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()
  ));

  if (eventDateOnly < todayOnly) return 'completed';
  if (eventDateOnly.getTime() === todayOnly.getTime()) return 'inProgress';
  return currentStatus === 'ticketOpen' ? 'ticketOpen' : 'scheduled';
}

// ⏰ 매 시간 00분에 실행되어 날짜가 지난 공연을 자동으로 'completed' 처리
export const onScheduledEventLifecycleSync = functions.pubsub
  .schedule('0 * * * *')
  .timeZone('UTC')
  .onRun(async () => {
    const db = admin.firestore();
    const snapshot = await db.collection('events').get();
    let updatedCount = 0;

    for (const doc of snapshot.docs) {
      const eventData = doc.data();
      const currentStatus = eventData.status || 'scheduled';
      const eventDate = eventData.eventDate;

      if (!eventDate) continue;

      const calculatedStatus = computeStatus(eventDate, currentStatus);

      if (calculatedStatus !== currentStatus) {
        // 상태 전이 업데이트
        await doc.ref.update({ status: calculatedStatus });

        // 감사 로그 기록
        await db.collection('eventLifecycleLog').add({
          eventId: doc.id,
          previousStatus: currentStatus,
          newStatus: calculatedStatus,
          reason: 'date-based-auto',
          changedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        updatedCount++;
      }
    }
    console.log(`[Lifecycle Engine] Recalculated ${snapshot.size} events, updated ${updatedCount} transitions.`);
  });