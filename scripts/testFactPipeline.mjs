/**
 * [AI 팩트 추출 및 다국어 파이프라인 시뮬레이션]
 */
const sampleArticle = `
빅뱅, 2026년 20주년 기념 월드투어 서울 앙코르 추가 공연 확정!
소속사 갤럭시코퍼레이션은 27일 공식 보도자료를 통해 "빅뱅이 팬들의 뜨거운 성원에 힘입어 오는 10월 24~25일 서울 올림픽주경기장에서 앙코르 콘서트를 2회 추가 개최한다"고 밝혔다.
티켓 예매는 NOL 티켓을 통해 9월 10일 오후 8시에 오픈되며, 티켓 가격은 VIP석 198,000원, R석 154,000원이다.
빅뱅은 앞서 고양, 뉴욕, 파리, 도쿄 등 18개 도시에서 월드투어를 성황리에 진행 중이다.
`;

console.log("==================================================");
console.log("📥 [1단계] 뉴스 원문 수집:");
console.log(sampleArticle.trim());
console.log("==================================================");

console.log("\n🛡️ [2단계] 저작권 필터 및 AI 사실관계 추출 (Fact-only):");
const mockOutput = {
  ko: {
    title: "빅뱅 20주년 투어 서울 앙코르 콘서트 2회 추가 개최",
    factSummary: [
      "공연 일시: 2026년 10월 24일 ~ 25일 (총 2회)",
      "공연 장소: 서울 올림픽주경기장",
      "티켓 오픈: 9월 10일 오후 8시 (NOL 티켓)",
      "티켓 가격: VIP석 198,000원 / R석 154,000원"
    ]
  },
  ja: {
    title: "BIGBANG 20周年ツアー ソウルアンコール公演2回追加決定",
    factSummary: [
      "公演日程: 2026年10月24日〜25日 (全2回)",
      "会場: ソウル オリンピック主競技場",
      "チケット受付: 9月10日 20:00 (NOLチケット)",
      "価格: VIP席 198,000ウォン / R席 154,000ウォン"
    ]
  },
  en: {
    title: "BIGBANG Announces 2-Day Seoul Encore Shows for 20th Anniversary Tour",
    factSummary: [
      "Dates: October 24–25, 2026 (2 shows)",
      "Venue: Seoul Olympic Stadium",
      "Ticket Sale: Sept 10 at 8:00 PM KST via NOL Ticket",
      "Prices: VIP 198,000 KRW / R 154,000 KRW"
    ]
  },
  zh: {
    title: "BIGBANG 20週年世界巡迴 首爾安可場加開2場確定",
    factSummary: [
      "演出日期：2026年10月24日～25日（共2場）",
      "演出場地：首爾奧林匹克主競技場",
      "門票開賣：9月10日 20:00（NOL Ticket）",
      "票價：VIP區 198,000韓元 / R區 154,000韓元"
    ]
  }
};

console.log("✅ [3단계] 5개 언어별 저작권 안심 팩트 카드 생성 결과:");
console.log("🇰🇷 [KO]:", JSON.stringify(mockOutput.ko, null, 2));
console.log("🇯🇵 [JA]:", JSON.stringify(mockOutput.ja, null, 2));
console.log("🇺🇸 [EN]:", JSON.stringify(mockOutput.en, null, 2));
console.log("🇹🇼 [ZH]:", JSON.stringify(mockOutput.zh, null, 2));
console.log("==================================================");
console.log("🎉 Firestore newsFacts 컬렉션에 자동 저장 준비 완료!");