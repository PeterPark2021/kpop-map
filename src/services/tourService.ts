import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact, LanguageContentItem, ReviewStatus } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';
import { sampleLanguageContents } from '../data/sampleLanguageContent';

class TourService {
  private mockEvents: TourEvent[] = initialBigBangTourEvents;
  private mockNews: TourNewsFact[] = sampleNewsFacts;
  private mockLang: LanguageContentItem[] = sampleLanguageContents;

  // 1. 투어 일정 실시간 구독
  public subscribeToEvents(callback: (events: TourEvent[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const eventsCol = collection(db, 'events');
      return onSnapshot(eventsCol, (snapshot) => {
        if (!snapshot.empty) {
          const events = snapshot.docs.map(d => d.data() as TourEvent);
          callback(events);
        } else {
          callback(this.mockEvents);
        }
      }, (err) => {
        console.warn('[Firestore] Events fallback:', err);
        callback(this.mockEvents);
      });
    }
    callback(this.mockEvents);
    return () => {};
  }

  // 2. 투어 일정 상태 변경
  public async updateEventStatus(eventId: string, status: TourEvent['status']): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, { status });
      } catch (err) {
        console.warn('[Firestore] Update event error:', err);
      }
    }
    const event = this.mockEvents.find(e => e.eventId === eventId);
    if (event) event.status = status;
  }

  // 3. 뉴스 팩트 실시간 구독
  public subscribeToNews(callback: (news: TourNewsFact[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const newsCol = collection(db, 'newsFacts');
      return onSnapshot(newsCol, (snapshot) => {
        if (!snapshot.empty) {
          const news = snapshot.docs.map(d => d.data() as TourNewsFact);
          callback(news);
        } else {
          callback(this.mockNews);
        }
      }, (err) => {
        console.warn('[Firestore] News fallback:', err);
        callback(this.mockNews);
      });
    }
    callback(this.mockNews);
    return () => {};
  }

  // 4. 뉴스 검수 상태 변경
  public async updateNewsReviewStatus(newsId: string, reviewStatus: ReviewStatus, reason?: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const newsRef = doc(db, 'newsFacts', newsId);
        await updateDoc(newsRef, { reviewStatus, rejectionReason: reason || null });
      } catch (err) {
        console.warn('[Firestore] Update news status error:', err);
      }
    }
    const item = this.mockNews.find(n => n.newsId === newsId);
    if (item) {
      item.reviewStatus = reviewStatus;
      if (reason) item.rejectionReason = reason;
    }
  }

  // 5. 한국어 학습 콘텐츠 실시간 구독
  public subscribeToLanguageContent(callback: (items: LanguageContentItem[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      const langCol = collection(db, 'languageContent');
      return onSnapshot(langCol, (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(d => d.data() as LanguageContentItem);
          callback(items);
        } else {
          callback(this.mockLang);
        }
      }, (err) => {
        console.warn('[Firestore] Language content fallback:', err);
        callback(this.mockLang);
      });
    }
    callback(this.mockLang);
    return () => {};
  }

  // 6. 한국어 학습 콘텐츠 검수 상태 변경
  public async updateLanguageReviewStatus(contentId: string, status: ReviewStatus): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'languageContent', contentId);
        await updateDoc(docRef, { reviewStatus: status });
      } catch (err) {
        console.warn('[Firestore] Update lang review error:', err);
      }
    }
    const item = this.mockLang.find(l => l.contentId === contentId);
    if (item) item.reviewStatus = status;
  }
}

export const tourService = new TourService();