import { collection, onSnapshot, doc, updateDoc, query, where, addDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact, LanguageContentItem, ReviewStatus } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';
import { sampleLanguageContents } from '../data/sampleLanguageContent';
import { computeLifecycleStatus } from '../utils/lifecycleHelper';

class TourService {
  private localNews: TourNewsFact[] = [...sampleNewsFacts];
  private localEvents: TourEvent[] = [...initialBigBangTourEvents];
  private newsListeners: ((news: TourNewsFact[]) => void)[] = [];
  private eventListeners: ((events: TourEvent[]) => void)[] = [];

  // 1. 관리자 및 전체 뉴스 실시간 스트리밍 (pending 포함)
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

  // 2. 아티스트 및 언어별 승인(approved) 뉴스 피드 구독
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

  public notifyNewsUpdated(newItems: TourNewsFact[]) {
    this.localNews = [...newItems, ...this.localNews.filter(n => !newItems.some(item => item.newsId === n.newsId))];
    this.newsListeners.forEach(l => l(this.localNews));
  }

  // 3. 투어 이벤트 실시간 구독 (날짜 기반 동적 상태 자동 계산)
  public subscribeToTourEvents(
    callback: (events: TourEvent[]) => void,
    artistId?: string
  ): () => void {
    if (isFirebaseConfigured && db) {
      const eventsCol = collection(db, 'events');
      const q = artistId ? query(eventsCol, where('artistId', '==', artistId)) : eventsCol;

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const rawEvents = snapshot.docs.map(d => d.data() as TourEvent);
          const computedEvents = rawEvents.map(ev => ({
            ...ev,
            status: computeLifecycleStatus(ev.eventDate, ev.status)
          }));
          this.localEvents = computedEvents;
          callback(computedEvents);
        } else {
          const fallback = (artistId ? initialBigBangTourEvents.filter(e => e.artistId === artistId) : initialBigBangTourEvents).map(ev => ({
            ...ev,
            status: computeLifecycleStatus(ev.eventDate, ev.status)
          }));
          this.localEvents = fallback;
          callback(fallback);
        }
      }, () => {
        const fallback = this.localEvents.map(ev => ({ ...ev, status: computeLifecycleStatus(ev.eventDate, ev.status) }));
        callback(fallback);
      });
    }

    const fallback = this.localEvents.map(ev => ({ ...ev, status: computeLifecycleStatus(ev.eventDate, ev.status) }));
    callback(fallback);
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
    const ev = this.localEvents.find(e => e.eventId === eventId);
    if (ev) {
      ev.status = status;
      this.eventListeners.forEach(l => l([...this.localEvents]));
    }
  }

  // 4. 뉴스 검수 승인 시 이벤트 상태 자동 동기화 브릿지
  public async updateNewsReviewStatus(newsId: string, reviewStatus: ReviewStatus, reason?: string): Promise<void> {
    const targetNews = this.localNews.find(n => n.newsId === newsId);

    if (isFirebaseConfigured && db) {
      try {
        const newsRef = doc(db, 'newsFacts', newsId);
        await updateDoc(newsRef, { reviewStatus, rejectionReason: reason || null });
      } catch (err) {
        console.warn('[Firestore] Update news error:', err);
      }
    }

    if (targetNews) {
      targetNews.reviewStatus = reviewStatus;
      if (reason) targetNews.rejectionReason = reason;

      if (reviewStatus === 'approved' && targetNews.extractedSignal?.signalType === 'ticketOpen') {
        const relatedEventId = targetNews.extractedSignal.relatedEventId;
        if (relatedEventId) {
          await this.syncEventFromNewsFact(relatedEventId, newsId);
        }
      }
      this.newsListeners.forEach(l => l([...this.localNews]));
    }
  }

  public async syncEventFromNewsFact(eventId: string, newsId: string): Promise<void> {
    let currentEvent: TourEvent | undefined = this.localEvents.find(e => e.eventId === eventId);

    if (isFirebaseConfigured && db) {
      try {
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          currentEvent = eventDoc.data() as TourEvent;
        }
      } catch (err) {
        console.warn('[Firestore] getEvent error:', err);
      }
    }

    if (!currentEvent) return;

    const computed = computeLifecycleStatus(currentEvent.eventDate, currentEvent.status);
    if (computed === 'completed' || computed === 'inProgress') {
      console.log(`[RSS Bridge] Skipped stale event ${eventId} (already ${computed})`);
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'eventLifecycleLog'), {
          eventId,
          previousStatus: currentEvent.status,
          newStatus: computed,
          reason: 'rss-bridge-skipped-stale',
          sourceNewsId: newsId,
          changedAt: new Date().toISOString()
        });
      }
      return;
    }

    console.log(`⚡ [RSS Bridge] Auto-flipping event ${eventId} to ticketOpen!`);
    await this.updateEventStatus(eventId, 'ticketOpen');

    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, 'eventLifecycleLog'), {
        eventId,
        previousStatus: currentEvent.status,
        newStatus: 'ticketOpen',
        reason: 'rss-bridge',
        sourceNewsId: newsId,
        changedAt: new Date().toISOString()
      });
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