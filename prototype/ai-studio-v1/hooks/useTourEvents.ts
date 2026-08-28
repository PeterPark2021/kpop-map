import { useState, useEffect } from 'react';
import { TourEvent } from '../types/types';
import { tourService } from '../services/tourService';

export function useTourEvents() {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TourEvent | null>(null);

  useEffect(() => {
    const unsubscribe = tourService.subscribeToTourEvents((updatedEvents) => {
      setEvents(updatedEvents);
    });
    return () => unsubscribe();
  }, []);

  return {
    events,
    selectedEvent,
    setSelectedEvent,
    updateStatus: tourService.updateEventStatus.bind(tourService)
  };
}
