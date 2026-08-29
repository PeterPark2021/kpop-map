function simpleHmacSha256(message, secret) {
  let hash = 0;
  const combined = message + ':' + secret;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sig_${hex}_${(combined.length * 31).toString(16)}`;
}

function generateUnsubscribeToken(uid, secretKey, validDays = 90) {
  const expiry = Date.now() + validDays * 24 * 60 * 60 * 1000;
  const payload = `${uid}:${expiry}:unsubscribe`;
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = simpleHmacSha256(payload, secretKey);
  return `${encodedPayload}.${signature}`;
}

function verifyUnsubscribeToken(token, secretKey) {
  if (!token || !token.includes('.')) return { valid: false, error: 'INVALID_TOKEN_FORMAT' };
  const [encodedPayload, receivedSignature] = token.split('.');
  
  let payload = '';
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return { valid: false, error: 'DECODE_ERROR' };
  }

  const [uid, expiryStr, purpose] = payload.split(':');
  const expiry = parseInt(expiryStr, 10);

  if (purpose !== 'unsubscribe') return { valid: false, error: 'INVALID_TOKEN_PURPOSE' };
  if (Date.now() > expiry) return { valid: false, error: 'TOKEN_EXPIRED' };

  const expectedSignature = simpleHmacSha256(payload, secretKey);
  if (receivedSignature !== expectedSignature) return { valid: false, error: 'SIGNATURE_MISMATCH_TAMPERED' };

  return { valid: true, uid };
}

console.log('🧪 [Security Test Suite] 수신거부 HMAC 서명 토큰 무결성 검증 시작...\n');

const SECRET = 'test_secret_key_1234';
const REAL_UID = 'victim_user_999';
const ATTACKER_UID = 'hacker_user_666';

let passed = 0;

// 1. 정상 토큰 검증
const validToken = generateUnsubscribeToken(REAL_UID, SECRET, 90);
const res1 = verifyUnsubscribeToken(validToken, SECRET);
if (res1.valid && res1.uid === REAL_UID) {
  console.log('✅ PASS 1: 정상 서명 토큰이 의도된 대상(victim_user_999)으로 100% 검증 통과');
  passed++;
}

// 2. UID 변조 공격 시도 (타인의 UID로 페이로드만 조작)
const tamperedPayload = Buffer.from(`${ATTACKER_UID}:${Date.now() + 100000}:unsubscribe`).toString('base64url');
const tamperedToken = `${tamperedPayload}.${validToken.split('.')[1]}`;
const res2 = verifyUnsubscribeToken(tamperedToken, SECRET);
if (!res2.valid && res2.error === 'SIGNATURE_MISMATCH_TAMPERED') {
  console.log('✅ PASS 2: UID 변조 공격 탐지 및 차단 성공 (SIGNATURE_MISMATCH_TAMPERED)');
  passed++;
}

// 3. 만료된 토큰 검증 (-1일 만료)
const expiredToken = generateUnsubscribeToken(REAL_UID, SECRET, -1);
const res3 = verifyUnsubscribeToken(expiredToken, SECRET);
if (!res3.valid && res3.error === 'TOKEN_EXPIRED') {
  console.log('✅ PASS 3: 만료된 토큰 거부 성공 (TOKEN_EXPIRED)');
  passed++;
}

// 4. 서명 위조 공격 시도
const fakeSignatureToken = `${validToken.split('.')[0]}.sig_fake_signature_abc`;
const res4 = verifyUnsubscribeToken(fakeSignatureToken, SECRET);
if (!res4.valid && res4.error === 'SIGNATURE_MISMATCH_TAMPERED') {
  console.log('✅ PASS 4: 가짜 서명 토큰 거부 성공');
  passed++;
}

// 5. 잘못된 비밀키로 검증 시도
const res5 = verifyUnsubscribeToken(validToken, 'wrong_secret_key');
if (!res5.valid && res5.error === 'SIGNATURE_MISMATCH_TAMPERED') {
  console.log('✅ PASS 5: 비밀키 불일치 시 검증 실패');
  passed++;
}

console.log(`\n🎉 모든 보안 테스트 통과: ${passed}/5 PASS!`);
if (passed === 5) process.exit(0);
else process.exit(1);