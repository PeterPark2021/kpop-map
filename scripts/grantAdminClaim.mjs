import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'kpop-map-prod'
  });
}

const targetEmail = process.argv[2] || '2021.untact@gmail.com';

async function grantAdmin(email) {
  console.log(`\n🔑 [관리자 클레임 발급] 대상 이메일: ${email}`);
  try {
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log(`✓ 기존 계정 확인 (UID: ${user.uid})`);
    } catch (notFound) {
      console.log(`ℹ️ 신규 관리자 계정 생성 중: ${email}...`);
      user = await admin.auth().createUser({
        email: email,
        emailVerified: true,
        displayName: 'Master Admin'
      });
      console.log(`✓ 계정 생성 완료 (UID: ${user.uid})`);
    }
    
    console.log(`⚡ admin: true 커스텀 클레임 부여 중...`);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    // Firestore users 문서에도 관리자 프로필 등록
    await admin.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: email,
      displayName: 'Master Admin',
      favoriteArtistIds: ['bigbang-gd', 'bts', 'blackpink', 'seventeen', 'stray-kids'],
      ageVerified: true,
      ageVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      notificationPrefs: { emailEnabled: true, ticketOpen: true, statusChange: true, language: 'ko' }
    }, { merge: true });

    console.log(`\n🎉 [성공] ${email} 계정에 admin: true 커스텀 클레임 및 관리자 프로필이 완벽히 부여되었습니다!`);
    console.log(`👉 구글 로그인 또는 이메일로 로그인하시면 [관리자 기능]이 100% 활성화됩니다.\n`);
  } catch (err) {
    console.error(`❌ [오류 발생]:`, err.message);
  }
}

grantAdmin(targetEmail);