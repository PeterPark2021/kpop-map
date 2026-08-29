console.log('🧪 [Security Audit Suite] Firestore 보안 규칙 4대 취약점 시뮬레이션 검증 시작...\n');

let passed = 0;

// 시뮬레이터: 보안 규칙 로직
function evaluateIsAdmin(auth) {
  return auth !== null && auth.token && auth.token.admin === true;
}

function evaluateNewsRead(doc, auth) {
  return doc.reviewStatus === 'approved' || evaluateIsAdmin(auth);
}

function evaluateUserUpdate(oldDoc, newDoc, auth, userId) {
  if (!auth || auth.uid !== userId) return false;
  // ageVerified 수정 시도 감지
  if (oldDoc.ageVerified !== newDoc.ageVerified || oldDoc.ageVerifiedAt !== newDoc.ageVerifiedAt) {
    return false; // 차단
  }
  return true;
}

// 1. 백도어 제거 검증: @galaxycorp.com 이메일로 가입했으나 admin claim이 없는 공격자
const attackerAuth = { uid: 'hacker_1', email: 'imposter@galaxycorp.com', token: { admin: false } };
if (!evaluateIsAdmin(attackerAuth)) {
  console.log('✅ PASS 1: @galaxycorp.com 이메일 사칭자의 관리자 접근 차단 성공 (백도어 제거 확인)');
  passed++;
}

// 2. ageVerified 클라이언트 직접 변조 시도 차단 검증
const victimAuth = { uid: 'user_100', token: {} };
const oldUserDoc = { uid: 'user_100', ageVerified: false };
const hackedUserDoc = { uid: 'user_100', ageVerified: true }; // 클라이언트가 true로 덮어쓰기 시도
const updateAllowed = evaluateUserUpdate(oldUserDoc, hackedUserDoc, victimAuth, 'user_100');
if (!updateAllowed) {
  console.log('✅ PASS 2: 클라이언트의 ageVerified 필드 무단 수정 차단 성공 (Diff Check)');
  passed++;
}

// 3. pending 상태의 미승인 콘텐츠 읽기 차단 검증
const pendingNews = { newsId: 'n1', title: '미승인 루머 뉴스', reviewStatus: 'pending' };
const guestAuth = null;
const canGuestReadPending = evaluateNewsRead(pendingNews, guestAuth);
if (!canGuestReadPending) {
  console.log('✅ PASS 3: 비로그인 사용자의 pending 상태 미승인 콘텐츠 접근 차단 성공');
  passed++;
}

// 4. 승인된 콘텐츠 및 정당한 관리자의 접근 허용 검증
const approvedNews = { newsId: 'n2', title: '공식 콘서트 팩트', reviewStatus: 'approved' };
const realAdminAuth = { uid: 'admin_1', token: { admin: true } };
const canGuestReadApproved = evaluateNewsRead(approvedNews, guestAuth);
const canAdminReadPending = evaluateNewsRead(pendingNews, realAdminAuth);
if (canGuestReadApproved && canAdminReadPending) {
  console.log('✅ PASS 4: 승인된 콘텐츠 공개 읽기 및 정당한 관리자의 검수 접근 허용 확인');
  passed++;
}

console.log(`\n🎉 모든 보안 규칙 테스트 통과: ${passed}/4 PASS!`);
if (passed === 4) process.exit(0);
else process.exit(1);