import { ArtistProfile, TourEvent } from '../types/types';

export const allArtistsCatalog: ArtistProfile[] = [
  {
    artistId: 'bigbang-gd',
    name: { ko: '지드래곤 / 빅뱅', en: 'G-DRAGON / BIGBANG', ja: 'G-DRAGON', zh: '權志龍', sea: 'G-DRAGON' },
    description: { ko: 'K-POP의 아이콘, 2026 글로벌 스타디움 투어', en: 'The King of K-POP, 2026 Stadium Tour', ja: 'K-POPの皇帝', zh: 'K-POP王者', sea: 'King of K-POP' },
    isAnchor: true
  },
  {
    artistId: 'bts',
    name: { ko: '방탄소년단 (BTS)', en: 'BTS', ja: '防弾少年団', zh: '防彈少年團', sea: 'BTS' },
    description: { ko: '전 세계를 뒤흔든 21세기 팝 아이콘', en: '21st Century Pop Icons', ja: '21世紀のポップアイコン', zh: '21世紀流行偶像', sea: 'Pop Icons' }
  },
  {
    artistId: 'blackpink',
    name: { ko: '블랙핑크 (BLACKPINK)', en: 'BLACKPINK', ja: 'ブラックピンク', zh: 'BLACKPINK', sea: 'BLACKPINK' },
    description: { ko: '글로벌 톱 걸그룹 월드 투어', en: 'Global Top Girl Group World Tour', ja: 'グローバルトップガールズグループ', zh: '全球頂級女團', sea: 'Top Girl Group' }
  },
  {
    artistId: 'seventeen',
    name: { ko: '세븐틴 (SEVENTEEN)', en: 'SEVENTEEN', ja: 'セブンティーン', zh: 'SEVENTEEN', sea: 'SEVENTEEN' },
    description: { ko: 'K-POP 퍼포먼스 제왕, 초대형 돔&스타디움 투어', en: 'Performance Kings, Mega Stadium Tour', ja: 'パフォーマンスの帝王', zh: '舞台霸主', sea: 'Performance Kings' }
  },
  {
    artistId: 'stray-kids',
    name: { ko: '스트레이 키즈 (Stray Kids)', en: 'Stray Kids', ja: 'ストレイキッズ', zh: 'Stray Kids', sea: 'Stray Kids' },
    description: { ko: '글로벌 대세, 5-STAR 스타디움 월드투어', en: 'Global Dominators, Stadium Tour', ja: 'グローバル大勢', zh: '全球大勢男團', sea: 'Global Dominators' }
  }
];

export const btsTourEvents: TourEvent[] = [
  {
    eventId: 'bts-seoul-2026',
    tourId: 'bts-world-2026',
    artistId: 'bts',
    artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS', sea: 'BTS' },
    city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' },
    country: 'KR',
    venueName: { ko: '서울 잠실종합운동장 올림픽주경기장', en: 'Seoul Olympic Stadium', ja: 'ソウルオリンピック主競技場', zh: '首爾奧林匹克主競技場', sea: 'Seoul Olympic Stadium' },
    coordinates: { lat: 37.5158, lng: 127.0728 },
    eventDate: '2026-06-13T19:00:00Z',
    showCount: 3,
    status: 'ticketOpen'
  },
  {
    eventId: 'bts-la-2026',
    tourId: 'bts-world-2026',
    artistId: 'bts',
    artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS', sea: 'BTS' },
    city: { ko: '로스앤젤레스', en: 'Los Angeles', ja: 'ロサンゼルス', zh: '洛杉磯', sea: 'Los Angeles' },
    country: 'US',
    venueName: { ko: 'SoFi 스타디움', en: 'SoFi Stadium', ja: 'SoFiスタジアム', zh: 'SoFi體育場', sea: 'SoFi Stadium' },
    coordinates: { lat: 33.9535, lng: -118.339 },
    eventDate: '2026-07-10T19:30:00Z',
    showCount: 4,
    status: 'scheduled'
  }
];

export const blackpinkTourEvents: TourEvent[] = [
  {
    eventId: 'bp-seoul-2026',
    tourId: 'bp-world-2026',
    artistId: 'blackpink',
    artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK', sea: 'BLACKPINK' },
    city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' },
    country: 'KR',
    venueName: { ko: '고척스카이돔', en: 'Gocheok Sky Dome', ja: '高尺スカイドーム', zh: '高尺天空巨蛋', sea: 'Gocheok Sky Dome' },
    coordinates: { lat: 37.4982, lng: 126.8671 },
    eventDate: '2026-08-08T18:00:00Z',
    showCount: 2,
    status: 'ticketOpen'
  },
  {
    eventId: 'bp-tokyo-2026',
    tourId: 'bp-world-2026',
    artistId: 'blackpink',
    artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK', sea: 'BLACKPINK' },
    city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '東京', sea: 'Tokyo' },
    country: 'JP',
    venueName: { ko: '도쿄 돔', en: 'Tokyo Dome', ja: '東京ドーム', zh: '東京巨蛋', sea: 'Tokyo Dome' },
    coordinates: { lat: 35.7056, lng: 139.7519 },
    eventDate: '2026-08-22T17:00:00Z',
    showCount: 2,
    status: 'scheduled'
  }
];

export const seventeenTourEvents: TourEvent[] = [
  {
    eventId: 'svt-incheon-2026',
    tourId: 'svt-world-2026',
    artistId: 'seventeen',
    artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'SEVENTEEN', zh: 'SEVENTEEN', sea: 'SEVENTEEN' },
    city: { ko: '인천', en: 'Incheon', ja: '仁川', zh: '仁川', sea: 'Incheon' },
    country: 'KR',
    venueName: { ko: '인천아시아드주경기장', en: 'Incheon Asiad Main Stadium', ja: '仁川アシアード主競技場', zh: '仁川亞運會主體育場', sea: 'Incheon Asiad Main Stadium' },
    coordinates: { lat: 37.5484, lng: 126.6669 },
    eventDate: '2026-05-16T18:00:00Z',
    showCount: 2,
    status: 'ticketOpen'
  }
];

export const strayKidsTourEvents: TourEvent[] = [
  {
    eventId: 'skz-seoul-2026',
    tourId: 'skz-world-2026',
    artistId: 'stray-kids',
    artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids', sea: 'Stray Kids' },
    city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' },
    country: 'KR',
    venueName: { ko: 'KSPO 돔 (올림픽체조경기장)', en: 'KSPO DOME', ja: 'KSPO DOME', zh: 'KSPO DOME', sea: 'KSPO DOME' },
    coordinates: { lat: 37.5192, lng: 127.1274 },
    eventDate: '2026-09-05T18:00:00Z',
    showCount: 3,
    status: 'ticketOpen'
  }
];