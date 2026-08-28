import { TourEvent, TourNewsFact } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';

export type EventUpdateCallback = (events: TourEvent[]) => void;

class TourService {
  private events: TourEvent[] = [...initialBigBangTourEvents];
  private listeners: EventUpdateCallback[] = [];

  // Firestore onSnapshot() 어댑터 인터페이스
  public subscribeToTourEvents(callback: EventUpdateCallback): () => void {
    this.listeners.push(callback);
    callback(this.events); // 초기 데이터 전달

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // 도시 상태 변경 시뮬레이터
  public updateEventStatus(eventId: string, newStatus: TourEvent['status']) {
    this.events = this.events.map(ev =>
      ev.eventId === eventId ? { ...ev, status: newStatus } : ev
    );
    this.listeners.forEach(cb => cb(this.events));
  }

  public getNewsFacts(artistId: string, lang: string): TourNewsFact[] {
    return sampleNewsFacts.filter(
      fact => fact.artistId === artistId && (fact.language === lang || fact.language === 'ko')
    );
  }
}

export const tourService = new TourService();
