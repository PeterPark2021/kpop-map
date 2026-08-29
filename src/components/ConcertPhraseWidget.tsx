import React from 'react';
import { LanguageContentItem, LanguageCode } from '../types/types';

interface Props {
  items: LanguageContentItem[];
  lang: LanguageCode;
}

export const ConcertPhraseWidget: React.FC<Props> = ({ items, lang }) => {
  const approved = items.filter(i => i.reviewStatus === 'approved').slice(0, 3);
  if (approved.length === 0) return null;

  const translationKey = lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh-TW' : lang === 'sea' ? 'th' : 'en';

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(18, 22, 34, 0.9) 100%)',
      border: '1px solid rgba(234, 179, 8, 0.3)',
      borderRadius: '14px',
      padding: '14px 18px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>🎤</span>
        <div>
          <strong style={{ color: '#ffd700', fontSize: '13px' }}>
            이 콘서트에서 꼭 써보세요! (Try these at the concert)
          </strong>
          <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>
            공연장 떼창 및 아티스트 응원 필수 표현
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {approved.map(item => (
          <div
            key={item.contentId}
            style={{
              background: '#0d1017',
              border: '1px solid #283042',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <strong style={{ color: '#f8fafc', fontSize: '13px' }}>{item.koreanText}</strong>
            <span style={{ color: '#64748b', fontSize: '11px' }}>({item.translations[translationKey]?.term || item.translations.en.term})</span>
          </div>
        ))}
      </div>
    </div>
  );
};