import { useState, useEffect } from 'react';
import { TourNewsFact } from '../types/types';
import { tourService } from '../services/tourService';

export function useNewsFacts(artistId: string, lang: string) {
  const [news, setNews] = useState<TourNewsFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = tourService.subscribeToNewsFacts(artistId, lang, (data: TourNewsFact[]) => {
      setNews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [artistId, lang]);

  return { news, loading };
}