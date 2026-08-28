/**
 * [저작권 보호 및 출처 화이트리스트 검증 서비스]
 * - 8연속 단어 일치(8-gram) 표절 탐지
 * - official (소속사 공식) vs press (언론사 보도) 구분
 * - 다중 소스 간 중복 팩트 수집 방지 (Deduplication)
 */

export type SourceType = 'official' | 'press';
export type IngestionMethod = 'rss' | 'scraper';

export interface NewsSourceConfig {
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;
  domain: string;
  feedUrl?: string;
  noticeUrl?: string;
  ingestionMethod: IngestionMethod;
  status: 'active' | 'deferred_scraper';
}

export const EXPANDED_NEWS_SOURCES: NewsSourceConfig[] = [
  // 1. 기존 핵심 통신사 (press)
  { sourceId: 'yna', sourceName: '연합뉴스', sourceType: 'press', domain: 'yna.co.kr', feedUrl: 'https://www.yna.co.kr/rss/entertainment.xml', ingestionMethod: 'rss', status: 'active' },
  { sourceId: 'news1', sourceName: '뉴스1', sourceType: 'press', domain: 'news1.kr', feedUrl: 'https://www.news1.kr/rss/entertain.xml', ingestionMethod: 'rss', status: 'active' },
  { sourceId: 'newsis', sourceName: '뉴시스', sourceType: 'press', domain: 'newsis.com', feedUrl: 'https://newsis.com/rss/ent.xml', ingestionMethod: 'rss', status: 'active' },

  // 2. 신규 확장 언론사 (press)
  { sourceId: 'sbs-ent', sourceName: 'SBS연예뉴스', sourceType: 'press', domain: 'sbs.co.kr', feedUrl: 'https://news.sbs.co.kr/news/SectionRssFeed.do?sectionId=09', ingestionMethod: 'rss', status: 'active' },
  { sourceId: 'star-news', sourceName: '스타뉴스', sourceType: 'press', domain: 'starnewskorea.com', feedUrl: 'https://star.mt.co.kr/rss/star_rss.xml', ingestionMethod: 'rss', status: 'active' },
  { sourceId: 'tenasia', sourceName: '텐아시아', sourceType: 'press', domain: 'tenasia.hankyung.com', feedUrl: 'https://tenasia.hankyung.com/rss/all.xml', ingestionMethod: 'rss', status: 'active' },
  { sourceId: 'isplus', sourceName: '일간스포츠', sourceType: 'press', domain: 'isplus.com', ingestionMethod: 'scraper', status: 'deferred_scraper' },

  // 3. 소속사 공식 발표 (official - 신뢰도 최상)
  { sourceId: 'galaxy-corp', sourceName: '갤럭시코퍼레이션 공식 공지', sourceType: 'official', domain: 'galaxycorp.com', noticeUrl: 'https://galaxycorp.com/notice', ingestionMethod: 'rss', status: 'active' },
  { sourceId: 'yg-family', sourceName: 'YG Entertainment 공식 발표', sourceType: 'official', domain: 'ygfamily.com', noticeUrl: 'https://ygfamily.com/notice', ingestionMethod: 'scraper', status: 'active' },
  { sourceId: 'bighit-music', sourceName: '빅히트 뮤직 공식 발표', sourceType: 'official', domain: 'ibighit.com', noticeUrl: 'https://ibighit.com/bts/notice', ingestionMethod: 'scraper', status: 'active' },
  { sourceId: 'pledis-ent', sourceName: 'PLEDIS Entertainment 공식 발표', sourceType: 'official', domain: 'pledis.co.kr', noticeUrl: 'https://pledis.co.kr/notice', ingestionMethod: 'scraper', status: 'deferred_scraper' },
  { sourceId: 'jyp-ent', sourceName: 'JYP Entertainment 공식 발표', sourceType: 'official', domain: 'jype.com', noticeUrl: 'https://www.jype.com/notice', ingestionMethod: 'scraper', status: 'deferred_scraper' }
];

export const OFFICIAL_WHITELIST_DOMAINS: string[] = EXPANDED_NEWS_SOURCES.map(s => s.domain);

/**
 * 도메인 화이트리스트 검증
 */
export function isWhitelistedDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return OFFICIAL_WHITELIST_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * 출처 메타데이터 및 source_type('official' | 'press') 조회
 */
export function getSourceMetadata(url: string): { sourceType: SourceType; sourceName: string; isOfficial: boolean } {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const match = EXPANDED_NEWS_SOURCES.find(s => hostname === s.domain || hostname.endsWith(`.${s.domain}`));

    if (match) {
      return {
        sourceType: match.sourceType,
        sourceName: match.sourceName,
        isOfficial: match.sourceType === 'official'
      };
    }
  } catch {
    // fallback
  }

  return { sourceType: 'press', sourceName: '일반 보도', isOfficial: false };
}

/**
 * 8-gram 연속 단어 일치 표절 탐지
 */
export function checkNgramOverlap(
  generatedSummary: string,
  rawSourceContent: string,
  n: number = 8
): { hasOverlap: boolean; matchCount: number; matchedSnippets: string[] } {
  const cleanSummary = generatedSummary.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanRaw = rawSourceContent.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ').replace(/\s+/g, ' ').trim();

  const summaryWords = cleanSummary.split(' ').filter(Boolean);
  const rawWords = cleanRaw.split(' ').filter(Boolean);

  if (summaryWords.length < n || rawWords.length < n) {
    return { hasOverlap: false, matchCount: 0, matchedSnippets: [] };
  }

  const rawNgrams = new Set<string>();
  for (let i = 0; i <= rawWords.length - n; i++) {
    rawNgrams.add(rawWords.slice(i, i + n).join(' '));
  }

  const matchedSnippets: string[] = [];
  for (let i = 0; i <= summaryWords.length - n; i++) {
    const ngram = summaryWords.slice(i, i + n).join(' ');
    if (rawNgrams.has(ngram)) {
      matchedSnippets.push(ngram);
    }
  }

  return {
    hasOverlap: matchedSnippets.length > 0,
    matchCount: matchedSnippets.length,
    matchedSnippets
  };
}

/**
 * 다중 소스 간 중복 수집 방지 (Deduplication)
 * - 동일 아티스트, 동일 날짜/장소의 기사가 이미 존재하면 'official'을 우선 보존하고 중복 수집 방지
 */
export function isDuplicateFact(newTitle: string, existingTitles: string[]): boolean {
  const normalize = (t: string) => t.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '').toLowerCase();
  const normalizedNew = normalize(newTitle);

  return existingTitles.some(existing => {
    const normExisting = normalize(existing);
    return normalizedNew.includes(normExisting) || normExisting.includes(normalizedNew);
  });
}