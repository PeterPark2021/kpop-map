import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';

export type EventUpdateCallback = (events: TourEvent[]) => void;
export type NewsUpdateCallback = (news: TourNewsFact[]) => void;

class TourService {
  private mockEvents: TourEvent[] = [...initialBigBangTourEvents];
  private mockNews: TourNewsFact[] = [...sampleNewsFacts];
  private eventListeners: EventUpdateCallback[] = [];
  private newsListeners: { lang: string; cb: NewsUpdateCallback }[] = [];

  public subscribeToTourEvents(callback: EventUpdateCallback): () => void {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'events'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const events = snapshot.docs.map((d) => d.data() as TourEvent);
          callback(events);
        } else {
          callback(this.mockEvents);
        }
      }, (error) => {
        console.error('[Firestore] Events error, falling back:', error);
        callback(this.mockEvents);
      });
      return unsubscribe;
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
        console.warn('Firestore update failed, updating local state:', err);
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
      const q = query(
        collection(db, 'newsFacts'),
        where('artistId', '==', artistId)
      );

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const facts = snapshot.docs.map(d => d.data() as TourNewsFact);
          callback(facts);
        } else {
          emitCurrent();
        }
      }, () => {
        emitCurrent();
      });
    }

    this.newsListeners.push({ lang: targetLang, cb: callback });
    emitCurrent();
    return () => {
      this.newsListeners = this.newsListeners.filter(l => l.cb !== callback);
    };
  }

  // 검수 상태 영구 업데이트 (승인/반려)
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

    // 모든 뉴스 구독자에게 즉시 새 상태 전파
    this.newsListeners.forEach(({ lang, cb }) => {
      const filtered = this.mockNews.filter(f => f.language === lang || f.language === 'ko');
      cb([...filtered]);
    });
  }

  public getAllNews(): TourNewsFact[] {
    return [...this.mockNews];
  }
}

export const tourService = new TourService();