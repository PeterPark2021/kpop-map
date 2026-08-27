import { useState } from 'react';
import { LanguageCode } from '../types/types';

export function useLanguage(initialLang: LanguageCode = 'ko') {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(initialLang);

  return {
    currentLang,
    setCurrentLang
  };
}
