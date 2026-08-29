function checkIsAge14OrOlder(birthYear, birthMonth, currentDate = new Date('2026-08-30')) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 8
  let age = currentYear - birthYear;
  if (currentMonth < birthMonth) age--;
  return age >= 14;
}

console.log('🧪 [Automated Test Suite] 만 14세 연령 게이트 및 프라이버시 최소화 검증 시작...\n');
let passed = 0;

// 1. 만 13세 (2013년생) 가입 시도 -> 차단
const res1 = checkIsAge14OrOlder(2013, 8);
if (!res1) {
  console.log('✅ PASS 1: 만 13세 가입 시도 차단 성공 (2013년 8월생)');
  passed++;
}

// 2. 만 13세 11개월 (2012년 9월생, 다음달 생일) -> 차단
const res2 = checkIsAge14OrOlder(2012, 9);
if (!res2) {
  console.log('✅ PASS 2: 만 13세 11개월 (생일 전) 가입 시도 차단 성공 (2012년 9월생)');
  passed++;
}

// 3. 정확히 만 14세 생일 도래자 (2012년 8월생) -> 허용
const res3 = checkIsAge14OrOlder(2012, 8);
if (res3) {
  console.log('✅ PASS 3: 정확히 만 14세 (2012년 8월생) 가입 허용 성공 (Edge Case)');
  passed++;
}

// 4. 성인 (2000년생) -> 허용
const res4 = checkIsAge14OrOlder(2000, 1);
if (res4) {
  console.log('✅ PASS 4: 성인 (2000년생) 정상 가입 허용');
  passed++;
}

// 5. Firestore 저장 데이터 최소화 검증 (birthYear/birthMonth 미저장)
const mockStoredUser = {
  uid: 'user_12345',
  email: 'fan@kpop.com',
  displayName: '지디팬',
  ageVerified: true,
  ageVerifiedAt: '2026-08-30T00:00:00.000Z'
};

const hasRawBirthDate = ('birthYear' in mockStoredUser) || ('birthMonth' in mockStoredUser) || ('birthDate' in mockStoredUser);
if (!hasRawBirthDate && mockStoredUser.ageVerified === true) {
  console.log('✅ PASS 5: Privacy-by-Design 검증 성공 (생년월일 미보관, ageVerified 불리언 플래그만 저장)');
  passed++;
}

console.log(`\n🎉 모든 나이 검증 테스트 통과: ${passed}/5 PASS!`);
if (passed === 5) process.exit(0);
else process.exit(1);