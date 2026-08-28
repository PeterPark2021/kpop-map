import { TourEvent, TourNewsFact, PipelineAuditLog, ArtistProfile } from '../types/types';

export const gdArtistProfile: ArtistProfile = {
  artistId: 'bigbang-gd',
  name: {
    ko: '지드래곤 & 빅뱅',
    en: 'G-DRAGON & BIGBANG',
    ja: 'G-DRAGON & BIGBANG',
    zh: 'G-DRAGON & BIGBANG',
    sea: 'G-DRAGON & BIGBANG'
  },
  description: {
    ko: '2026 빅뱅 20주년 기념 월드투어 & GD 솔로 프로젝트 아카이브',
    en: '2026 BIGBANG 20th Anniversary World Tour & G-DRAGON Solo Archive',
    ja: '2026 BIGBANG 20周年記念ワールドツアー & GDソロアーカイブ',
    zh: '2026 BIGBANG 20週年紀念世界巡迴 & GD個人項目檔案',
    sea: '2026 BIGBANG 20th Anniversary World Tour & GD Solo Archive'
  },
  isAnchor: true
};

export const initialBigBangTourEvents: TourEvent[] = [
  { eventId: 'bb-goyang-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '고양 (서울)', en: 'Goyang (Seoul)', ja: '高陽 (ソウル)', zh: '高陽 (首爾)', sea: 'Goyang' }, country: 'KR', venueName: 'Goyang Sports Complex', coordinates: { lat: 37.6584, lng: 126.8320 }, eventDate: '2026-04-18T18:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true, ticketUrl: 'https://tickets.example.com/bigbang-goyang' },
  { eventId: 'bb-auckland-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '오클랜드', en: 'Auckland', ja: 'オークランド', zh: '奧克蘭', sea: 'Auckland' }, country: 'NZ', venueName: 'Spark Arena', coordinates: { lat: -36.8485, lng: 174.7633 }, eventDate: '2026-05-02T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-newyork-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '뉴욕', en: 'New York', ja: 'ニューヨーク', zh: '紐約', sea: 'New York' }, country: 'US', venueName: 'Barclays Center', coordinates: { lat: 40.7128, lng: -74.0060 }, eventDate: '2026-05-15T20:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-paris-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '파리', en: 'Paris', ja: 'パリ', zh: '巴黎', sea: 'Paris' }, country: 'FR', venueName: 'Accor Arena', coordinates: { lat: 48.8566, lng: 2.3522 }, eventDate: '2026-05-26T19:30:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-london-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '런던', en: 'London', ja: 'ロンドン', zh: '倫敦', sea: 'London' }, country: 'GB', venueName: 'The O2 Arena', coordinates: { lat: 51.5074, lng: -0.1278 }, eventDate: '2026-06-02T19:30:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-taipei-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '타이베이', en: 'Taipei', ja: '台北', zh: '台北', sea: 'Taipei' }, country: 'TW', venueName: 'Taipei Dome', coordinates: { lat: 25.0330, lng: 121.5654 }, eventDate: '2026-06-13T19:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true },
  { eventId: 'bb-singapore-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '싱가포르', en: 'Singapore', ja: 'シンガポール', zh: '新加坡', sea: 'Singapore' }, country: 'SG', venueName: 'Singapore Indoor Stadium', coordinates: { lat: 1.3521, lng: 103.8198 }, eventDate: '2026-06-20T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-hanoi-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '하노이', en: 'Hanoi', ja: 'ハノイ', zh: '河內', sea: 'Hanoi' }, country: 'VN', venueName: 'My Dinh National Stadium', coordinates: { lat: 21.0285, lng: 105.8542 }, eventDate: '2026-06-27T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-sydney-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '시드니', en: 'Sydney', ja: 'シドニー', zh: '雪梨', sea: 'Sydney' }, country: 'AU', venueName: 'Qudos Bank Arena', coordinates: { lat: -33.8688, lng: 151.2093 }, eventDate: '2026-07-04T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-bangkok-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '방콕', en: 'Bangkok', ja: 'バンコク', zh: '曼谷', sea: 'Bangkok' }, country: 'TH', venueName: 'Impact Arena', coordinates: { lat: 13.7563, lng: 100.5018 }, eventDate: '2026-07-11T18:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-hongkong-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '홍콩', en: 'Hong Kong', ja: '香港', zh: '香港', sea: 'Hong Kong' }, country: 'HK', venueName: 'AsiaWorld-Arena', coordinates: { lat: 22.3193, lng: 114.1694 }, eventDate: '2026-07-18T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-osaka-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '오사카', en: 'Osaka', ja: '大阪', zh: '大阪', sea: 'Osaka' }, country: 'JP', venueName: 'Kyocera Dome Osaka', coordinates: { lat: 34.6937, lng: 135.5023 }, eventDate: '2026-08-01T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-nagoya-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '나고야', en: 'Nagoya', ja: '名古屋', zh: '名古屋', sea: 'Nagoya' }, country: 'JP', venueName: 'Vantelin Dome Nagoya', coordinates: { lat: 35.1815, lng: 136.9066 }, eventDate: '2026-08-08T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-tokyo-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '東京', sea: 'Tokyo' }, country: 'JP', venueName: 'Tokyo Dome', coordinates: { lat: 35.6762, lng: 139.6503 }, eventDate: '2026-08-15T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-fukuoka-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '후쿠오카', en: 'Fukuoka', ja: '福岡', zh: '福岡', sea: 'Fukuoka' }, country: 'JP', venueName: 'Mizuho PayPay Dome Fukuoka', coordinates: { lat: 33.5904, lng: 130.4017 }, eventDate: '2026-08-22T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-kualalumpur-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '쿠알라룸푸르', en: 'Kuala Lumpur', ja: 'クアラルンプール', zh: '吉隆坡', sea: 'Kuala Lumpur' }, country: 'MY', venueName: 'Axiata Arena', coordinates: { lat: 3.1390, lng: 101.6869 }, eventDate: '2026-09-05T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-jakarta-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '자카르타', en: 'Jakarta', ja: 'ジャカルタ', zh: '雅加達', sea: 'Jakarta' }, country: 'ID', venueName: 'Indonesia Arena', coordinates: { lat: -6.2088, lng: 106.8456 }, eventDate: '2026-09-12T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-kaohsiung-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' }, city: { ko: '가오슝', en: 'Kaohsiung', ja: '高雄', zh: '高雄', sea: 'Kaohsiung' }, country: 'TW', venueName: 'Kaohsiung National Stadium', coordinates: { lat: 22.6273, lng: 120.3014 }, eventDate: '2026-09-26T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true }
];

