import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact, LanguageContentItem } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';
import { sampleLanguageContents } from '../data/sampleLanguageContent';

export type EventUpdateCallback = (events: TourEvent[]) => void;
export type NewsUpdateCallback = (news: TourNewsFact[]) => void;
export type LanguageUpdateCallback = (items: LanguageContentItem[]) => void;

class TourService {
  private mockEvents: TourEvent[] = [...initialBigBangTourEvents];
  private mockNews: TourNewsFact[] = [...sampleNewsFacts];
  private mockLang: LanguageContentItem[] = [...sampleLanguageContents];
  private eventListeners: EventUpdateCallback[] = [];
  private newsListeners: { lang: string; cb: NewsUpdateCallback }[] = [];
  private langListeners: LanguageUpdateCallback[] = [];

  public subscribeToTourEvents(callback: EventUpdateCallback): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'events'));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const events = snapshot.docs.map((d) => d.data() as TourEvent);
          callback(events);
        } else {
          callback(this.mockEvents);
        }
      }, () => callback(this.mockEvents));
    }

    this.eventListeners.push(callback);
    callback(this.mockEvents);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== callback);
    };
  }

  public async updateEventStatus(eventId: string, status: TourEvent['status']) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'events', eventId);
        await updateDoc(docRef, { status });
        return;
      } catch (err) {
        console.warn('Firestore update failed:', err);
      }
    }

    this.mockEvents = this.mockEvents.map(e => e.eventId === eventId ? { ...e, status } : e);
    this.eventListeners.forEach(cb => cb([...this.mockEvents]));
  }

  public subscribeToNewsFacts(artistId: string, lang: string, callback: NewsUpdateCallback): () => void {
    const targetLang = lang === 'sea' ? 'en' : lang;

    const emitCurrent = () => {
      const filtered = this.mockNews.filter(
        f => f.artistId === artistId && (f.language === targetLang || f.language === 'ko')
      );
      callback(filtered.length > 0 ? filtered : this.mockNews);
    };

    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'newsFacts'), where('artistId', '==', artistId));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const facts = snapshot.docs.map(d => d.data() as TourNewsFact);
          callback(facts);
        } else {
          emitCurrent();
        }
      }, () => emitCurrent());
    }

    this.newsListeners.push({ lang: targetLang, cb: callback });
    emitCurrent();
    return () => {
      this.newsListeners = this.newsListeners.filter(l => l.cb !== callback);
    };
  }

  public async updateNewsReviewStatus(newsId: string, reviewStatus: TourNewsFact['reviewStatus'], reason?: string) {
    this.mockNews = this.mockNews.map(n =>
      n.newsId === newsId ? { ...n, reviewStatus, rejectionReason: reason } : n
    );

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'newsFacts', newsId);
        await updateDoc(docRef, { reviewStatus, rejectionReason: reason || '' });
      } catch (err) {
        console.warn('Firestore news update failed:', err);
      }
    }

    this.newsListeners.forEach(({ lang, cb }) => {
      const filtered = this.mockNews.filter(f => f.language === lang || f.language === 'ko');
      cb([...filtered]);
    });
  }

  // ----------------------------------------------------
  // 한국어 학습 콘텐츠 (languageContent) 실시간 구독
  // ----------------------------------------------------
  public subscribeToLanguageContent(callback: LanguageUpdateCallback): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'languageContent'));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => d.data() as LanguageContentItem);
          callback(items);
        } else {
          callback(this.mockLang);
        }
      }, (err) => {
        console.warn('[Firestore] Language Content fallback:', err);
        callback(this.mockLang);
      });
    }

    this.langListeners.push(callback);
    callback(this.mockLang);
    return () => {
      this.langListeners = this.langListeners.filter(l => l !== callback);
    };
  }

  public async updateLanguageReviewStatus(contentId: string, reviewStatus: LanguageContentItem['reviewStatus']) {
    this.mockLang = this.mockLang.map(l =>
      l.contentId === contentId ? { ...l, reviewStatus } : l
    );

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'languageContent', contentId);
        await updateDoc(docRef, { reviewStatus });
      } catch (err) {
        console.warn('Firestore lang update failed:', err);
      }
    }

    this.langListeners.forEach(cb => cb([...this.mockLang]));
  }
}

export const tourService = new TourService();