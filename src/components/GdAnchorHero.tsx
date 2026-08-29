import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  profile: ArtistProfile;
  lang: LanguageCode;
  onExploreAll: () => void;
}

export const GdAnchorHero: React.FC<Props> = ({ profile, lang, onExploreAll }) => {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #181308 0%, #2e2105 50%, #0d0e12 100%)',
      border: '1px solid #eab308',
      borderRadius: '16px',
      padding: '36px',
      marginBottom: '28px',
      boxShadow: '0 10px 30px rgba(234, 179, 8, 0.15)'
    }}>
      <span style={{
        background: '#eab308',
        color: '#000',
        padding: '4px 10px',
        fontWeight: 800,
        borderRadius: '6px',
        fontSize: '12px',
        letterSpacing: '1px'
      }}>
        ★ 2026 GLOBAL ANCHOR
      </span>
      <h1 style={{ fontSize: '2.4rem', margin: '16px 0 8px 0', color: '#fef08a' }}>
        {profile.name[lang] || profile.name.ko}
      </h1>
      <p style={{ color: '#cbd5e1', maxWidth: '680px', lineHeight: '1.6', fontSize: '1.05rem' }}>
        {profile.description ? (profile.description[lang] || profile.description.ko) : ''}
      </p>
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={onExploreAll}
          style={{
            background: '#eab308',
            color: '#000',
            fontWeight: 700,
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          전체 K-POP 월드투어 맵 보기 ➔
        </button>
      </div>
    </section>
  );
};
