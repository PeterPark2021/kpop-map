/**
 * [공식 출처 자동 수집 크롤러 모듈]
 * 소속사 공식 공지 RSS 및 티켓팅 플랫폼의 일정 변경을 감지합니다.
 */
export async function fetchLatestOfficialAnnouncements() {
  console.log("📡 [Crawler] 갤럭시코퍼레이션 / YG / NOL 티켓 공식 피드 수집 중...");

  // 감지된 최신 공지 시뮬레이션
  return [
    {
      sourceName: "갤럭시코퍼레이션 공식 공지",
      sourceUrl: "https://galaxycorp.com/notice/2026-worldtour-update",
      title: "빅뱅 2026 월드투어 일부 도시 공연장 및 좌석 배치도 최종 확정",
      rawContent: "2026 빅뱅 월드투어 서울, 오사카, 도쿄, 뉴욕 공연장의 최종 좌석 배치도와 VIP 사운드체크 패키지 입장 동선이 확정되었습니다. 티켓 예매는 공인 예매처를 통해서만 진행됩니다.",
      publishedAt: new Date().toISOString()
    }
  ];
}