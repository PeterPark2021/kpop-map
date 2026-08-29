import { ArtistProfile, TourEvent } from '../types/types';

export const allArtistsCatalog: ArtistProfile[] = [
  {
    artistId: 'bigbang-gd',
    name: { ko: '지드래곤 & 빅뱅', en: 'G-DRAGON & BIGBANG', ja: 'G-DRAGON & BIGBANG', zh: 'G-DRAGON & BIGBANG', sea: 'G-DRAGON & BIGBANG' },
    description: { ko: '2026 빅뱅 20주년 기념 월드투어 & GD 솔로 프로젝트 아카이브', en: '2026 BIGBANG 20th Anniversary World Tour & G-DRAGON Solo Archive', ja: '2026 BIGBANG 20周年記念ワールドツアー & GDソロアーカイブ', zh: '2026 BIGBANG 20週年紀念世界巡迴 & GD個人項目檔案', sea: '2026 BIGBANG 20th Anniversary World Tour & GD Solo Archive' },
    isAnchor: true
  },
  {
    artistId: 'bts',
    name: { ko: '방탄소년단 (BTS)', en: 'BTS', ja: 'BTS (防弾少年団)', zh: '防彈少年團 (BTS)', sea: 'BTS' },
    description: { ko: '2026 BTS 완전체 컴백 기념 초대형 스타디움 월드투어', en: '2026 BTS Full Group Reunion Global Stadium World Tour', ja: '2026 BTS 完全体カムバック記念 スタジアムワールドツアー', zh: '2026 BTS 全體回歸紀念 體育場世界巡迴演唱會', sea: '2026 BTS Full Group Reunion Global Stadium World Tour' }
  },
  {
    artistId: 'blackpink',
    name: { ko: '블랙핑크 (BLACKPINK)', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK', sea: 'BLACKPINK' },
    description: { ko: '2026 BORN AGAIN 글로벌 돔 & 스타디움 월드투어', en: '2026 BORN AGAIN Global Dome & Stadium World Tour', ja: '2026 BORN AGAIN ドーム＆スタジアム ワールドツアー', zh: '2026 BORN AGAIN 全球巡迴演唱會', sea: '2026 BORN AGAIN Global Dome & Stadium World Tour' }
  },
  {
    artistId: 'seventeen',
    name: { ko: '세븐틴 (SEVENTEEN)', en: 'SEVENTEEN', ja: 'SEVENTEEN (セブチ)', zh: 'SEVENTEEN (十七)', sea: 'SEVENTEEN' },
    description: { ko: '2026 SEVENTEEN [RIGHT HERE] 스타디움 월드투어', en: '2026 SEVENTEEN [RIGHT HERE] Stadium World Tour', ja: '2026 SEVENTEEN [RIGHT HERE] スタジアムワールドツアー', zh: '2026 SEVENTEEN [RIGHT HERE] 體育場世界巡迴演唱會', sea: '2026 SEVENTEEN [RIGHT HERE] Stadium World Tour' }
  },
  {
    artistId: 'stray-kids',
    name: { ko: '스트레이 키즈 (Stray Kids)', en: 'Stray Kids (SKZ)', ja: 'Stray Kids (スキズ)', zh: 'Stray Kids', sea: 'Stray Kids' },
    description: { ko: '2026 Stray Kids <dominATE> 글로벌 초대형 스타디움 투어', en: '2026 Stray Kids <dominATE> Global Stadium World Tour', ja: '2026 Stray Kids <dominATE> グローバルスタジアムツアー', zh: '2026 Stray Kids <dominATE> 全球體育場巡迴演唱會', sea: '2026 Stray Kids <dominATE> Global Stadium World Tour' }
  }
];

export const btsTourEvents: TourEvent[] = [
  { eventId: 'bts-seoul-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' }, country: 'KR', venueName: { ko: '서울 올림픽주경기장', en: 'Seoul Olympic Stadium', ja: 'ソウルオリンピック主競技場', zh: '首爾奧林匹克主競技場', sea: 'Seoul Olympic Stadium' }, coordinates: { lat: 37.5158, lng: 127.0728 }, eventDate: '2026-06-13T18:00:00Z', showCount: 3, status: 'ticketOpen', isHighlight: true, ticketUrl: 'https://weverse.example.com/bts' },
  { eventId: 'bts-la-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '로스앤젤레스', en: 'Los Angeles', ja: 'ロサンゼルス', zh: '洛杉磯', sea: 'Los Angeles' }, country: 'US', venueName: { ko: '소파이 스타디움', en: 'SoFi Stadium', ja: 'SoFiスタジアム', zh: 'SoFi體育場', sea: 'SoFi Stadium' }, coordinates: { lat: 33.9535, lng: -118.3390 }, eventDate: '2026-07-04T19:30:00Z', showCount: 4, status: 'scheduled', isHighlight: true },
  { eventId: 'bts-london-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '런던', en: 'London', ja: 'ロンドン', zh: '倫敦', sea: 'London' }, country: 'GB', venueName: { ko: '웸블리 스타디움', en: 'Wembley Stadium', ja: 'ウェンブリー・スタジアム', zh: '溫布利球場', sea: 'Wembley Stadium' }, coordinates: { lat: 51.5560, lng: -0.2795 }, eventDate: '2026-07-25T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bts-tokyo-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '東京', sea: 'Tokyo' }, country: 'JP', venueName: { ko: '국립경기장', en: 'Japan National Stadium', ja: '国立競技場', zh: '國立競技場', sea: 'Japan National Stadium' }, coordinates: { lat: 35.6778, lng: 139.7145 }, eventDate: '2026-08-15T18:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true }
];

export const blackpinkTourEvents: TourEvent[] = [
  { eventId: 'bp-seoul-2026', tourId: 'bp-2026-bornagain', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' }, country: 'KR', venueName: { ko: '고척스카이돔', en: 'Gocheok Sky Dome', ja: '高尺スカイドーム', zh: '高尺天空巨蛋', sea: 'Gocheok Sky Dome' }, coordinates: { lat: 37.4982, lng: 126.8671 }, eventDate: '2026-05-23T18:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true },
  { eventId: 'bp-paris-2026', tourId: 'bp-2026-bornagain', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK' }, city: { ko: '파리', en: 'Paris', ja: 'パリ', zh: '巴黎', sea: 'Paris' }, country: 'FR', venueName: { ko: '스타드 드 프랑스', en: 'Stade de France', ja: 'スタッド・ド・フランス', zh: '法蘭西體育場', sea: 'Stade de France' }, coordinates: { lat: 48.9245, lng: 2.3602 }, eventDate: '2026-06-20T20:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bp-taipei-2026', tourId: 'bp-2026-bornagain', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK' }, city: { ko: '가오슝', en: 'Kaohsiung', ja: '高雄', zh: '高雄', sea: 'Kaohsiung' }, country: 'TW', venueName: { ko: '가오슝 국가체육장', en: 'Kaohsiung National Stadium', ja: '高雄国家体育場', zh: '高雄國家體育場', sea: 'Kaohsiung National Stadium' }, coordinates: { lat: 22.6273, lng: 120.3014 }, eventDate: '2026-07-11T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true }
];

export const seventeenTourEvents: TourEvent[] = [
  { eventId: 'svt-incheon-2026', tourId: 'svt-2026-righthere', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'SEVENTEEN', zh: 'SEVENTEEN' }, city: { ko: '인천', en: 'Incheon', ja: '仁川', zh: '仁川', sea: 'Incheon' }, country: 'KR', venueName: { ko: '인천아시아드 주경기장', en: 'Incheon Asiad Main Stadium', ja: '仁川アジアド主競技場', zh: '仁川亞運主體育場', sea: 'Incheon Asiad Main Stadium' }, coordinates: { lat: 37.5485, lng: 126.6730 }, eventDate: '2026-04-25T18:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true, ticketUrl: 'https://pledis.co.kr/notice' },
  { eventId: 'svt-tokyo-2026', tourId: 'svt-2026-righthere', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'SEVENTEEN', zh: 'SEVENTEEN' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '東京', sea: 'Tokyo' }, country: 'JP', venueName: { ko: '도쿄돔', en: 'Tokyo Dome', ja: '東京ドーム', zh: '東京巨蛋', sea: 'Tokyo Dome' }, coordinates: { lat: 35.6762, lng: 139.6503 }, eventDate: '2026-05-16T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'svt-osaka-2026', tourId: 'svt-2026-righthere', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'SEVENTEEN', zh: 'SEVENTEEN' }, city: { ko: '오사카', en: 'Osaka', ja: '大阪', zh: '大阪', sea: 'Osaka' }, country: 'JP', venueName: { ko: '얀마 스타디움 나가이', en: 'Yanmar Stadium Nagai', ja: 'ヤンマースタジアム長居', zh: '長居陸上競技場', sea: 'Yanmar Stadium Nagai' }, coordinates: { lat: 34.6136, lng: 135.5186 }, eventDate: '2026-05-23T17:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'svt-la-2026', tourId: 'svt-2026-righthere', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'SEVENTEEN', zh: 'SEVENTEEN' }, city: { ko: '로스앤젤레스', en: 'Los Angeles', ja: 'ロサンゼルス', zh: '洛杉磯', sea: 'Los Angeles' }, country: 'US', venueName: { ko: 'BMO 스타디움', en: 'BMO Stadium', ja: 'BMOスタジアム', zh: 'BMO體育場', sea: 'BMO Stadium' }, coordinates: { lat: 34.0128, lng: -118.2847 }, eventDate: '2026-06-12T19:30:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'svt-bangkok-2026', tourId: 'svt-2026-righthere', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'SEVENTEEN', zh: 'SEVENTEEN' }, city: { ko: '방콕', en: 'Bangkok', ja: 'バンコク', zh: '曼谷', sea: 'Bangkok' }, country: 'TH', venueName: { ko: '라자망갈라 국립경기장', en: 'Rajamangala National Stadium', ja: 'ラジャマンガラ・スタジアム', zh: '拉加曼加拉體育場', sea: 'Rajamangala National Stadium' }, coordinates: { lat: 13.7553, lng: 100.6225 }, eventDate: '2026-07-04T18:30:00Z', showCount: 2, status: 'scheduled', isHighlight: true }
];

