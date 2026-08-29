import React, { useState } from 'react';
import { LanguageContentItem, LanguageCode } from '../types/types';

interface Props {
  item: LanguageContentItem;
  currentLanguage: LanguageCode;
  variant?: 'compact' | 'expanded';
}

export const LanguageContentCard: React.FC<Props> = ({
  item,
  currentLanguage,
  variant = 'compact'
}) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 전역 LanguageCode ('ko' | 'en' | 'ja' | 'zh' | 'sea') -> 카드 translations 매핑
  const translationKey =
    currentLanguage === 'ja'
      ? 'ja'
      : currentLanguage === 'zh'
      ? 'zh-TW'
      : currentLanguage === 'sea'
      ? 'th'
      : 'en';

  const translation = item.translations[translationKey] || item.translations.en;

  // Web Speech API (speechSynthesis) 한국어 음성 재생
  const handlePlayTTS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('브라우저가 TTS 음성 재생을 지원하지 않습니다.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.audioScript || item.koreanText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const isFandom = item.category === 'fandomTerms';

  return (
    <div
      style={{
        background: '#121622',
        borderRadius: '16px',
        border: '1px solid #232a3d',
        padding: variant === 'compact' ? '20px' : '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
    >
      <div>
        {/* 상단: 카테고리 태그 및 레벨 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span
            style={{
              background: isFandom ? 'rgba(234, 179, 8, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              color: isFandom ? '#fde047' : '#38bdf8',
              border: isFandom ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isFandom ? '💬 팬덤 용어' : '🔊 의성어·의태어'}
          </span>

          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
            ● {item.level}
          </span>
        </div>

        {/* 메인: 한국어 단어 + TTS 재생 버튼 + 로마자 발음 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: variant === 'compact' ? '1.5rem' : '1.9rem', color: '#f8fafc', fontWeight: 900 }}>
              {item.koreanText}
            </h3>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px', fontWeight: 600, letterSpacing: '0.5px' }}>
              [{item.romanization}]
            </div>
          </div>

          <button
            onClick={handlePlayTTS}
            title="한국어 원어민 발음 듣기"
            style={{
              background: isPlayingAudio ? '#eab308' : '#1e2433',
              color: isPlayingAudio ? '#000' : '#ffd700',
              border: '1px solid #ca8a04',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
          >
            {isPlayingAudio ? '🔊' : '🔈'}
          </button>
        </div>

        {/* 번역된 의미 블록 */}
        <div style={{ marginTop: '16px', padding: '12px 14px', background: '#0a0d14', borderRadius: '10px', borderLeft: '3px solid #eab308' }}>
          <div style={{ fontWeight: 800, color: '#fef08a', fontSize: '13px', marginBottom: '3px' }}>
            {translation.term}
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
            {translation.meaning}
          </div>
        </div>
      </div>

      {/* 하단: 문화적 맥락 (Cultural Note) 토글 */}
      {item.culturalNote && (
        <div style={{ marginTop: '14px', borderTop: '1px solid #1e2433', paddingTop: '10px' }}>
          <button
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>💡 왜 이런 뜻일까요? (Why this meaning?)</span>
            <span style={{ fontSize: '9px', background: '#283042', color: '#cbd5e1', padding: '1px 5px', borderRadius: '4px' }}>
              🇰🇷 원문
            </span>
            <span style={{ fontSize: '10px' }}>{isNoteOpen ? '▲' : '▼'}</span>
          </button>

          {isNoteOpen && (
            <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '12px', lineHeight: '1.5', background: '#161b26', padding: '8px 10px', borderRadius: '6px' }}>
              {item.culturalNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
};