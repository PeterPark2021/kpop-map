import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  artists: ArtistProfile[];
  selectedArtistId: string;
  lang: LanguageCode;
  onSelectArtist: (artistId: string) => void;
}

export const ArtistSelector: React.FC<Props> = ({ artists, selectedArtistId, lang, onSelectArtist }) => {
  const getBadgeColor = (artistId: string) => {
    switch (artistId) {
      case 'bigbang-gd': return '#ffd700'; // Gold
      case 'bts': return '#a855f7';        // Purple
      case 'blackpink': return '#ec4899';  // Pink
      case 'seventeen': return '#38bdf8';  // Rose Quartz & Serenity Sky Blue
      case 'stray-kids': return '#ef4444'; // Crimson Neon Red
      default: return '#eab308';
    }
  };

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
        const badgeColor = getBadgeColor(artist.artistId);

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
              boxShadow: isSelected ? `0 0 16px ${badgeColor}44` : 'none',
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