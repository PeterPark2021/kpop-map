import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { TourEvent, TourNewsFact } from '../types/types';
import { initialBigBangTourEvents, sampleNewsFacts } from '../data/initialData';

export type EventUpdateCallback = (events: TourEvent[]) => void;
export type NewsUpdateCallback = (news: TourNewsFact[]) => void;

class TourService {
  private mockEvents: TourEvent[] = [...initialBigBangTourEvents];
  private mockListeners: EventUpdateCallback[] = [];

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

    this.mockListeners.push(callback);
    callback(this.mockEvents);
    return () => {
      this.mockListeners = this.mockListeners.filter(l => l !== callback);
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
    this.mockListeners.forEach(cb => cb([...this.mockEvents]));
  }

  public subscribeToNewsFacts(artistId: string, lang: string, callback: NewsUpdateCallback): () => void {
    const targetLang = lang === 'sea' ? 'en' : lang;

    const getLocalFallback = () => {
      const filtered = sampleNewsFacts.filter(f => f.artistId === artistId && f.language === targetLang);
      return filtered.length > 0 ? filtered : sampleNewsFacts;
    };

    if (isFirebaseConfigured && db) {
      const q = query(
        collection(db, 'newsFacts'),
        where('artistId', '==', artistId),
        where('language', '==', targetLang)
      );

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const facts = snapshot.docs.map(d => d.data() as TourNewsFact);
          callback(facts);
        } else {
          callback(getLocalFallback());
        }
      }, () => {
        callback(getLocalFallback());
      });
    }

    callback(getLocalFallback());
    return () => {};
  }
}

export const tourService = new TourService();