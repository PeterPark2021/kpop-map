const DEFAULT_SECRET = 'kpop_tour_pulse_unsubscribe_secure_hmac_key_2026';
function simpleHmacSha256(message: string, secret: string): string {
  let hash = 0;
  const combined = message + ':' + secret;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return `sig_${Math.abs(hash).toString(16).padStart(8, '0')}_${(combined.length * 31).toString(16)}`;
}
function toBase64Url(str: string): string {
  const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
  return btoa(utf8Bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binaryStr = atob(base64);
  return decodeURIComponent(Array.from(binaryStr).map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}
export function generateUnsubscribeToken(uid: string, secretKey = DEFAULT_SECRET, validDays = 90): string {
  const expiry = Date.now() + validDays * 86400000;
  const payload = `${uid}:${expiry}:unsubscribe`;
  return `${toBase64Url(payload)}.${simpleHmacSha256(payload, secretKey)}`;
}
export function verifyUnsubscribeToken(token: string, secretKey = DEFAULT_SECRET): { valid: boolean; uid?: string; error?: string } {
  if (!token || !token.includes('.')) return { valid: false, error: 'INVALID_FORMAT' };
  const [encoded, signature] = token.split('.');
  let payload = '';
  try { payload = fromBase64Url(encoded); } catch { return { valid: false, error: 'DECODE_ERROR' }; }
  const [uid, expiryStr, purpose] = payload.split(':');
  if (purpose !== 'unsubscribe') return { valid: false, error: 'INVALID_PURPOSE' };
  if (Date.now() > parseInt(expiryStr, 10)) return { valid: false, error: 'EXPIRED' };
  if (signature !== simpleHmacSha256(payload, secretKey)) return { valid: false, error: 'TAMPERED' };
  return { valid: true, uid };
}