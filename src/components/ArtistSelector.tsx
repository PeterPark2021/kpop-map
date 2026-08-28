import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  artists: ArtistProfile[];
  selectedArtistId: string;
  lang: LanguageCode;
  onSelectArtist: (artistId: string) => void;
}

export const ArtistSelector: React.FC<Props> = ({ artists, selectedArtistId, lang, onSelectArtist }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      padding: '4px 0 16px 0',
      marginBottom: '16px'
    }}>
      {artists.map((artist) => {
        const isSelected = artist.artistId === selectedArtistId;
        const badgeColor =
          artist.artistId === 'bigbang-gd'
            ? '#ffd700'
            : artist.artistId === 'bts'
            ? '#a855f7'
            : '#ec4899';

        return (
          <button
            key={artist.artistId}
            onClick={() => onSelectArtist(artist.artistId)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isSelected ? '#1e2433' : '#12151e',
              color: isSelected ? '#fff' : '#94a3b8',
              border: isSelected ? `2px solid ${badgeColor}` : '1px solid #283042',
              padding: '10px 18px',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              boxShadow: isSelected ? `0 0 15px ${badgeColor}33` : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: badgeColor,
              display: 'inline-block'
            }} />
            {artist.name[lang] || artist.name.en}
            {artist.isAnchor && (
              <span style={{ fontSize: '10px', background: '#eab308', color: '#000', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                ANCHOR
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};