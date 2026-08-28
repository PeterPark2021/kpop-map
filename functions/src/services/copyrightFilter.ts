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
    return { isValid: true, isOfficial };
  } catch {
    return { isValid: false, isOfficial: false };
  }
}

/**
 * [8단어 n-gram 연속 일치 검증]
 * 원문 기사에서 8단어 이상 연속으로 일치하는 문장이 요약본에 포함되었는지 검사 (표절 방지)
 */
export function checkNgramOverlap(rawText: string, summaryText: string, n: number = 8): { hasOverlap: boolean; matchedNgrams: string[] } {
  const cleanTokens = (text: string) =>
    text
      .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 0);

  const rawTokens = cleanTokens(rawText);
  const summaryTokens = cleanTokens(summaryText);

  if (summaryTokens.length < n || rawTokens.length < n) {
    return { hasOverlap: false, matchedNgrams: [] };
  }

  // 원문에서 모든 n-gram 집합(Set) 추출
  const rawNgrams = new Set<string>();
  for (let i = 0; i <= rawTokens.length - n; i++) {
    const ngram = rawTokens.slice(i, i + n).join(' ');
    rawNgrams.add(ngram);
  }

  // 요약본이 원문의 n-gram을 그대로 베꼈는지 검사
  const matchedNgrams: string[] = [];
  for (let i = 0; i <= summaryTokens.length - n; i++) {
    const ngram = summaryTokens.slice(i, i + n).join(' ');
    if (rawNgrams.has(ngram)) {
      matchedNgrams.push(ngram);
    }
  }

  return {
    hasOverlap: matchedNgrams.length > 0,
    matchedNgrams
  };
}