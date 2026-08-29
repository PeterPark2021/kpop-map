import { collection, onSnapshot, doc, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact, LanguageContentItem, ReviewStatus } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';
import { sampleLanguageContents } from '../data/sampleLanguageContent';

class TourService {
  private localNews: TourNewsFact[] = [...sampleNewsFacts];
  private newsListeners: ((news: TourNewsFact[]) => void)[] = [];

  // 📡 관리자 및 전체 뉴스 실시간 스트리밍 (pending 포함)
  public subscribeToAllNews(callback: (news: TourNewsFact[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const newsCol = collection(db, 'newsFacts');
      return onSnapshot(newsCol, (snapshot) => {
        if (!snapshot.empty) {
          const news = snapshot.docs.map(d => d.data() as TourNewsFact);
          this.localNews = news;
          callback(news);
        } else {
          callback(this.localNews);
        }
      }, (err) => {
        console.warn('[Firestore] All news fallback:', err);
        callback(this.localNews);
      });
    }
    this.newsListeners.push(callback);
    callback(this.localNews);
    return () => {
      this.newsListeners = this.newsListeners.filter(l => l !== callback);
    };
  }

  public notifyNewsUpdated(newItems: TourNewsFact[]) {
    this.localNews = [...newItems, ...this.localNews.filter(n => !newItems.some(item => item.newsId === n.newsId))];
    this.newsListeners.forEach(l => l(this.localNews));
  }

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
          if (import.meta.env.DEV) callback(initialBigBangTourEvents);
          else callback([]);
        }
      }, (err) => {
        console.error('[Firestore] Events error:', err);
        if (import.meta.env.DEV) callback(initialBigBangTourEvents);
        else callback([]);
      });
    }

    if (import.meta.env.DEV) callback(initialBigBangTourEvents);
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
          callback(this.localNews.filter(n => n.reviewStatus === 'approved'));
        }
      }, () => {
        callback(this.localNews.filter(n => n.reviewStatus === 'approved'));
      });
    }
    callback(this.localNews.filter(n => n.reviewStatus === 'approved'));
    return () => {};
  }

  public subscribeToNews(callback: (news: TourNewsFact[]) => void): () => void {
    return this.subscribeToNewsFacts('bigbang-gd', 'ko', callback);
  }

  public async updateNewsReviewStatus(newsId: string, reviewStatus: ReviewStatus, reason?: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const newsRef = doc(db, 'newsFacts', newsId);
        await updateDoc(newsRef, { reviewStatus, rejectionReason: reason || null });
      } catch (err) {
        console.warn('[Firestore] Update status error:', err);
      }
    }
    const item = this.localNews.find(n => n.newsId === newsId);
    if (item) {
      item.reviewStatus = reviewStatus;
      if (reason) item.rejectionReason = reason;
      this.newsListeners.forEach(l => l([...this.localNews]));
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
          callback(sampleLanguageContents);
        }
      }, () => {
        callback(sampleLanguageContents);
      });
    }
    callback(sampleLanguageContents);
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