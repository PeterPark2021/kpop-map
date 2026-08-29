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

function toBase64Url(str: string): string {
  const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(utf8Bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryStr = atob(base64);
  const utf8Str = Array.from(binaryStr)
    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('');
  return decodeURIComponent(utf8Str);
}

export function generateUnsubscribeToken(
  uid: string,
  secretKey: string = DEFAULT_SECRET,
  validDays: number = 90
): string {
  const expiry = Date.now() + validDays * 24 * 60 * 60 * 1000;
  const payload = `${uid}:${expiry}:unsubscribe`;
  const encodedPayload = toBase64Url(payload);
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
    payload = fromBase64Url(encodedPayload);
  } catch {
    return { valid: false, error: 'DECODE_ERROR' };
  }

  const payloadParts = payload.split(':');
  if (payloadParts.length !== 3) {
    return { valid: false, error: 'INVALID_PAYLOAD_STRUCTURE' };
  }

  const [uid, expiryStr, purpose] = payloadParts;
  const expiry = parseInt(expiryStr, 10);
  if (purpose !== 'unsubscribe') return { valid: false, error: 'INVALID_TOKEN_PURPOSE' };
  if (Date.now() > expiry) return { valid: false, error: 'TOKEN_EXPIRED' };
  const expectedSignature = simpleHmacSha256(payload, secretKey);
  if (receivedSignature !== expectedSignature) {
    return { valid: false, error: 'SIGNATURE_MISMATCH_TAMPERED' };
  }

  return { valid: true, uid };
}