import { resolveArtistByAlias } from '../entityAliases';

describe('entityAliases', () => {
  it('resolves GD correctly', () => {
    expect(resolveArtistByAlias('GD')).toBe('bigbang-gd');
    expect(resolveArtistByAlias('지디')).toBe('bigbang-gd');
    expect(resolveArtistByAlias('權志龍')).toBe('bigbang-gd');
    expect(resolveArtistByAlias('gdragon')).toBe('bigbang-gd');
  });

  it('resolves BTS correctly', () => {
    expect(resolveArtistByAlias('BTS')).toBe('bts');
    expect(resolveArtistByAlias('방탄소년단')).toBe('bts');
    expect(resolveArtistByAlias('防弾少年団')).toBe('bts');
  });

  it('resolves BLACKPINK correctly', () => {
    expect(resolveArtistByAlias('블핑')).toBe('blackpink');
    expect(resolveArtistByAlias('blackpink')).toBe('blackpink');
  });

  it('resolves Stray Kids correctly', () => {
    expect(resolveArtistByAlias('SKZ')).toBe('stray-kids');
    expect(resolveArtistByAlias('스키즈')).toBe('stray-kids');
  });

  it('returns null for unknown aliases', () => {
    expect(resolveArtistByAlias('unknown-artist')).toBeNull();
  });
});
