export interface ArtistEntityAlias {
  artistId: string;
  primaryName: string;
  aliases: string[];
}

export const entityAliasesCatalog: ArtistEntityAlias[] = [
  {
    artistId: 'bigbang-gd',
    primaryName: 'G-DRAGON & BIGBANG',
    aliases: [
      '지디', '권지용', 'GD', 'G-DRAGON', 'GDragon', '지드래곤', '빅뱅', 'BIGBANG',
      'クォン・ジヨン', 'ビッグバン', '權志龍', 'BIGBANG2026'
    ]
  },
  {
    artistId: 'bts',
    primaryName: 'BTS',
    aliases: [
      '방탄소년단', 'BTS', '방탄', 'Bangtan', 'RM', '진', '슈가', '제이홉', '지민', '뷔', '정국',
      '防弾少年団', '防彈少年團', 'Beyond The Scene'
    ]
  },
  {
    artistId: 'blackpink',
    primaryName: 'BLACKPINK',
    aliases: [
      '블랙핑크', 'BLACKPINK', '블핑', '지수', '제니', '로제', '리사',
      'ブラックピンク', '粉墨'
    ]
  },
  {
    artistId: 'stray-kids',
    primaryName: 'Stray Kids',
    aliases: [
      '스트레이 키즈', '스키즈', 'Stray Kids', 'SKZ', 'スキズ'
    ]
  }
];

/**
 * 텍스트 또는 검색어에서 아티스트 ID를 판별하는 별칭 매칭 함수
 */
export function resolveArtistByAlias(inputText: string): string | null {
  const normalized = inputText.trim().toLowerCase();
  for (const entity of entityAliasesCatalog) {
    if (entity.aliases.some(alias => normalized.includes(alias.toLowerCase()))) {
      return entity.artistId;
    }
  }
  return null;
}