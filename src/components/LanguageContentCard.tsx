import React, { useState } from 'react';
import { LanguageContentItem, LanguageCode } from '../types/types';
import { playTtsAudio } from '../utils/ttsHelper';
interface Props { item: LanguageContentItem; currentLanguage: LanguageCode; }
export const LanguageContentCard: React.FC<Props> = ({ item, currentLanguage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const getMeaning = () => {
    if (item.translations) {
      if (currentLanguage === 'ja' && item.translations.ja) return item.translations.ja.meaning;
      if (currentLanguage === 'zh' && item.translations['zh-TW']) return item.translations['zh-TW'].meaning;
      if (item.translations.en) return item.translations.en.meaning;
    }
    return item.englishMeaning || item.koreanPhrase || '';
  };
  const handlePlayAudio = () => {
    setIsPlaying(true);
    playTtsAudio(item.koreanText || item.koreanPhrase || item.audioScript || '', item.audioUrl, () => setIsPlaying(false));
  };
  return (
    <div style={{ background: '#161b26', borderRadius: '14px', padding: '20px', border: '1px solid #283042' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        {item.category && <span style={{ background: '#1e293b', color: '#ffd700', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>#{item.category}</span>}
        <button onClick={handlePlayAudio} disabled={isPlaying} style={{ background: isPlaying ? '#ca8a04' : '#1e2433', color: '#ffd700', border: '1px solid #ca8a04', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
          {isPlaying ? '재생중...' : 'AI 음성'}
        </button>
      </div>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>{item.koreanText || item.koreanPhrase}</h3>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0', fontStyle: 'italic' }}>[{item.romanization || item.pronunciation || ''}]</p>
      <p style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 600, margin: '0 0 12px 0' }}>👉 {getMeaning()}</p>
    </div>
  );
};