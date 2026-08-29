export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'sea';

export interface LocalizedString {
  ko: string;
  en: string;
  ja: string;
  zh: string;
  sea: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface TourEvent {
  eventId: string;
  tourId: string;
  artistId: string;
  artistName: Record<string, string>;
  city: LocalizedString;
  country: string;
  venueName: LocalizedString | string;
  coordinates: {
    lat: number;
    lng: number;
  };
  eventDate: string;
  showCount: number;
  status: 'scheduled' | 'ticketOpen' | 'inProgress' | 'completed';
  isHighlight?: boolean;
  ticketUrl?: string;
  notifiedStatuses?: string[]; // 알림 중복 발송 방지 배열
}

export interface TourNewsFact {
  newsId: string;
  artistId: string;
  tourId: string;
  language: string;
  title: string;
  factSummary: string[];
  sourceName: string;
  sourceUrl: string;
  isOfficial: boolean;
  publishedAt: string;
  reviewStatus: ReviewStatus;
  rejectionReason?: string;
}

export interface PipelineAuditLog {
  logId: string;
  timestamp: string;
  articleTitle: string;
  sourceUrl: string;
  status: 'SUCCESS' | 'BLOCKED_NGRAM' | 'RETRY_TRIGGERED' | 'FAILED_PARSING';
  ngramMatchCount?: number;
  detectedOverlapSnippet?: string;
  detail: string;
}

export interface ArtistProfile {
  artistId: string;
  name: LocalizedString;
  description: LocalizedString;
  isAnchor?: boolean;
}

export interface LanguageContentTranslation {
  term: string;
  meaning: string;
}

export interface LanguageContentItem {
  contentId: string;
  category: 'fandomTerms' | 'onomatopoeia';
  level: 'beginner' | 'intermediate' | 'advanced';
  koreanText: string;
  romanization: string;
  audioScript: string;
  audioUrl?: string;
  translations: {
    en: LanguageContentTranslation;
    ja: LanguageContentTranslation;
    'zh-TW': LanguageContentTranslation;
    th: LanguageContentTranslation;
  };
  culturalNote?: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
}

// ----------------------------------------------------
// 일반 회원 (User Account) & 알림 구독 스키마
// ----------------------------------------------------
export interface UserNotificationPrefs {
  emailEnabled: boolean;
  language: LanguageCode;
  consentGivenAt: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  favoriteArtistIds: string[];
  notificationPrefs: UserNotificationPrefs;
  createdAt: string;
}

export interface NotificationLog {
  logId: string;
  userId: string;
  eventId: string;
  status: string;
  sentAt: string;
  channel: 'email';
}