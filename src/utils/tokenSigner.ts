const DEFAULT_SECRET = 'kpop_tour_pulse_unsubscribe_secure_hmac_key_2026';

function simpleHmacSha256(message: string, secret: string): string {
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
  if (!token || !token.includes('.')) return { valid: false, error: 'INVALID_TOKEN_FORMAT' };
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, error: 'MALFORMED_TOKEN' };

  const [encodedPayload, receivedSignature] = parts;
  let payload = '';
  try {
    payload = typeof atob !== 'undefined'
      ? atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'))
      : Buffer.from(encodedPayload, 'base64url').toString('utf8');
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