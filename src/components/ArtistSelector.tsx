import React from 'react';
import { ArtistProfile, LanguageCode } from '../types/types';

interface Props {
  artists: ArtistProfile[];
  selectedArtistId: string;
  lang: LanguageCode;
  favoriteArtistIds: string[];
  filterOnlyFavorites: boolean;
  onSelectArtist: (artistId: string) => void;
  onToggleFavorite: (artistId: string) => void;
  onToggleFilterFavorites: () => void;
}

export const ArtistSelector: React.FC<Props> = ({
  artists,
  selectedArtistId,
  lang,
  favoriteArtistIds,
  filterOnlyFavorites,
  onSelectArtist,
  onToggleFavorite,
  onToggleFilterFavorites
}) => {
  const getBadgeColor = (artistId: string) => {
    switch (artistId) {
      case 'bigbang-gd': return '#ffd700';
      case 'bts': return '#a855f7';
      case 'blackpink': return '#ec4899';
      case 'seventeen': return '#38bdf8';
      case 'stray-kids': return '#ef4444';
      default: return '#eab308';
    }
  };

  const displayedArtists = filterOnlyFavorites
    ? artists.filter(a => favoriteArtistIds.includes(a.artistId))
    : artists;

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* 상단 뷰 모드 토글 (전체 vs 내 아티스트만) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>아티스트 선택</span>
        <button
          onClick={onToggleFilterFavorites}
          style={{
            background: filterOnlyFavorites ? '#ffd700' : '#161b26',
            color: filterOnlyFavorites ? '#000' : '#ffd700',
            border: '1px solid #ca8a04',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {filterOnlyFavorites ? '⭐ 내 아티스트만 보는 중' : '☆ 내 아티스트만 보기'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        padding: '4px 0 10px 0'
      }}>
        {displayedArtists.map((artist) => {
          const isSelected = artist.artistId === selectedArtistId;
          const isFav = favoriteArtistIds.includes(artist.artistId);
          const badgeColor = getBadgeColor(artist.artistId);

          return (
            <div
              key={artist.artistId}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: isSelected ? '#1e2433' : '#12151e',
                border: isSelected ? `2px solid ${badgeColor}` : '1px solid #283042',
                borderRadius: '24px',
                padding: '4px 8px 4px 14px',
                boxShadow: isSelected ? `0 0 16px ${badgeColor}44` : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <button
                onClick={() => onSelectArtist(artist.artistId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: isSelected ? '#fff' : '#94a3b8',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  padding: '6px 0'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badgeColor, display: 'inline-block' }} />
                {artist.name[lang] || artist.name.en}
              </button>

              {/* 팔로우 / 즐겨찾기 별 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(artist.artistId);
                }}
                title={isFav ? '팔로우 취소' : '아티스트 팔로우'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isFav ? '#ffd700' : '#475569',
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginLeft: '6px',
                  padding: '4px',
                  lineHeight: 1
                }}
              >
                {isFav ? '★' : '☆'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};