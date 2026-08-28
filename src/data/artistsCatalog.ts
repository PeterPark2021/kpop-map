import { ArtistProfile, TourEvent, TourNewsFact } from '../types/types';

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
  }
];

export const btsTourEvents: TourEvent[] = [
  { eventId: 'bts-seoul-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' }, country: 'KR', venueName: 'Seoul Olympic Stadium', coordinates: { lat: 37.5158, lng: 127.0728 }, eventDate: '2026-06-13T18:00:00Z', showCount: 3, status: 'ticketOpen', isHighlight: true, ticketUrl: 'https://weverse.example.com/bts' },
  { eventId: 'bts-la-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '로스앤젤레스', en: 'Los Angeles', ja: 'ロサンゼルス', zh: '洛杉磯', sea: 'Los Angeles' }, country: 'US', venueName: 'SoFi Stadium', coordinates: { lat: 33.9535, lng: -118.3390 }, eventDate: '2026-07-04T19:30:00Z', showCount: 4, status: 'scheduled', isHighlight: true },
  { eventId: 'bts-london-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '런던', en: 'London', ja: 'ロンドン', zh: '倫敦', sea: 'London' }, country: 'GB', venueName: 'Wembley Stadium', coordinates: { lat: 51.5560, lng: -0.2795 }, eventDate: '2026-07-25T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true },
  { eventId: 'bts-tokyo-2026', tourId: 'bts-2026-world', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: 'BTS', zh: 'BTS' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '東京', sea: 'Tokyo' }, country: 'JP', venueName: 'Japan National Stadium', coordinates: { lat: 35.6778, lng: 139.7145 }, eventDate: '2026-08-15T18:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true }
];

export const blackpinkTourEvents: TourEvent[] = [
  { eventId: 'bp-seoul-2026', tourId: 'bp-2026-bornagain', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首爾', sea: 'Seoul' }, country: 'KR', venueName: 'Gocheok Sky Dome', coordinates: { lat: 37.4982, lng: 126.8671 }, eventDate: '2026-05-23T18:00:00Z', showCount: 2, status: 'ticketOpen', isHighlight: true },
  { eventId: 'bp-paris-2026', tourId: 'bp-2026-bornagain', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK' }, city: { ko: '파리', en: 'Paris', ja: 'パリ', zh: '巴黎', sea: 'Paris' }, country: 'FR', venueName: 'Stade de France', coordinates: { lat: 48.9245, lng: 2.3602 }, eventDate: '2026-06-20T20:00:00Z', showCount: 1, status: 'scheduled', isHighlight: true },
  { eventId: 'bp-taipei-2026', tourId: 'bp-2026-bornagain', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'BLACKPINK', zh: 'BLACKPINK' }, city: { ko: '가오슝', en: 'Kaohsiung', ja: '高雄', zh: '高雄', sea: 'Kaohsiung' }, country: 'TW', venueName: 'Kaohsiung National Stadium', coordinates: { lat: 22.6273, lng: 120.3014 }, eventDate: '2026-07-11T19:00:00Z', showCount: 2, status: 'scheduled', isHighlight: true }
];