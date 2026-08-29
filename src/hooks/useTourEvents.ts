import { useState, useEffect } from 'react';
import { TourEvent } from '../types/types';
import { tourService } from '../services/tourService';
export function useTourEvents(artistId: string = 'bigbang-gd') {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = tourService.subscribeToTourEvents((updated: TourEvent[]) => {
      setEvents(updated);
      setLoading(false);
    }, artistId);
    return () => unsubscribe();
  }, [artistId]);
  const updateStatus = async (eventId: string, nextStatus: TourEvent['status']) => {
    await tourService.updateEventStatus(eventId, nextStatus);
  };
  return { events, loading, updateStatus };
}