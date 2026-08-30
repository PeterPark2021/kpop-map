import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const completeSignup = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }

  const uid = context.auth.uid;
  const email = context.auth.token.email || '';
  const { birthYear, birthMonth, displayName } = data;

  if (!birthYear || !birthMonth) {
    throw new functions.https.HttpsError('invalid-argument', '생년월일 정보가 누락되었습니다.');
  }

  // 🛡️ 서버 사이드 만 14세 엄격 계산
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let age = currentYear - birthYear;
  if (currentMonth < birthMonth) {
    age--;
  }

  // 🚫 만 14세 미만: 즉시 에러 + 생성된 Auth 계정 삭제 (고아 계정 방지)
  if (age < 14) {
    try {
      await admin.auth().deleteUser(uid);
    } catch (err) {
      console.error(`[completeSignup] Failed to delete under-14 user ${uid}:`, err);
    }
    throw new functions.https.HttpsError(
      'permission-denied',
      '만 14세 미만은 법정대리인 동의 없이 회원가입이 불가능합니다.'
    );
  }

  // ✅ 만 14세 이상: Admin SDK로 users/{uid} 문서 안전 생성
  const userProfile = {
    uid,
    email,
    displayName: displayName || (email ? email.split('@')[0] : 'K-POP Fan'),
    favoriteArtistIds: ['bigbang-gd'],
    ageVerified: true,
    ageVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    notificationPrefs: {
      emailEnabled: false,
      ticketOpen: true,
      statusChange: true,
      language: 'ko'
    }
  };

  try {
    await admin.firestore().collection('users').doc(uid).set(userProfile, { merge: true });
    return { success: true, profile: userProfile };
  } catch (err: any) {
    console.error(`[completeSignup] Firestore setDoc error for ${uid}:`, err);
    throw new functions.https.HttpsError('internal', '사용자 프로필 생성 중 오류가 발생했습니다.');
  }
});