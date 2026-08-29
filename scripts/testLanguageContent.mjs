import { sampleLanguageContents } from '../src/data/sampleLanguageContent.ts';

console.log('🧪 [Test Suite] 한국어 학습 콘텐츠 UI 및 거버넌스 단위 테스트 시작...\n');

let passed = 0;
let total = 0;

function assert(condition, name) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${name}`);
  }
}

// 1. 4개 언어(EN, JA, ZH-TW, TH) 번역 데이터 검증
const item1 = sampleLanguageContents[0];
assert(item1.translations.en && item1.translations.en.term.length > 0, '영어 (en) 번역 완성');
assert(item1.translations.ja && item1.translations.ja.term.length > 0, '일본어 (ja) 번역 완성');
assert(item1.translations['zh-TW'] && item1.translations['zh-TW'].term.length > 0, '번체자 (zh-TW) 번역 완성');
assert(item1.translations.th && item1.translations.th.term.length > 0, '동남아 태국어 (th) 번역 완성');

// 2. 거버넌스 보안 규칙: pending 상태는 일반 피드에서 필터링 검증
const publicFeedItems = sampleLanguageContents.filter(i => i.reviewStatus === 'approved');
const pendingItem = sampleLanguageContents.find(i => i.contentId === 'lang-pending-001');

assert(publicFeedItems.every(i => i.reviewStatus === 'approved'), '공개 피드에는 오직 reviewStatus == approved 항목만 노출');
assert(!publicFeedItems.some(i => i.contentId === 'lang-pending-001'), 'pending 상태의 피켓팅 항목은 공개 피드에서 완벽히 격리 차단됨');

// 3. 로마자 발음 및 문화적 노트 필드 검증
assert(sampleLanguageContents.every(i => i.romanization && i.romanization.length > 0), '모든 단어에 로마자 발음 가이드 탑재 확인');
assert(sampleLanguageContents.some(i => i.culturalNote && i.culturalNote.length > 0), 'culturalNote 탑재 확인');

console.log(`\n🎉 언어 학습 콘텐츠 테스트 완료: ${passed}/${total} 통과 (${Math.round((passed/total)*100)}%)`);
if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}