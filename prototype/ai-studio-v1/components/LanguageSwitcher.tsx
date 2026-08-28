import React from 'react';
import { LanguageCode } from '../types/types';

interface Props {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '繁體中文', flag: '🇹🇼' },
    { code: 'sea', label: 'SEA', flag: '🌏' },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '10px', background: '#1a1a1a', borderRadius: '8px' }}>
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => onLanguageChange(l.code)}
          style={{
            background: currentLang === l.code ? '#e50914' : '#333',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
};
