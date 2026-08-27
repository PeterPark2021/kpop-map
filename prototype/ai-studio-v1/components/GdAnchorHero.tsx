import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  profile: ArtistProfile;
  lang: LanguageCode;
  onExploreAll: () => void;
}

export const GdAnchorHero: React.FC<Props> = ({ profile, lang, onExploreAll }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #111 0%, #2a1b00 100%)',
      color: '#fff',
      padding: '40px 20px',
      borderRadius: '12px',
      border: '1px solid #ffd700',
      marginBottom: '20px'
    }}>
      <span style={{ background: '#ffd700', color: '#000', padding: '4px 8px', fontWeight: 'bold', borderRadius: '4px' }}>
        ★ 2026 ANCHOR ARTIST
      </span>
      <h1 style={{ fontSize: '2.5rem', margin: '15px 0 10px 0' }}>
        {profile.name[lang] || profile.name.ko}
      </h1>
      <p style={{ color: '#ccc', maxWidth: '600px', lineHeight: '1.6' }}>
        {profile.description[lang] || profile.description.ko}
      </p>
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
        <button
          onClick={onExploreAll}
          style={{
            background: '#ffd700',
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          전체 K-pop 월드투어 지도 탐색하기 ➔
        </button>
      </div>
    </div>
  );
};
