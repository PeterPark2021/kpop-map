import { useState, useEffect } from 'react';
import { TourNewsFact } from '../types/types';
import { tourService } from '../services/tourService';

export function useNewsFacts(artistId: string, lang: string) {
  const [news, setNews] = useState<TourNewsFact[]>([]);

  useEffect(() => {
    const unsubscribe = tourService.subscribeToNewsFacts(artistId, lang, (data) => {
      setNews(data);
    });
    return () => unsubscribe();
  }, [artistId, lang]);

  return { news };
}
