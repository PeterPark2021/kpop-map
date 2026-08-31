import { useState, useEffect } from 'react';
import { TourNewsFact, LanguageCode } from '../types/types';
import { tourService } from '../services/tourService';

export function useNewsFacts(artistId: string = 'bigbang-gd', lang: LanguageCode = 'ko') {
  const [news, setNews] = useState<TourNewsFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = tourService.subscribeToNewsFacts(artistId, lang, (data: TourNewsFact[]) => {
      setNews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [artistId, lang]);

  return { news, loading };
}