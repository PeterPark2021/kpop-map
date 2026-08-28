import { TourEvent, TourNewsFact, ArtistProfile } from '../types/types';

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
  { eventId: 'bb-goyang-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '고양 (서울)', en: 'Goyang (Seoul)', ja: '高陽 (ソウル)', zh: '高陽 (首爾)', sea: 'Goyang' }, country: 'KR', venueName: { ko: '고양 종합운동장', en: 'Goyang Sports Complex', ja: '高陽総合運動場', zh: '高陽體育園區', sea: 'Goyang Sports Complex' }, coordinates: { lat: 37.6584, lng: 126.8320 }, eventDate: '2026-04-18T18:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true, ticketUrl: 'https://tickets.example.com/bigbang-goyang' },
  { eventId: 'bb-auckland-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '오클랜드', en: 'Auckland', ja: 'オークランド', zh: '奧克蘭', sea: 'Auckland' }, country: 'NZ', venueName: { ko: '스파크 아레나', en: 'Spark Arena', ja: 'スパーク・アリーナ', zh: '星火競技場', sea: 'Spark Arena' }, coordinates: { lat: -36.8485, lng: 174.7633 }, eventDate: '2026-05-02T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-newyork-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '뉴욕', en: 'New York', ja: 'ニューヨーク', zh: '紐約', sea: 'New York' }, country: 'US', venueName: { ko: '바클레이스 센터', en: 'Barclays Center', ja: 'バークレイズ・センター', zh: '巴克萊中心', sea: 'Barclays Center' }, coordinates: { lat: 40.7128, lng: -74.0060 }, eventDate: '2026-05-15T20:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-paris-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '파리', en: 'Paris', ja: 'パリ', zh: '巴黎', sea: 'Paris' }, country: 'FR', venueName: { ko: '아코르 아레나', en: 'Accor Arena', ja: 'アコー・アリーナ', zh: '雅高體育館', sea: 'Accor Arena' }, coordinates: { lat: 48.8566, lng: 2.3522 }, eventDate: '2026-05-26T19:30:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-london-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '런던', en: 'London', ja: 'ロンドン', zh: '倫敦', sea: 'London' }, country: 'GB', venueName: { ko: 'O2 아레나', en: 'The O2 Arena', ja: 'The O2アリーナ', zh: 'O2體育館', sea: 'The O2 Arena' }, coordinates: { lat: 51.5074, lng: -0.1278 }, eventDate: '2026-06-02T19:30:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-taipei-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '타이베이', en: 'Taipei', ja: '台北', zh: '台北', sea: 'Taipei' }, country: 'TW', venueName: { ko: '타이베이 돔', en: 'Taipei Dome', ja: '台北ドーム', zh: '臺北大巨蛋', sea: 'Taipei Dome' }, coordinates: { lat: 25.0330, lng: 121.5654 }, eventDate: '2026-06-13T19:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true },
  { eventId: 'bb-singapore-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '싱가포르', en: 'Singapore', ja: 'シンガポール', zh: '新加坡', sea: 'Singapore' }, country: 'SG', venueName: { ko: '싱가포르 실내체육관', en: 'Singapore Indoor Stadium', ja: 'シンガポール・インドア・スタジアム', zh: '新加坡室內體育館', sea: 'Singapore Indoor Stadium' }, coordinates: { lat: 1.3521, lng: 103.8198 }, eventDate: '2026-06-20T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-hanoi-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '하노이', en: 'Hanoi', ja: 'ハノイ', zh: '河內', sea: 'Hanoi' }, country: 'VN', venueName: { ko: '미딘 국립경기장', en: 'My Dinh National Stadium', ja: 'ミーディン国立競技場', zh: '美亭國家體育場', sea: 'My Dinh National Stadium' }, coordinates: { lat: 21.0285, lng: 105.8542 }, eventDate: '2026-06-27T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-sydney-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '시드니', en: 'Sydney', ja: 'シドニー', zh: '雪梨', sea: 'Sydney' }, country: 'AU', venueName: { ko: '쿠도스 뱅크 아레나', en: 'Qudos Bank Arena', ja: 'クードス・バンク・アリーナ', zh: '庫多斯銀行體育館', sea: 'Qudos Bank Arena' }, coordinates: { lat: -33.8688, lng: 151.2093 }, eventDate: '2026-07-04T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-bangkok-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '방콕', en: 'Bangkok', ja: 'バンコク', zh: '曼谷', sea: 'Bangkok' }, country: 'TH', venueName: { ko: '임팩트 아레나', en: 'Impact Arena', ja: 'インパクト・アリーナ', zh: 'IMPACT展覽中心', sea: 'Impact Arena' }, coordinates: { lat: 13.7563, lng: 100.5018 }, eventDate: '2026-07-11T18:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-hongkong-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '홍콩', en: 'Hong Kong', ja: '香港', zh: '香港', sea: 'Hong Kong' }, country: 'HK', venueName: { ko: '아시아월드-아레나', en: 'AsiaWorld-Arena', ja: 'アジアワールド・アリーナ', zh: '亞洲國際博覽館', sea: 'AsiaWorld-Arena' }, coordinates: { lat: 22.3193, lng: 114.1694 }, eventDate: '2026-07-18T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-osaka-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '오사카', en: 'Osaka', ja: '大阪', zh: '大阪', sea: 'Osaka' }, country: 'JP', venueName: { ko: '교세라 돔 오사카', en: 'Kyocera Dome Osaka', ja: '京セラドーム大阪', zh: '京瓷巨蛋大阪', sea: 'Kyocera Dome Osaka' }, coordinates: { lat: 34.6937, lng: 135.5023 }, eventDate: '2026-08-01T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-nagoya-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '나고야', en: 'Nagoya', ja: '名古屋', zh: '名古屋', sea: 'Nagoya' }, country: 'JP', venueName: { ko: '반테린 돔 나고야', en: 'Vantelin Dome Nagoya', ja: 'バンテリンドーム ナゴヤ', zh: '萬代南夢宮巨蛋名古屋', sea: 'Vantelin Dome Nagoya' }, coordinates: { lat: 35.1815, lng: 136.9066 }, eventDate: '2026-08-08T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-tokyo-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '東京', sea: 'Tokyo' }, country: 'JP', venueName: { ko: '도쿄 돔', en: 'Tokyo Dome', ja: '東京ドーム', zh: '東京巨蛋', sea: 'Tokyo Dome' }, coordinates: { lat: 35.6762, lng: 139.6503 }, eventDate: '2026-08-15T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-fukuoka-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '후쿠오카', en: 'Fukuoka', ja: '福岡', zh: '福岡', sea: 'Fukuoka' }, country: 'JP', venueName: { ko: '미즈호 페이페이 돔 후쿠오카', en: 'Mizuho PayPay Dome Fukuoka', ja: 'みずほPayPayドーム福岡', zh: '瑞穗PayPay巨蛋福岡', sea: 'Mizuho PayPay Dome Fukuoka' }, coordinates: { lat: 33.5904, lng: 130.4017 }, eventDate: '2026-08-22T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-kualalumpur-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '쿠알라룸푸르', en: 'Kuala Lumpur', ja: 'クアラルンプール', zh: '吉隆坡', sea: 'Kuala Lumpur' }, country: 'MY', venueName: { ko: '악시아타 아레나', en: 'Axiata Arena', ja: 'アクシアタ・アリーナ', zh: '亞通體育館', sea: 'Axiata Arena' }, coordinates: { lat: 3.1390, lng: 101.6869 }, eventDate: '2026-09-05T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-jakarta-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '자카르타', en: 'Jakarta', ja: 'ジャカルタ', zh: '雅加達', sea: 'Jakarta' }, country: 'ID', venueName: { ko: '인도네시아 아레나', en: 'Indonesia Arena', ja: 'インドネシア・アリーナ', zh: '印尼室內體育館', sea: 'Indonesia Arena' }, coordinates: { lat: -6.2088, lng: 106.8456 }, eventDate: '2026-09-12T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bb-kaohsiung-2026', tourId: 'bigbang-20th-tour', artistId: 'bigbang-gd', artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG', sea: 'BIGBANG' }, city: { ko: '가오슝', en: 'Kaohsiung', ja: '高雄', zh: '高雄', sea: 'Kaohsiung' }, country: 'TW', venueName: { ko: '가오슝 국가체육장', en: 'Kaohsiung National Stadium', ja: '高雄国家体育場', zh: '高雄國家體育場', sea: 'Kaohsiung National Stadium' }, coordinates: { lat: 22.6273, lng: 120.3014 }, eventDate: '2026-09-26T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true }
];

export const sampleNewsFacts: TourNewsFact[] = [
  {
    newsId: 'fact-001',
    artistId: 'bigbang-gd',
    tourId: 'bigbang-20th-tour',
    language: 'ko',
    title: '빅뱅 20주년 월드투어 공식 티켓 오픈 공지',
    factSummary: [
      '고양 종합운동장 2회 공연 티켓 예매가 3월 15일 오후 8시 시작됩니다.',
      'VIP 패키지에는 사운드체크 입장권 및 공식 MD가 포함됩니다.',
      '해외 17개 도시 상세 일정은 공식 홈페이지를 통해 순차 공개됩니다.'
    ],
    sourceName: '갤럭시코퍼레이션 공식 공지',
    sourceUrl: 'https://galaxycorp.example.com',
    isOfficial: true,
    publishedAt: '2026-03-01T10:00:00Z'
  },
  {
    newsId: 'fact-002',
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
    publishedAt: '2026-03-02T11:00:00Z'
  },
  {
    newsId: 'fact-003',
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
    publishedAt: '2026-03-03T12:00:00Z'
  },
  {
    newsId: 'fact-004',
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
    publishedAt: '2026-03-04T10:00:00Z'
  }
];