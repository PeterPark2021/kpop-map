import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { sampleLanguageContents } from '../src/data/sampleLanguageContent.ts';

const firebaseConfig = {
  apiKey: "AIzaSyC8ZeKub7I8WTZD8NkSmCEa7mg2948RgrQ",
  authDomain: "kpop-map-prod.firebaseapp.com",
  projectId: "kpop-map-prod",
  storageBucket: "kpop-map-prod.firebasestorage.app",
  messagingSenderId: "943551072546",
  appId: "1:943551072546:web:74a88a4947ac48e2c7bd7b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('🚀 Firestore languageContent 컬렉션에 승인된 학습 표현 시딩 시작...');
  for (const item of sampleLanguageContents) {
    await setDoc(doc(db, 'languageContent', item.contentId), item);
    console.log(`✓ 주입 완료: [${item.koreanText}] (상태: ${item.reviewStatus})`);
  }
  console.log('🎉 Firestore languageContent 시딩 완료!');
  process.exit(0);
}

seed().catch(err => {
  console.error('시딩 실패:', err);
  process.exit(1);
});