import { LanguageContentItem } from '../types/types';

export const sampleLanguageContents: LanguageContentItem[] = [
  {
    contentId: 'lang-001',
    category: 'fandomTerms',
    level: 'beginner',
    koreanText: '최애',
    romanization: 'Choe-ae',
    audioScript: '최애',
    translations: {
      en: { term: 'Ultimate Bias', meaning: 'Your most favorite member in the group.' },
      ja: { term: '推し (最愛)', meaning: 'グループの中で一番好きなメンバー。' },
      'zh-TW': { term: '最愛 / 本命', meaning: '團體中最喜歡的成員（本命）。' },
      th: { term: 'เมนหลัก (Bias)', meaning: 'สมาชิกที่ชื่นชอบที่สุดในวง' }
    },
    culturalNote: '최고로 사랑하는 대상을 뜻하는 줄임말로, 아이돌 팬덤에서 가장 사랑하는 멤버를 지칭할 때 필수적으로 쓰입니다.',
    reviewStatus: 'approved',
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    contentId: 'lang-002',
    category: 'fandomTerms',
    level: 'intermediate',
    koreanText: '떼창',
    romanization: 'Tte-chang',
    audioScript: '떼창',
    translations: {
      en: { term: 'Crowd Sing-along', meaning: 'The entire stadium crowd singing the lyrics together loudly.' },
      ja: { term: '大合唱', meaning: '観客全員が一緒に大きな声で歌うこと。' },
      'zh-TW': { term: '全場大合唱', meaning: '演唱會現場所有歌迷一起齊聲合唱。' },
      th: { term: 'ร้องเพลงพร้อมกันทั้งฮอลล์', meaning: 'การที่แฟนคลับทั้งคอนเสิร์ตร้องเพลงพร้อมกัน' }
    },
    culturalNote: '한국 콘서트 문화의 상징으로, 해외 아티스트들도 감동하는 한국 팬덤의 열정적인 합창 문화를 뜻합니다.',
    reviewStatus: 'approved',
    createdAt: '2026-03-02T00:00:00Z'
  },
  {
    contentId: 'lang-003',
    category: 'fandomTerms',
    level: 'intermediate',
    koreanText: '내적댄스',
    romanization: 'Nae-jeok-daen-seu',
    audioScript: '내적댄스',
    translations: {
      en: { term: 'Inner Dancing', meaning: 'Dancing excitedly in your mind while staying still on the outside.' },
      ja: { term: '心の中のダンス', meaning: '体は静かにしながらも、心の中で激しく踊っている状態。' },
      'zh-TW': { term: '內心在跳舞', meaning: '表面冷靜但內心激動地隨著音樂舞動。' },
      th: { term: 'เต้นในใจ', meaning: 'ความรู้สึกอยากเต้นตามอย่างตื่นเต้นอยู่ข้างใน' }
    },
    culturalNote: '대중교통이나 조용한 장소에서 신나는 K-POP 음악을 들을 때 겉으로는 얌전하지만 속으로는 춤추고 있는 유쾌한 심리를 표현합니다.',
    reviewStatus: 'approved',
    createdAt: '2026-03-03T00:00:00Z'
  },
  {
    contentId: 'lang-004',
    category: 'onomatopoeia',
    level: 'beginner',
    koreanText: '두근두근',
    romanization: 'Du-geun-du-geun',
    audioScript: '두근두근',
    translations: {
      en: { term: 'Pit-a-pat (Heart thumping)', meaning: 'Sound of a pounding heart before meeting your idol.' },
      ja: { term: 'ドキドキ', meaning: '推しに会う直前の胸が高鳴る音。' },
      'zh-TW': { term: '撲通撲通 (心跳聲)', meaning: '見到偶像前緊張興奮的心跳聲。' },
      th: { term: 'ตึกตัก ตึกตัก', meaning: 'เสียงหัวใจเต้นแรงด้วยความตื่นเต้น' }
    },
    culturalNote: '콘서트 티켓팅 직전이나 오프닝 카운트다운 때 심장이 뛰는 감정을 나타내는 대표적인 의태어입니다.',
    reviewStatus: 'approved',
    createdAt: '2026-03-04T00:00:00Z'
  },
  {
    contentId: 'lang-005',
    category: 'onomatopoeia',
    level: 'beginner',
    koreanText: '흥얼흥얼',
    romanization: 'Heung-eol-heung-eol',
    audioScript: '흥얼흥얼',
    translations: {
      en: { term: 'Humming along', meaning: 'Humming a catchy tour song softly to yourself.' },
      ja: { term: '口ずさむ / フンフン', meaning: '好きな曲を楽しく口ずさむ様子。' },
      'zh-TW': { term: '輕聲哼唱', meaning: '心情愉悅地哼著喜歡的歌曲。' },
      th: { term: 'ฮัมเพลงเบาๆ', meaning: 'การฮัมเพลงอย่างเพลิดเพลิน' }
    },
    culturalNote: '콘서트가 끝난 후 귀갓길에 공연 세트리스트 멜로디가 귓가에 맴돌아 자연스럽게 흥얼거리는 모습을 묘사합니다.',
    reviewStatus: 'approved',
    createdAt: '2026-03-05T00:00:00Z'
  },
  {
    contentId: 'lang-pending-001',
    category: 'fandomTerms',
    level: 'advanced',
    koreanText: '피켓팅',
    romanization: 'Pi-ket-ting',
    audioScript: '피켓팅',
    translations: {
      en: { term: 'Bloodbath Ticketing', meaning: 'Extremely fierce ticketing battle (Blood + Ticketing).' },
      ja: { term: '血のチケット争奪戦', meaning: '血を見るほど激しいチケット予約戦争。' },
      'zh-TW': { term: '血腥搶票戰', meaning: '如同流血般異常激烈的搶票大戰。' },
      th: { term: 'สงครามกดบัตร', meaning: 'การแย่งชิงบัตรคอนเสิร์ตที่ดุเดือดมาก' }
    },
    culturalNote: '‘피(Blood)’와 ‘티켓팅(Ticketing)’의 합성어로 1초 만에 매진되는 K-POP 스타디움 콘서트 예매의 치열함을 뜻합니다.',
    reviewStatus: 'pending',
    createdAt: '2026-03-06T00:00:00Z'
  }
];