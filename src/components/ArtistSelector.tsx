import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  artists: ArtistProfile[];
  selectedArtistId: string;
  lang: LanguageCode;
  favoriteArtistIds?: string[];
  filterOnlyFavorites?: boolean;
  onSelectArtist: (artistId: string) => void;
  onToggleFavorite?: (artistId: string) => void;
  onToggleFilterFavorites?: () => void;
}

export const ArtistSelector: React.FC<Props> = ({
  artists,
  selectedArtistId,
  lang,
  favoriteArtistIds = [],
  filterOnlyFavorites = false,
  onSelectArtist,
  onToggleFavorite,
  onToggleFilterFavorites
}) => {
  const displayedArtists = filterOnlyFavorites
    ? artists.filter(a => favoriteArtistIds.includes(a.artistId))
    : artists;

  return (
    <div style={{ margin: '16px 0 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>
          ⭐ 관심 아티스트를 팔로우하고 투어 알림을 받아보세요
        </span>
        {onToggleFilterFavorites && (
          <button
            onClick={onToggleFilterFavorites}
            style={{
              background: filterOnlyFavorites ? '#ffd700' : '#1e2433',
              color: filterOnlyFavorites ? '#000' : '#ffd700',
              border: '1px solid #ffd70066',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {filterOnlyFavorites ? '✓ 내 관심 아티스트만 보는 중' : '⭐ 내 아티스트만 보기'}
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {displayedArtists.map((artist) => {
          const isSelected = artist.artistId === selectedArtistId;
          const isFavorite = favoriteArtistIds.includes(artist.artistId);
          const artistName = artist.name[lang] || artist.name.en || artist.name.ko || 'Artist';

          return (
            <div
              key={artist.artistId}
              onClick={() => onSelectArtist(artist.artistId)}
              style={{
                background: isSelected ? '#1e2433' : '#121622',
                border: isSelected ? '2px solid #ffd700' : '1px solid #232a3d',
                borderRadius: '12px',
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 16px rgba(255, 215, 0, 0.25)' : 'none'
              }}
            >
              <div>
                <strong style={{ fontSize: '14px', color: isSelected ? '#ffd700' : '#f8fafc', display: 'block' }}>
                  {artistName}
                </strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {artist.isAnchor ? '👑 앵커 아티스트' : '월드투어'}
                </span>
              </div>

              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(artist.artistId);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    color: isFavorite ? '#ffd700' : '#475569',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title={isFavorite ? '관심 아티스트 해제' : '관심 아티스트 등록'}
                >
                  {isFavorite ? '★' : '☆'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};