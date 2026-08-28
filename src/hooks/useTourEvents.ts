import { useState, useEffect } from 'react';
import { TourEvent } from '../types/types';
import { tourService } from '../services/tourService';

export function useTourEvents() {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TourEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = tourService.subscribeToTourEvents((updated) => {
      setEvents(updated);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    events,
    selectedEvent,
    setSelectedEvent,
    loading,
    updateStatus: tourService.updateEventStatus.bind(tourService)
  };
}
