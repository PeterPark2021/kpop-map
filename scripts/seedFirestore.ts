/**
 * [Firestore 시드 데이터 주입 스크립트]
 * 실행 방법: npx ts-node scripts/seedFirestore.ts
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, doc } from 'firebase/firestore';
import { initialBigBangTourEvents, sampleNewsFacts } from '../prototype/ai-studio-v1/data/initialData';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID
};

async function seed() {
  if (!firebaseConfig.projectId) {
    console.error('❌ VITE_FIREBASE_PROJECT_ID 환경변수가 설정되지 않았습니다.');
    return;
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const batch = writeBatch(db);

  console.log('🚀 빅뱅 18개 도시 투어 데이터 주입 시작...');
  for (const ev of initialBigBangTourEvents) {
    const ref = doc(db, 'events', ev.eventId);
    batch.set(ref, ev);
  }

  for (const news of sampleNewsFacts) {
    const ref = doc(db, 'newsFacts', news.newsId);
    batch.set(ref, news);
  }

  await batch.commit();
  console.log('✅ Firestore 시드 데이터 주입이 성공적으로 완료되었습니다!');
}

seed().catch(console.error);
