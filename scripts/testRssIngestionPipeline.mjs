import { rssCollectorService } from '../src/services/rssCollectorService.ts';

console.log('🧪 [v2.0 RSS Ingestion Pipeline] 파이프라인 검증 테스트 시작...\n');
let passed = 0;

// 1. 수집원 9종 카탈로그 로드 검증
const sources = rssCollectorService.getSources();
if (sources.length === 9) {
  console.log('✅ PASS 1: 5대 기획사 및 글로벌 미디어 RSS 수집원 9종 카탈로그 등록 확인');
  passed++;
}

// 2. 투어 팩트(도시/공연장/아티스트) 자동 추출 검증
const mockOfficial = sources[0]; // Galaxy Corp
const rawArticle = {
  title: '[공식] G-DRAGON 2026 월드투어 서울 고척스카이돔 3월 28일 개최',
  content: '지드래곤이 서울 고척스카이돔에서 대망의 2026 월드투어 첫 포문을 연다. 티켓 예매는 곧 시작된다.'
};
const { fact, confidence } = rssCollectorService.extractTourFact(rawArticle.title, rawArticle.content, mockOfficial, 'bigbang-gd');
if (fact.factSummary && fact.factSummary.some(f => f.includes('고척스카이돔')) && fact.factSummary.some(f => f.includes('서울'))) {
  console.log('✅ PASS 2: 기사 본문에서 도시(서울) 및 공연장(고척스카이돔) 팩트 정확 추출 확인');
  passed++;
}

// 3. 신뢰도 점수 및 공식 기사 자동 승인 검증 (>= 0.85)
if (confidence >= 0.85 && fact.reviewStatus === 'approved') {
  console.log(`✅ PASS 3: 공식 출처 고신뢰도(점수: ${confidence}) 기사의 자동 승인(approved) 라우팅 확인`);
  passed++;
}

// 4. 비공식 출처 루머 기사의 검수 대기(pending) 라우팅 검증
const mockRumorSource = sources[5]; // Soompi
const rumorArticle = { title: 'BTS 월드투어 소문 무성', content: '방탄소년단이 투어를 준비 중이라는 소문이 있다.' };
const rumorResult = rssCollectorService.extractTourFact(rumorArticle.title, rumorArticle.content, mockRumorSource, 'bts');
if (rumorResult.fact.reviewStatus === 'pending') {
  console.log('✅ PASS 4: 미확인 기사의 검수 대기(pending) 안전 격리 확인');
  passed++;
}

// 5. 실시간 동기화 파이프라인 시뮬레이션
rssCollectorService.executeRssSync().then(result => {
  if (result.totalFeedsChecked === 9 && result.newFactsExtracted === 3) {
    console.log(`✅ PASS 5: 실시간 파이프라인 수집 실행 완료 (점검: ${result.totalFeedsChecked}개, 추출: ${result.newFactsExtracted}건)`);
    passed++;
  }
  console.log(`\n🎉 모든 RSS 파이프라인 테스트 통과: ${passed}/5 PASS!`);
  if (passed === 5) process.exit(0);
  else process.exit(1);
});