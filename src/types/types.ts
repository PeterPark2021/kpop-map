export type TourStatus = 'scheduled' | 'ticketOpen' | 'inProgress' | 'completed';
export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'sea';

export interface LocalizedString {
  ko: string;
  en: string;
  ja: string;
  zh: string;
  sea?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TourEvent {
  eventId: string;
  tourId: string;
  artistId: string;
  artistName: LocalizedString;
  city: LocalizedString;
  country: string;
  venueName: LocalizedString;
  coordinates: Coordinates;
  eventDate: string;
  showCount?: number;
  ticketOpenDate?: string;
  ticketUrl?: string;
  status: TourStatus;
  isHighlight?: boolean;
}

export interface TourNewsFact {
  newsId: string;
  artistId: string;
  tourId?: string;
  language: 'ko' | 'en' | 'ja' | 'zh';
  title: string;
  factSummary: string[];
  sourceName: string;
  sourceUrl: string;
  isOfficial: boolean;
  publishedAt: string;
}

export interface ArtistProfile {
  artistId: string;
  name: LocalizedString;
  description: LocalizedString;
  isAnchor?: boolean;
}