export type LanguageCode = 'ko' | 'en' | 'ja' | 'sea';

export interface LocalizedString {
  ko: string;
  en: string;
  ja?: string;
  sea?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface TourEvent {
  eventId: string;
  artistId: string;
  artistName: LocalizedString;
  city: LocalizedString;
  country: string;
  venueName: string | LocalizedString;
  eventDate: string;
  status: 'ticketOpen' | 'inProgress' | 'completed' | 'scheduled';
  showCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  ticketUrl?: string;
  notifiedStatuses?: string[];
  lastNotifiedAt?: string;
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
}

export interface TourNewsFact {
  newsId: string;
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
}

export interface LanguageContentItem {
  contentId: string;
  koreanPhrase: string;
  pronunciation: string;
  englishMeaning: string;
  japaneseMeaning?: string;
  contextUsage: string;
  reviewStatus: ReviewStatus;
  audioUrl?: string;
}

export interface PipelineAuditLog {
  logId: string;
  timestamp: string;
  articleTitle: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
  detail: string;
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