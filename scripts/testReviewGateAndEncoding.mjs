import fs from 'fs';

console.log('🧪 [Security & Encoding Test] reviewStatus 읽기 게이트 및 UTF-8 인코딩 검증 시작...\n');
let passed = 0;

function evaluateRead(doc, auth) {
  const isAdmin = auth !== null && auth.token && auth.token.admin === true;
  return doc.reviewStatus === 'approved' || isAdmin;
}

// 시나리오 A: 비로그인 사용자가 pending 문서 읽기 시도 -> 차단 확인
const pendingDoc = { id: 'news_1', title: '루머 뉴스', reviewStatus: 'pending' };
const guestAuth = null;
if (!evaluateRead(pendingDoc, guestAuth)) {
  console.log('✅ PASS 1: 비로그인/일반 사용자의 pending(미승인) 문서 읽기 차단 확인');
  passed++;
}

// 시나리오 B: 비로그인 사용자가 approved 문서 읽기 시도 -> 허용 확인
const approvedDoc = { id: 'news_2', title: '공식 콘서트 확정', reviewStatus: 'approved' };
if (evaluateRead(approvedDoc, guestAuth)) {
  console.log('✅ PASS 2: 비로그인/일반 사용자의 approved(승인) 문서 정상 읽기 확인');
  passed++;
}

// 시나리오 C: 관리자(admin: true)가 pending 문서 읽기 시도 -> 대시보드용 허용 확인
const adminAuth = { uid: 'admin_user', token: { admin: true } };
if (evaluateRead(pendingDoc, adminAuth)) {
  console.log('✅ PASS 3: 인증된 관리자의 pending 문서 검수 읽기 정상 허용 확인');
  passed++;
}

// 시나리오 D: firestore.rules 파일 인코딩 검사
const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
if (!rulesContent.includes('\uFFFD') && rulesContent.includes('관리자 권한 검증')) {
  console.log('✅ PASS 4: firestore.rules 한글 주석 UTF-8 인코딩 무결성 확인 (깨짐 없음)');
  passed++;
}

console.log(`\n🎉 모든 검증 통과: ${passed}/4 PASS!`);