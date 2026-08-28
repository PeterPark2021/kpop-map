export const entityAliases: Record<string, string[]> = {
  'bigbang-gd': ['지디', '권지용', 'GD', 'G-DRAGON', 'GDragon', '지드래곤', '빅뱅', 'BIGBANG', 'クォン・ジヨン', '權志龍'],
  'bts': ['방탄소년단', 'BTS', '방탄', 'Bangtan', 'RM', '진', '슈가', '제이홉', '지민', '뷔', '정국', '防弾少年団'],
  'blackpink': ['블랙핑크', 'BLACKPINK', '블핑', '지수', '제니', '로제', '리사', 'ブラックピンク', '粉墨'],
  'stray-kids': ['스트레이 키즈', '스키즈', 'Stray Kids', 'SKZ', 'スキズ']
};

export function resolveArtistByAlias(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();

  for (const [artistId, aliases] of Object.entries(entityAliases)) {
    if (aliases.some(alias => alias.toLowerCase() === normalizedQuery)) {
      return artistId;
    }
  }

  return null;
}
