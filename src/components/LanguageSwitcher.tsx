import React from 'react';
import { LanguageCode } from '../types/types';

interface Props {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  const list: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'ko', label: 'KR', flag: '🇰🇷' },
    { code: 'ja', label: 'JP', flag: '🇯🇵' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'zh', label: 'TW', flag: '🇹🇼' },
    { code: 'sea', label: 'SEA', flag: '🌏' }
  ];

  return (
    <div style={{ display: 'flex', gap: '6px', background: '#161922', padding: '4px', borderRadius: '8px', border: '1px solid #2d3343' }}>
      {list.map(item => (
        <button
          key={item.code}
          onClick={() => onLanguageChange(item.code)}
          style={{
            background: currentLang === item.code ? '#e11d48' : 'transparent',
            color: currentLang === item.code ? '#fff' : '#94a3b8',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          {item.flag} {item.label}
        </button>
      ))}
    </div>
  );
};
