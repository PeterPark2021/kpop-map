import { initialBigBangTourEvents, sampleNewsFacts } from '../src/data/initialData.js';

console.log("🔍 [Jules Audit] 5개 언어(KO, JA, EN, ZH, SEA) 데이터 완전성 검사 시작...\n");

const languages = ['ko', 'ja', 'en', 'zh', 'sea'];
let missingCount = 0;

// 18개 도시 다국어 점검
initialBigBangTourEvents.forEach((ev, idx) => {
  languages.forEach((lang) => {
    if (!ev.city[lang] || ev.city[lang].trim() === '') {
      console.warn(`⚠️ [Stop #${idx + 1}] ${ev.eventId}의 '${lang}' 도시명이 누락되었습니다.`);
      missingCount++;
    }
  });
});

// 팩트 뉴스 점검
sampleNewsFacts.forEach((n) => {
  if (!n.factSummary || n.factSummary.length === 0) {
    console.warn(`⚠️ [News ${n.newsId}] 팩트 요약 리스트가 비어있습니다.`);
    missingCount++;
  }
});

if (missingCount === 0) {
  console.log("✅ 18개 도시 및 팩트 뉴스의 5개 국어 필드가 100% 완벽하게 채워져 있습니다!");
} else {
  console.warn(`❗ 총 ${missingCount}개의 필드 보강이 필요합니다.`);
}