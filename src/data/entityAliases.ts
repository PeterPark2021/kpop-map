export interface EntityAlias {
  artistId: string;
  canonicalName: string;
  aliases: {
    ko: string[];
    en: string[];
    ja: string[];
    zh: string[];
  };
}

export const entityAliasesDictionary: EntityAlias[] = [
  {
    artistId: 'bigbang-gd',
    canonicalName: 'G-DRAGON & BIGBANG',
    aliases: {
      ko: ['지드래곤', '지디', '권지용', '빅뱅', 'GD', '태양', '대성'],
      en: ['G-DRAGON', 'GD', 'Kwon Ji-yong', 'BIGBANG', 'TAEYANG', 'DAESUNG'],
      ja: ['ジードラゴン', 'クォン・ジヨン', 'ビッグバン', 'GD', 'テヤン', 'D-LITE'],
      zh: ['權志龍', 'BIGBANG', 'GD', '太陽', '大聲']
    }
  },
  {
    artistId: 'bts',
    canonicalName: 'BTS',
    aliases: {
      ko: ['방탄소년단', '방탄', 'BTS', 'RM', '진', '슈가', '제이홉', '지민', '뷔', '정국'],
      en: ['BTS', 'Bangtan Boys', 'RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'],
      ja: ['防弾少年団', 'バンタン', 'BTS', 'ナムジュン', 'ジン', 'ユンギ', 'ホソク', 'ジミン', 'テテ', 'ジョングク'],
      zh: ['防彈少年團', 'BTS', '金南俊', '金碩珍', '閔玧其', '鄭號錫', '朴智旻', '金泰亨', '田柾國']
    }
  },
  {
    artistId: 'blackpink',
    canonicalName: 'BLACKPINK',
    aliases: {
      ko: ['블랙핑크', '블핑', '지수', '제니', '로제', '리사'],
      en: ['BLACKPINK', 'JISOO', 'JENNIE', 'ROSÉ', 'LISA'],
      ja: ['ブラックピンク', 'ブルピン', 'ジス', 'ジェニー', 'ロゼ', 'リサ'],
      zh: ['粉墨', 'BLACKPINK', '金智秀', '金珍妮', '朴彩英', 'LISA']
    }
  },
  {
    artistId: 'seventeen',
    canonicalName: 'SEVENTEEN',
    aliases: {
      ko: ['세븐틴', '세봉이', 'SVT', '17', '에스쿱스', '정한', '조슈아', '준', '호시', '원우', '우지', '디에잇', '민규', '도겸', '승관', '버논', '디노'],
      en: ['SEVENTEEN', 'SVT', 'S.Coups', 'Jeonghan', 'Joshua', 'Jun', 'Hoshi', 'Wonwoo', 'Woozi', 'THE 8', 'Mingyu', 'DK', 'Seungkwan', 'Vernon', 'Dino'],
      ja: ['セブンティーン', 'セブチ', 'SVT', 'エスクプス', 'ジョンハン', 'ジョシュア', 'ジュン', 'ホシ', 'ウォヌ', 'ウジ', 'ディエイト', 'ミンギュ', 'ドギョム', 'スングァン', 'バーノン', 'ディノ'],
      zh: ['十七', 'SEVENTEEN', 'SVT', '崔勝哲', '尹淨漢', '洪知秀', '文俊輝', '權順榮', '全圓佑', '李知勳', '徐明浩', '金珉奎', '李碩珉', '夫勝寬', '崔韓率', '李燦']
    }
  },
  {
    artistId: 'stray-kids',
    canonicalName: 'Stray Kids',
    aliases: {
      ko: ['스트레이키즈', '스트레이 키즈', '스키즈', 'SKZ', '방찬', '리노', '창빈', '현진', '한', '필릭스', '승민', '아이엔'],
      en: ['Stray Kids', 'SKZ', 'Bang Chan', 'Lee Know', 'Changbin', 'Hyunjin', 'HAN', 'Felix', 'Seungmin', 'I.N'],
      ja: ['ストレイキッズ', 'スキズ', 'SKZ', 'バンチャン', 'リノ', 'チャンビン', 'ヒョンジン', 'ハン', 'フィリックス', 'スンミン', 'アイエン'],
      zh: ['Stray Kids', '迷孩', 'SKZ', '方燦', '李旻浩', '徐彰彬', '黃鉉辰', '韓知城', '李龍馥', '金昇玟', '梁精寅']
    }
  }
];