export const strayKidsTourEvents: TourEvent[] = [
  { eventId: 'skz-seoul-2026', tourId: 'skz-2026-dominate', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' }, country: 'KR', venueName: { ko: 'KSPO 돔 (올림픽체조경기장)', en: 'KSPO Dome', ja: 'KSPO DOME', zh: 'KSPO DOME', sea: 'KSPO Dome' }, coordinates: { lat: 37.5190, lng: 127.1275 }, eventDate: '2026-05-09T18:00:00Z', showCount: 3, status: 'ticketOpen', isHighlight: true, ticketUrl: 'https://jype.com/notice' },
  { eventId: 'skz-singapore-2026', tourId: 'skz-2026-dominate', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '싱가포르', en: 'Singapore', ja: 'シンガポール', zh: '新加坡', sea: 'Singapore' }, country: 'SG', venueName: { ko: '싱가포르 국립경기장', en: 'Singapore National Stadium', ja: 'シンガポール国立競技場', zh: '新加坡國家體育場', sea: 'Singapore National Stadium' }, coordinates: { lat: 1.3040, lng: 103.8744 }, eventDate: '2026-06-06T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'skz-sydney-2026', tourId: 'skz-2026-dominate', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '시드니', en: 'Sydney', ja: 'シドニー', zh: '雪梨', sea: 'Sydney' }, country: 'AU', venueName: { ko: '알리안츠 스타디움', en: 'Allianz Stadium', ja: 'アリアンツ・スタジアム', zh: '安聯體育場', sea: 'Allianz Stadium' }, coordinates: { lat: -33.8890, lng: 151.2250 }, eventDate: '2026-06-27T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'skz-london-2026', tourId: 'skz-2026-dominate', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '런던', en: 'London', ja: 'ロンドン', zh: '倫敦', sea: 'London' }, country: 'GB', venueName: { ko: '토트넘 홋스퍼 스타디움', en: 'Tottenham Hotspur Stadium', ja: 'トッテナム・ホットスパー・スタジアム', zh: '托特納姆熱刺球場', sea: 'Tottenham Hotspur Stadium' }, coordinates: { lat: 51.6042, lng: -0.0664 }, eventDate: '2026-07-18T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'skz-kaohsiung-2026', tourId: 'skz-2026-dominate', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '가오슝', en: 'Kaohsiung', ja: '高雄', zh: '高雄', sea: 'Kaohsiung' }, country: 'TW', venueName: { ko: '가오슝 국가체육장', en: 'Kaohsiung National Stadium', ja: '高雄国家体育場', zh: '高雄國家體育場', sea: 'Kaohsiung National Stadium' }, coordinates: { lat: 22.6273, lng: 120.3014 }, eventDate: '2026-08-01T19:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true }
];