import {
  EXPANDED_NEWS_SOURCES,
  isWhitelistedDomain,
  getSourceMetadata,
  checkNgramOverlap,
  isDuplicateFact
} from '../functions/src/services/copyrightFilter.ts';

console.log('🧪 [Test Suite] v2 RSS 소스 확장 및 저작권/중복 필터 단위 테스트 시작...\n');

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
  }
}

// 1. 도메인 화이트리스트 검증
assert(isWhitelistedDomain('https://ent.sbs.co.kr/news/article.do?id=123'), 'SBS연예뉴스 도메인 화이트리스트 통과');
assert(isWhitelistedDomain('https://starnewskorea.com/view/20260301'), '스타뉴스 도메인 화이트리스트 통과');
assert(isWhitelistedDomain('https://tenasia.hankyung.com/article/20260301'), '텐아시아 도메인 화이트리스트 통과');
assert(isWhitelistedDomain('https://isplus.com/article/view/123'), '일간스포츠 도메인 화이트리스트 통과');
assert(isWhitelistedDomain('https://pledis.co.kr/notice/view/456'), 'PLEDIS(세븐틴) 소속사 도메인 화이트리스트 통과');
assert(isWhitelistedDomain('https://www.jype.com/notice/view/789'), 'JYP(스트레이키즈) 소속사 도메인 화이트리스트 통과');
assert(!isWhitelistedDomain('https://unverified-blog.com/post/999'), '비인가 외부 블로그 도메인 차단');

// 2. official vs press 구분 검증
assert(getSourceMetadata('https://pledis.co.kr/notice/1').sourceType === 'official', 'PLEDIS 소스 타입 official 지정 확인');
assert(getSourceMetadata('https://jype.com/notice/1').sourceType === 'official', 'JYP 소스 타입 official 지정 확인');
assert(getSourceMetadata('https://news.sbs.co.kr/news/1').sourceType === 'press', 'SBS연예뉴스 소스 타입 press 지정 확인');
assert(getSourceMetadata('https://starnewskorea.com/1').sourceType === 'press', '스타뉴스 소스 타입 press 지정 확인');

// 3. 8-gram 표절 필터 검증 (신규 소스 기사 본문 대상)
const rawArticleSBS = '세븐틴 월드투어 서울 개막 공연 티켓 예매가 3월 15일 오후 8시 인터파크를 통해 시작됩니다.';
const plagiarizedSummary = '이번 세븐틴 월드투어 서울 개막 공연 티켓 예매가 3월 15일 오후 8시 인터파크를 통해 시작됩니다 안내.';
const cleanSummary = '2026 세븐틴 투어 티켓팅은 3월 15일 저녁 공식 예매처에서 오픈됩니다.';

assert(checkNgramOverlap(plagiarizedSummary, rawArticleSBS, 8).hasOverlap === true, '8-gram 일치 시 표절 정확히 탐지 및 차단');
assert(checkNgramOverlap(cleanSummary, rawArticleSBS, 8).hasOverlap === false, '자체 재구성 요약문 표절 필터 100% 통과');

// 4. 다중 소스 간 중복 수집 방지(Deduplication) 검증
const existingNews = ['세븐틴 2026 월드투어 서울 개막 공연 확정 안내'];
assert(isDuplicateFact('세븐틴 2026 월드투어 서울 개막 공연 확정', existingNews) === true, '타 언론사 동일 소식 중복 수집 방지 탐지');
assert(isDuplicateFact('스트레이키즈 북미 스타디움 추가 회차 티켓 오픈', existingNews) === false, '독립된 신규 팩트 정상 허용');

console.log(`\n🎉 테스트 완료: ${passed}/${total} 통과 (${Math.round((passed/total)*100)}%)`);
if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}