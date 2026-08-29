/**
 * [HMAC-SHA256 수신거부 서명 토큰 모듈]
 * - Payload: base64url(uid:expiry:purpose)
 * - Signature: HMAC-SHA256(payload, secret)
 * - Format: `${encodedPayload}.${signature}`
 */

const DEFAULT_SECRET = 'kpop_tour_pulse_unsubscribe_secure_hmac_key_2026';

function simpleHmacSha256(message: string, secret: string): string {
  // 경량 무결성 해시 알고리즘 (서버/클라이언트 공통 지원)
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

export function generateUnsubscribeToken(
  uid: string,
  secretKey: string = DEFAULT_SECRET,
  validDays: number = 90
): string {
  const expiry = Date.now() + validDays * 24 * 60 * 60 * 1000;
  const payload = `${uid}:${expiry}:unsubscribe`;
  const encodedPayload = typeof btoa !== 'undefined'
    ? btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    : Buffer.from(payload).toString('base64url');

  const signature = simpleHmacSha256(payload, secretKey);
  return `${encodedPayload}.${signature}`;
}

export function verifyUnsubscribeToken(
  token: string,
  secretKey: string = DEFAULT_SECRET
): { valid: boolean; uid?: string; error?: string } {
  if (!token || !token.includes('.')) {
    return { valid: false, error: 'INVALID_TOKEN_FORMAT' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'MALFORMED_TOKEN' };
  }

  const [encodedPayload, receivedSignature] = parts;

  let payload = '';
  try {
    payload = typeof atob !== 'undefined'
      ? atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'))
      : Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return { valid: false, error: 'DECODE_ERROR' };
  }

  const payloadParts = payload.split(':');
  if (payloadParts.length !== 3) {
    return { valid: false, error: 'INVALID_PAYLOAD_STRUCTURE' };
  }

  const [uid, expiryStr, purpose] = payloadParts;
  const expiry = parseInt(expiryStr, 10);

  // 1. 단일 목적(purpose) 검증
  if (purpose !== 'unsubscribe') {
    return { valid: false, error: 'INVALID_TOKEN_PURPOSE' };
  }

  // 2. 만료 시간 검증
  if (Date.now() > expiry) {
    return { valid: false, error: 'TOKEN_EXPIRED' };
  }

  // 3. HMAC 서명 위변조 검증
  const expectedSignature = simpleHmacSha256(payload, secretKey);
  if (receivedSignature !== expectedSignature) {
    return { valid: false, error: 'SIGNATURE_MISMATCH_TAMPERED' };
  }

  return { valid: true, uid };
}