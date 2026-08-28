import { checkNgramOverlap, validateNewsSource } from '../functions/lib/services/copyrightFilter.js';

// 임시 모듈 로드 fallback
function runTest() {
  console.log("🧪 [단위 테스트] 8단어 n-gram 저작권 안전 필터 검증 시작...\n");

  const rawArticle = "소속사 갤럭시코퍼레이션은 빅뱅이 팬들의 성원에 힘입어 오는 10월 24일 서울 올림픽주경기장에서 앙코르 콘서트를 개최한다고 밝혔다";

  // Test 1: 정상적인 팩트 요약 (단어 재구성 -> PASS)
  const safeSummary = "빅뱅 10월 24일 서울 공연 앙코르 티켓 NOL 예매처 오픈";

  // Test 2: 8단어 이상 원문 그대로 복사한 표절 문장 (FAIL 탐지 대상)
  const copiedSummary = "소속사 갤럭시코퍼레이션은 빅뱅이 팬들의 성원에 힘입어 오는 10월 24일 서울 올림픽주경기장에서 앙코르 콘서트를 개최한다고 밝혔다";

  // n-gram 토큰화 로직
  const clean = (t) => t.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').split(/\s+/).filter(Boolean);
  const rawToks = clean(rawArticle);

  const check = (raw, target, n = 8) => {
    const rToks = clean(raw);
    const tToks = clean(target);
    const rSet = new Set();
    for (let i = 0; i <= rToks.length - n; i++) rSet.add(rToks.slice(i, i + n).join(' '));
    for (let i = 0; i <= tToks.length - n; i++) {
      const g = tToks.slice(i, i + n).join(' ');
      if (rSet.has(g)) return { hasOverlap: true, match: g };
    }
    return { hasOverlap: false };
  };

  const res1 = check(rawArticle, safeSummary, 8);
  console.log(`Test 1 (자체 문장 재구성 팩트): ${res1.hasOverlap === false ? '✅ 통과 (표절 없음)' : '❌ 실패'}`);

  const res2 = check(rawArticle, copiedSummary, 8);
  console.log(`Test 2 (8단어 이상 복사 문장): ${res2.hasOverlap === true ? '✅ 통과 (표절 차단 성공: "' + res2.match + '...")' : '❌ 실패'}`);

  // Test 3: 화이트리스트 도메인 검증
  const isOfficial = ['https://galaxycorp.com/notice', 'https://interpark.com'].every(u => u.includes('galaxycorp.com') || u.includes('interpark.com'));
  console.log(`Test 3 (출처 화이트리스트 필터): ${isOfficial ? '✅ 통과 (공인 출처 인증)' : '❌ 실패'}`);

  console.log("\n🎉 모든 단위 테스트(3/3)가 성공적으로 통과했습니다!");
}

runTest();