export const sampleNewsFacts: TourNewsFact[] = [
  // 🇰🇷 한국어 (KO)
  {
    newsId: 'fact-ko-001',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ko',
    title: '빅뱅 20주년 월드투어 공식 티켓 예매 일정 안내',
    factSummary: [
      '고양 종합운동장 개막 2회 공연 티켓 예매가 3월 15일 오후 8시 시작됩니다.',
      'VIP 패키지에는 사운드체크 입장권 및 공식 한정판 MD가 포함됩니다.',
      '해외 17개 도시 상세 일정은 공식 홈페이지를 통해 순차 공개됩니다.'
    ],
    sourceName: '갤럭시코퍼레이션 공식 공지',
    sourceUrl: 'https://galaxycorp.example.com',
    isOfficial: true,
    publishedAt: '2026-03-01T10:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-ko-002',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ko',
    title: '고양 개막 공연 좌석 등급 및 사운드체크 VIP 안내',
    factSummary: [
      '좌석 등급: VIP석 198,000원, R석 154,000원, S석 132,000원.',
      'VIP 관객은 본 공연 3시간 전 사전 리허설 사운드체크 관람이 가능합니다.',
      '전 좌석 1인 2매 예매 제한 및 모바일 신분증 본인 확인이 진행됩니다.'
    ],
    sourceName: 'NOL 티켓 공식 예매처',
    sourceUrl: 'https://nolticket.example.com',
    isOfficial: true,
    publishedAt: '2026-03-02T14:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-ko-003',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ko',
    title: '지드래곤 솔로 신곡 무대 월드투어 세트리스트 포함 확정',
    factSummary: [
      '2026 월드투어 세트리스트에 GD 신곡 및 빅뱅 완전체 히트곡 25곡 이상 편성.',
      '전체 공연 러닝타임은 약 160분으로 인터미션 없이 진행됩니다.'
    ],
    sourceName: '연예투데이 공식 보도자료',
    sourceUrl: 'https://news.example.com',
    isOfficial: true,
    publishedAt: '2026-03-03T11:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-pending-001',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ko',
    title: '방콕 및 하노이 스타디움 추가 회차 검토 속보',
    factSummary: [
      '동남아 2개 도시(방콕 Impact Arena, 하노이 My Dinh) 1회차씩 추가 개최 검토 중.',
      '현지 주최사 최종 인허가 완료 시 4월 중 공식 공지 예정.'
    ],
    sourceName: 'K-Pop Insider Asia',
    sourceUrl: 'https://kpop-insider.example.com',
    isOfficial: false,
    publishedAt: '2026-03-05T09:00:00Z',
    reviewStatus: 'pending'
  },

  // 🇺🇸 영어 (EN)
  {
    newsId: 'fact-en-001',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'en',
    title: 'BIGBANG 20th Anniversary World Tour Tickets Announcement',
    factSummary: [
      'Tickets for North America (NYC) and Europe (London/Paris) open on April 10.',
      'VIP Soundcheck and exclusive merchandise packages available.',
      'World Tour spans 18 cities with 31 shows globally.'
    ],
    sourceName: 'Live Nation Global Official',
    sourceUrl: 'https://livenation.example.com',
    isOfficial: true,
    publishedAt: '2026-03-03T12:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-en-002',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'en',
    title: 'New York Barclays Center 2-Day Show Details Released',
    factSummary: [
      'Shows scheduled for May 15 & 16 at Barclays Center, Brooklyn.',
      'General ticket sales begin April 12 via Ticketmaster.'
    ],
    sourceName: 'Barclays Center Press',
    sourceUrl: 'https://barclayscenter.example.com',
    isOfficial: true,
    publishedAt: '2026-03-04T10:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-en-003',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'en',
    title: 'London The O2 Arena & Paris Accor Arena Tour Schedule',
    factSummary: [
      'Paris Accor Arena show on May 26; London O2 Arena show on June 2.',
      'Presale for European fan club members starts on April 8.'
    ],
    sourceName: 'AEG Presents UK & Europe',
    sourceUrl: 'https://aegpresents.example.com',
    isOfficial: true,
    publishedAt: '2026-03-05T08:00:00Z',
    reviewStatus: 'approved'
  },

  // 🇯🇵 일본어 (JA)
  {
    newsId: 'fact-ja-001',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ja',
    title: 'BIGBANG 2026年日本4大ドームツアー開催決定',
    factSummary: [
      '大阪・名古屋・東京・福岡の4大ドームで全8公演を実施。',
      '日本ファンクラブ先行予約受付は4月1日より開始予定。'
    ],
    sourceName: '日本公式プレスリリース',
    sourceUrl: 'https://bigbang-jp.example.com',
    isOfficial: true,
    publishedAt: '2026-03-02T11:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-ja-002',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ja',
    title: '東京ドーム・京セラドーム大阪 チケット販売概要発表',
    factSummary: [
      '京セラドーム大阪（8月1-2日）、東京ドーム（8月15-16日）開催。',
      'VIP席にはリハーサル観覧チケットおよび限定プレミアムグッズが付属します。'
    ],
    sourceName: 'ローソンチケット公式',
    sourceUrl: 'https://l-tike.example.com',
    isOfficial: true,
    publishedAt: '2026-03-04T12:00:00Z',
    reviewStatus: 'approved'
  },

  // 🇹🇼 번체자 (ZH)
  {
    newsId: 'fact-zh-001',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'zh',
    title: 'BIGBANG 20週年世界巡迴 台北·高雄站門票即將開賣',
    factSummary: [
      '台北大巨蛋與高雄國家體育場共計4場演出門票將於4月15日開賣。',
      '官方售票系統為拓元售票，實名制購票以防黃牛。'
    ],
    sourceName: '台灣主辦單位官方公告',
    sourceUrl: 'https://tixcraft.example.com',
    isOfficial: true,
    publishedAt: '2026-03-04T10:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-zh-002',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'zh',
    title: '台北大巨蛋場次座位圖與VIP套票權益公開',
    factSummary: [
      '6月13-14日台北大巨蛋演出，全場實名制認證入場。',
      'VIP套票包含專屬入場通道、Soundcheck彩排觀賞及紀念周邊。'
    ],
    sourceName: 'Live Nation Taiwan',
    sourceUrl: 'https://livenation.tw.example.com',
    isOfficial: true,
    publishedAt: '2026-03-05T14:00:00Z',
    reviewStatus: 'approved'
  }
];

