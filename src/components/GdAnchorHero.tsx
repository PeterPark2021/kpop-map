import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  profile: ArtistProfile;
  lang: LanguageCode;
  onExploreAll: () => void;
}

export const GdAnchorHero: React.FC<Props> = ({ profile, lang, onExploreAll }) => {
  const artistName = profile.name[lang] || profile.name.en || profile.name.ko || 'G-DRAGON';
  const descriptionText = profile.description
    ? (profile.description[lang] || profile.description.ko || profile.description.en || '')
    : '';

  return (
    <section style={{
      background: 'linear-gradient(135deg, #182030 0%, #0b0e14 100%)',
      border: '1px solid #ffd70044',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', background: '#ffd700', color: '#000', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
            FEATURED ANCHOR
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: '8px 0 4px 0' }}>
            {artistName}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            {descriptionText}
          </p>
        </div>

        <button
          onClick={onExploreAll}
          style={{
            background: 'linear-gradient(135deg, #ffd700, #eab308)',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          모든 아티스트 투어 보기 →
        </button>
      </div>
    </section>
  );
};