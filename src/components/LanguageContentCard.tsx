import React, { useState } from 'react';
import { LanguageContentItem, LanguageCode } from '../types/types';
import { playTtsAudio } from '../utils/ttsHelper';

interface Props {
  item: LanguageContentItem;
  currentLanguage: LanguageCode;
}

export const LanguageContentCard: React.FC<Props> = ({ item, currentLanguage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const getMeaning = () => {
    if (item.translations) {
      if (currentLanguage === 'ja' && item.translations.ja) return item.translations.ja.meaning;
      if (currentLanguage === 'zh' && item.translations['zh-TW']) return item.translations['zh-TW'].meaning;
      if (item.translations.en) return item.translations.en.meaning;
    }
    if (currentLanguage === 'ja' && item.japaneseMeaning) return item.japaneseMeaning;
    if (currentLanguage === 'zh' && item.chineseMeaning) return item.chineseMeaning;
    return item.englishMeaning || item.koreanPhrase || '';
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    const textToSpeak = item.koreanText || item.koreanPhrase || item.audioScript || '';
    playTtsAudio(
      textToSpeak,
      item.audioUrl,
      () => setIsPlaying(false)
    );
  };

  const koreanDisplay = item.koreanText || item.koreanPhrase || '';
  const romanDisplay = item.romanization || item.pronunciation || '';
  const contextDisplay = item.contextUsage || item.culturalNote || '';

  return (
    <div style={{
      background: '#161b26',
      borderRadius: '14px',
      padding: '20px',
      border: '1px solid #283042',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          {item.category && (
            <span style={{
              background: '#1e293b',
              color: '#ffd700',
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 700
            }}>
              #{item.category}
            </span>
          )}
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            style={{
              background: isPlaying ? '#ca8a04' : '#1e2433',
              color: '#ffd700',
              border: '1px solid #ca8a04',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: isPlaying ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{isPlaying ? '🔊' : '🔈'}</span> {isPlaying ? '재생중...' : 'AI 음성'}
          </button>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
          {koreanDisplay}
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0', fontStyle: 'italic' }}>
          [{romanDisplay}]
        </p>

        <p style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 600, margin: '0 0 12px 0' }}>
          👉 {getMeaning()}
        </p>
      </div>

      {contextDisplay && (
        <div style={{ marginTop: '10px', borderTop: '1px solid #1e2433', paddingTop: '10px' }}>
          <button
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '12px',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>💡 활용 팁 & 문화 가이드</span>
            <span style={{ fontSize: '10px' }}>{isNoteOpen ? '▲' : '▼'}</span>
          </button>
          {isNoteOpen && (
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', lineHeight: '1.5', background: '#0b0e14', padding: '8px 12px', borderRadius: '8px' }}>
              {contextDisplay}
            </p>
          )}
        </div>
      )}
    </div>
  );
};