export const sampleAuditLogs: PipelineAuditLog[] = [
  {
    logId: 'audit-001',
    timestamp: '2026-03-05T09:12:30Z',
    articleTitle: '빅뱅 2026 월드투어 방콕 공연 일정 루머',
    sourceUrl: 'https://unverified-blog.example.com/post/123',
    status: 'BLOCKED_NGRAM',
    ngramMatchCount: 1,
    detectedOverlapSnippet: '방콕 공연 티켓 예매가 3월 15일 오후 8시 시작됩니다',
    detail: '원문 8연속 단어 일치 감지됨 (표절 방지 알고리즘에 의해 차단)'
  },
  {
    logId: 'audit-002',
    timestamp: '2026-03-05T09:12:35Z',
    articleTitle: '빅뱅 2026 월드투어 방콕 공연 일정 루머',
    sourceUrl: 'https://unverified-blog.example.com/post/123',
    status: 'RETRY_TRIGGERED',
    detail: '표절 탐지 후 Gemini AI에 사실관계 자체 문장 재구성 재시도 요청'
  },
  {
    logId: 'audit-003',
    timestamp: '2026-03-05T09:12:40Z',
    articleTitle: '빅뱅 2026 월드투어 방콕 공연 일정 루머',
    sourceUrl: 'https://unverified-blog.example.com/post/123',
    status: 'SUCCESS',
    detail: '재구성 완료: 8-gram 일치 0건 확인 -> Stage 6 검수 대기(pending) 등록'
  }
];