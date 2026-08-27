// 신뢰할 수 있는 공식 출처 도메인 화이트리스트
const OFFICIAL_WHITELIST_DOMAINS = [
  'galaxycorp.com',
  'ygfamily.com',
  'interpark.com',
  'nolticket.com',
  'ticketmaster.com',
  'livenation.com',
  'bigbang-jp.com'
];

export interface RawNewsInput {
  title: string;
  sourceUrl: string;
  sourceName: string;
  rawContent: string;
  publishedAt: string;
}

export function validateNewsSource(input: RawNewsInput): { isValid: boolean; isOfficial: boolean } {
  try {
    const url = new URL(input.sourceUrl);
    const isOfficial = OFFICIAL_WHITELIST_DOMAINS.some(domain => url.hostname.includes(domain));
    return {
      isValid: true,
      isOfficial
    };
  } catch {
    return {
      isValid: false,
      isOfficial: false
    };
  }
}