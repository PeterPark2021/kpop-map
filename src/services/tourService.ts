import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact, LanguageContentItem, ReviewStatus } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';
import { sampleLanguageContents } from '../data/sampleLanguageContent';

class TourService {
  public subscribeToTourEvents(
    callback: (events: TourEvent[]) => void,
    artistId?: string
  ): () => void {
    if (isFirebaseConfigured && db) {
      const eventsCol = collection(db, 'events');
      const q = artistId ? query(eventsCol, where('artistId', '==', artistId)) : eventsCol;

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const events = snapshot.docs.map(d => d.data() as TourEvent);
          callback(events);
        } else {
          if (import.meta.env.DEV) {
            callback(initialBigBangTourEvents);
          } else {
            callback([]);
          }
        }
      }, (err) => {
        console.error('[Firestore] Events listener error:', err);
        if (import.meta.env.DEV) {
          callback(initialBigBangTourEvents);
        } else {
          callback([]);
        }
      });
    }

    if (import.meta.env.DEV) {
      callback(initialBigBangTourEvents);
    }
    return () => {};
  }

  public subscribeToEvents(callback: (events: TourEvent[]) => void): () => void {
    return this.subscribeToTourEvents(callback);
  }

  public async updateEventStatus(eventId: string, status: TourEvent['status']): Promise<void> {
    if (isFirebaseConfigured && db) {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, { status });
    }
  }

  public subscribeToNewsFacts(artistId: string, lang: string, callback: (news: TourNewsFact[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const newsCol = collection(db, 'newsFacts');
      return onSnapshot(newsCol, (snapshot) => {
        if (!snapshot.empty) {
          const news = snapshot.docs.map(d => d.data() as TourNewsFact);
          const filtered = news.filter(n =>
            n.reviewStatus === 'approved' &&
            (n.artistId === artistId || artistId === 'bigbang-gd') &&
            (n.language === lang || n.language === 'ko')
          );
          callback(filtered);
        } else {
          if (import.meta.env.DEV) callback(sampleNewsFacts);
          else callback([]);
        }
      }, () => {
        if (import.meta.env.DEV) callback(sampleNewsFacts);
        else callback([]);
      });
    }
    if (import.meta.env.DEV) callback(sampleNewsFacts);
    return () => {};
  }

  public subscribeToNews(callback: (news: TourNewsFact[]) => void): () => void {
    return this.subscribeToNewsFacts('bigbang-gd', 'ko', callback);
  }

  public async updateNewsReviewStatus(newsId: string, reviewStatus: ReviewStatus, reason?: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      const newsRef = doc(db, 'newsFacts', newsId);
      await updateDoc(newsRef, { reviewStatus, rejectionReason: reason || null });
    }
  }

  public subscribeToLanguageContent(callback: (items: LanguageContentItem[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const langCol = collection(db, 'languageContent');
      return onSnapshot(langCol, (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => d.data() as LanguageContentItem);
          callback(items);
        } else {
          if (import.meta.env.DEV) callback(sampleLanguageContents);
          else callback([]);
        }
      }, () => {
        if (import.meta.env.DEV) callback(sampleLanguageContents);
        else callback([]);
      });
    }
    if (import.meta.env.DEV) callback(sampleLanguageContents);
    return () => {};
  }

  public async updateLanguageReviewStatus(contentId: string, status: ReviewStatus): Promise<void> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'languageContent', contentId);
      await updateDoc(docRef, { reviewStatus: status });
    }
  }
}

export const tourService = new TourService();