import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC8ZeKub7I8WTZD8NkSmCEa7mg2948RgrQ",
  authDomain: "kpop-map-prod.firebaseapp.com",
  projectId: "kpop-map-prod",
  storageBucket: "kpop-map-prod.firebasestorage.app",
  messagingSenderId: "943551072546",
  appId: "1:943551072546:web:74a88a4947ac48e2c7bd7b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 테스트할 운영자 계정 정보
const ADMIN_EMAIL = process.argv[2] || "admin@galaxycorp.com";
const ADMIN_PASSWORD = process.argv[3] || "kpop2026!admin";

async function testAdmin() {
  console.log(`�� [운영자 계정 검증] 대상: ${ADMIN_EMAIL}`);

  try {
    // 1. 기존 계정 로그인 시도
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log(`✅ 운영자 계정 확인 성공! (UID: ${userCredential.user.uid})`);
    console.log(`   이메일: ${userCredential.user.email}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      console.log(`⚠️ 계정이 없어 신규 운영자 계정 생성을 시도합니다...`);
      try {
        const newUser = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log(`🎉 신규 운영자 계정 생성 완료!`);
        console.log(`   아이디: ${ADMIN_EMAIL}`);
        console.log(`   비밀번호: ${ADMIN_PASSWORD}`);
      } catch (createErr) {
        console.error(`❌ 계정 생성 실패:`, createErr.message);
      }
    } else {
      console.error(`❌ 인증 오류:`, err.message);
    }
  }
  process.exit(0);
}

testAdmin();