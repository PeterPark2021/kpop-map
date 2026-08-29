/**
 * [Firebase Admin Custom Claim 부여 스크립트]
 * 사용법: node scripts/setAdminClaim.mjs <admin_uid_or_email>
 */
console.log(`
ℹ️ Firebase Admin SDK Custom Claim 설정 가이드:
1. Firebase Console -> Authentication에서 관리자 이메일을 등록합니다.
2. 아래 명령어로 해당 사용자에게 'admin: true' 클레임을 부여합니다:

   admin.auth().setCustomUserClaims(uid, { admin: true });

3. 해당 사용자는 다음 로그인 시 token.admin == true 권한을 획득합니다.
`);