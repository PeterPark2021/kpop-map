import { TourEvent, TourNewsFact, PipelineAuditLog, ArtistProfile } from '../types/types';
import { initialBigBangTourEvents as legacyBigBangEvents } from './initialDataLegacy';

export { gdArtistProfile, initialBigBangTourEvents, sampleAuditLogs } from './initialDataLegacy';

export const sampleNewsFacts: TourNewsFact[] = [
  // 1. GD & 빅뱅 공식 팩트 뉴스
  {
    newsId: 'fact-gd-001',
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
  // 2. 세븐틴 (SEVENTEEN) 공식 팩트 뉴스
  {
    newsId: 'fact-svt-001',
    artistId: 'seventeen',
    tourId: 'svt-2026-righthere',
    language: 'ko',
    title: '세븐틴 2026 스타디움 월드투어 인천 아시아드 개막 확정',
    factSummary: [
      '4월 25일~26일 인천 아시아드 주경기장에서 단독 2회 스타디움 콘서트 개최.',
      '캐럿(CARAT) 멤버십 선예매는 3월 20일 인터파크 티켓에서 단독 진행됩니다.',
      '도쿄돔, 오사카 얀마 스타디움, LA BMO 스타디움으로 이어지는 글로벌 스타디움 순회.'
    ],
    sourceName: 'PLEDIS Entertainment 공식 발표',
    sourceUrl: 'https://pledis.co.kr/notice',
    isOfficial: true,
    publishedAt: '2026-03-05T10:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-svt-002',
    artistId: 'seventeen',
    tourId: 'svt-2026-righthere',
    language: 'en',
    title: 'SEVENTEEN [RIGHT HERE] World Tour Stadium Dates Announced',
    factSummary: [
      'Shows confirmed at Incheon Asiad, Tokyo Dome, and LA BMO Stadium.',
      'General ticket sales for North America begin April 15 via Ticketmaster.'
    ],
    sourceName: 'PLEDIS Global Press',
    sourceUrl: 'https://pledis.co.kr/notice',
    isOfficial: true,
    publishedAt: '2026-03-05T11:00:00Z',
    reviewStatus: 'approved'
  },
  // 3. 스트레이 키즈 (Stray Kids) 공식 팩트 뉴스
  {
    newsId: 'fact-skz-001',
    artistId: 'stray-kids',
    tourId: 'skz-2026-dominate',
    language: 'ko',
    title: '스트레이 키즈 <dominATE> 월드투어 런던 토트넘 스타디움 및 서울 3회 확정',
    factSummary: [
      '5월 9일~11일 서울 KSPO 돔 3회 공연을 시작으로 초대형 스타디움 투어 돌입.',
      'K-POP 보이그룹 최초 영국 런던 토트넘 홋스퍼 스타디움 단독 입성 확정.',
      '공식 팬클럽 STAY 4기 선예매 4월 2일 예스24 티켓 오픈.'
    ],
    sourceName: 'JYP Entertainment 공식 발표',
    sourceUrl: 'https://jype.com/notice',
    isOfficial: true,
    publishedAt: '2026-03-06T09:00:00Z',
    reviewStatus: 'approved'
  },
  {
    newsId: 'fact-skz-002',
    artistId: 'stray-kids',
    tourId: 'skz-2026-dominate',
    language: 'en',
    title: 'Stray Kids Historic Show at Tottenham Hotspur Stadium, London',
    factSummary: [
      'Live show scheduled for July 18 at Tottenham Hotspur Stadium.',
      'Live Nation UK official ticket sales open April 18.'
    ],
    sourceName: 'Live Nation Global Press',
    sourceUrl: 'https://livenation.example.com',
    isOfficial: true,
    publishedAt: '2026-03-06T12:00:00Z',
    reviewStatus: 'approved'
  }
];