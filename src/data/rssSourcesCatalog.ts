import { RssFeedSource } from '../types/types';

export const officialRssSources: RssFeedSource[] = [
  {
    sourceId: 'src_galaxy_gd',
    name: 'Galaxy Corporation Official Press',
    agencyName: '갤럭시코퍼레이션',
    targetArtistIds: ['bigbang-gd'],
    feedUrl: 'https://galaxycorp.com/press/rss.xml',
    siteUrl: 'https://galaxycorp.com',
    isOfficial: true,
    reliabilityWeight: 1.0,
    category: 'agency',
    status: 'active'
  },
  {
    sourceId: 'src_hybe_bts',
    name: 'HYBE Labels (BigHit Music) Press',
    agencyName: '하이브 / 빅히트 뮤직',
    targetArtistIds: ['bts'],
    feedUrl: 'https://hybecorp.com/rss/press_bts.xml',
    siteUrl: 'https://hybecorp.com',
    isOfficial: true,
    reliabilityWeight: 1.0,
    category: 'agency',
    status: 'active'
  },
  {
    sourceId: 'src_yg_blackpink',
    name: 'YG Entertainment News Feed',
    agencyName: 'YG 엔터테인먼트',
    targetArtistIds: ['blackpink'],
    feedUrl: 'https://ygfamily.com/rss/news_bp.xml',
    siteUrl: 'https://ygfamily.com',
    isOfficial: true,
    reliabilityWeight: 1.0,
    category: 'agency',
    status: 'active'
  },
  {
    sourceId: 'src_pledis_svt',
    name: 'PLEDIS Entertainment (SEVENTEEN)',
    agencyName: '플레디스 엔터테인먼트',
    targetArtistIds: ['seventeen'],
    feedUrl: 'https://pledis.co.kr/rss/seventeen.xml',
    siteUrl: 'https://pledis.co.kr',
    isOfficial: true,
    reliabilityWeight: 1.0,
    category: 'agency',
    status: 'active'
  },
  {
    sourceId: 'src_jyp_skz',
    name: 'JYP Entertainment (Stray Kids)',
    agencyName: 'JYP 엔터테인먼트',
    targetArtistIds: ['stray-kids'],
    feedUrl: 'https://jype.com/rss/straykids.xml',
    siteUrl: 'https://jype.com',
    isOfficial: true,
    reliabilityWeight: 1.0,
    category: 'agency',
    status: 'active'
  },
  {
    sourceId: 'src_soompi_tour',
    name: 'Soompi K-Pop World Tour News',
    agencyName: 'Soompi / Rakuten',
    targetArtistIds: ['bigbang-gd', 'bts', 'blackpink', 'seventeen', 'stray-kids'],
    feedUrl: 'https://soompi.com/category/tours/rss',
    siteUrl: 'https://soompi.com',
    isOfficial: false,
    reliabilityWeight: 0.85,
    category: 'global_media',
    status: 'active'
  },
  {
    sourceId: 'src_allkpop_concert',
    name: 'Allkpop Concert & Tour Updates',
    agencyName: 'Allkpop Media',
    targetArtistIds: ['bigbang-gd', 'bts', 'blackpink', 'seventeen', 'stray-kids'],
    feedUrl: 'https://allkpop.com/rss/concerts',
    siteUrl: 'https://allkpop.com',
    isOfficial: false,
    reliabilityWeight: 0.8,
    category: 'global_media',
    status: 'active'
  },
  {
    sourceId: 'src_billboard_kpop',
    name: 'Billboard K-Pop Global Charts & Tours',
    agencyName: 'Billboard US',
    targetArtistIds: ['bts', 'blackpink', 'bigbang-gd'],
    feedUrl: 'https://billboard.com/c/k-pop/rss',
    siteUrl: 'https://billboard.com',
    isOfficial: false,
    reliabilityWeight: 0.9,
    category: 'global_media',
    status: 'active'
  },
  {
    sourceId: 'src_livenation_kpop',
    name: 'Live Nation Global Tour Announcements',
    agencyName: 'Live Nation Global',
    targetArtistIds: ['bigbang-gd', 'bts', 'blackpink', 'seventeen', 'stray-kids'],
    feedUrl: 'https://livenation.com/rss/kpop_tours.xml',
    siteUrl: 'https://livenation.com',
    isOfficial: true,
    reliabilityWeight: 0.95,
    category: 'ticketing',
    status: 'active'
  }
];