export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'sea' | string;

export interface LocalizedString {
  ko: string;
  en: string;
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
  country: string;
  venueName: string | LocalizedString;
  eventDate: string;
  status: 'ticketOpen' | 'inProgress' | 'completed' | 'scheduled' | string;
  showCount: number;
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

export interface ArtistProfile {
  artistId: string;
  name: LocalizedString;
  description: LocalizedString;
  anchorCity: LocalizedString;
  totalShows: number;
  statusText: LocalizedString;
  imageUrl: string;
  accentColor: string;
  [key: string]: any;
}

export interface TourNewsFact {
  newsId: string;
  tourId?: string;
  artistId: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  language: string;
  reviewStatus: ReviewStatus;
  rejectionReason?: string;
  verificationConfidence?: number;
  [key: string]: any;
}

export interface LanguageContentItem {
  contentId: string;
  category?: string;
  koreanPhrase: string;
  pronunciation: string;
  englishMeaning: string;
  japaneseMeaning?: string;
  chineseMeaning?: string;
  contextUsage: string;
  reviewStatus: ReviewStatus;
  audioUrl?: string;
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