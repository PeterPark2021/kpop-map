export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'sea' | string;

export interface LocalizedString {
  ko?: string;
  en?: string;
  ja?: string;
  zh?: string;
  sea?: string;
  [key: string]: string | undefined;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface TourEvent {
  eventId: string;
  tourId?: string;
  artistId: string;
  artistName: LocalizedString;
  city: LocalizedString;
  country?: string;
  venueName?: string | LocalizedString;
  eventDate: string;
  status: 'ticketOpen' | 'inProgress' | 'completed' | 'scheduled' | string;
  showCount?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  ticketUrl?: string;
  isHighlight?: boolean;
  notifiedStatuses?: string[];
  lastNotifiedAt?: string;
  [key: string]: any;
}

export interface ExtractedSignal {
  signalType: 'ticketOpen' | 'dateChange' | 'venueChange' | 'none';
  mentionedCity: string | null;
  mentionedVenue: string | null;
  relatedEventId: string | null;
}

export interface TourNewsFact {
  newsId: string;
  tourId?: string;
  artistId: string;
  headline?: string;
  title?: string;
  summary?: string;
  factSummary?: string[];
  source?: string;
  sourceName?: string;
  sourceUrl?: string;
  isOfficial?: boolean;
  publishedAt?: string;
  language?: string;
  reviewStatus: ReviewStatus;
  rejectionReason?: string;
  verificationConfidence?: number;
  extractedSignal?: ExtractedSignal;
  [key: string]: any;
}

export interface EventLifecycleLog {
  logId: string;
  eventId: string;
  previousStatus: string;
  newStatus: string;
  reason: 'date-based-auto' | 'rss-bridge' | 'rss-bridge-skipped-stale' | 'admin-manual';
  sourceNewsId?: string;
  changedAt: string;
}

export interface ArtistProfile {
  artistId: string;
  name: LocalizedString;
  description?: LocalizedString;
  anchorCity?: LocalizedString;
  totalShows?: number;
  statusText?: LocalizedString;
  imageUrl?: string;
  accentColor?: string;
  isAnchor?: boolean;
  [key: string]: any;
}

export interface LanguageContentItem {
  contentId: string;
  category?: string;
  level?: string;
  koreanPhrase?: string;
  koreanText?: string;
  pronunciation?: string;
  romanization?: string;
  englishMeaning?: string;
  japaneseMeaning?: string;
  chineseMeaning?: string;
  audioScript?: string;
  translations?: any;
  culturalNote?: string;
  contextUsage?: string;
  reviewStatus: ReviewStatus;
  audioUrl?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface PipelineAuditLog {
  logId: string;
  timestamp: string;
  articleTitle: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED' | string;
  detail: string;
  sourceUrl?: string;
  [key: string]: any;
}

export interface UserNotificationPrefs {
  emailEnabled: boolean;
  ticketOpen: boolean;
  statusChange: boolean;
  language: LanguageCode;
  consentGivenAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  favoriteArtistIds: string[];
  ageVerified: boolean;
  ageVerifiedAt?: string;
  notificationPrefs: UserNotificationPrefs;
}

export interface RssFeedSource {
  sourceId: string;
  name: string;
  agencyName: string;
  targetArtistIds: string[];
  feedUrl: string;
  siteUrl: string;
  isOfficial: boolean;
  reliabilityWeight: number;
  category: 'agency' | 'global_media' | 'ticketing';
  lastFetchedAt?: string;
  status: 'active' | 'inactive' | 'error';
}

export interface RssSyncResult {
  totalFeedsChecked: number;
  totalArticlesFound: number;
  newFactsExtracted: number;
  autoApprovedCount: number;
  pendingReviewCount: number;
  duplicatesSkipped: number;
  timestamp: string;
}