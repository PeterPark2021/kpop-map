import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8ZeKub7I8WTZD8NkSmCEa7mg2948RgrQ",
  authDomain: "kpop-map-prod.firebaseapp.com",
  projectId: "kpop-map-prod",
  storageBucket: "kpop-map-prod.firebasestorage.app",
  messagingSenderId: "943551072546",
  appId: "1:943551072546:web:74a88a4947ac48e2c7bd7b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const allEvents = [
  // 1. G-DRAGON (BIGBANG) 2026 World Tour
  { eventId: 'gd-seoul-2026', artistId: 'bigbang-gd', artistName: { ko: '지드래곤', en: 'G-DRAGON', ja: 'G-DRAGON', zh: 'G-DRAGON' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首尔' }, country: 'KR', venueName: { ko: '서울 고척스카이돔', en: 'Gocheok Sky Dome' }, coordinates: { lat: 37.4982, lng: 126.8671 }, eventDate: '2026-03-28T19:00:00Z', status: 'ticketOpen', isHighlight: true },
  { eventId: 'gd-tokyo-2026', artistId: 'bigbang-gd', artistName: { ko: '지드래곤', en: 'G-DRAGON', ja: 'G-DRAGON', zh: 'G-DRAGON' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '东京' }, country: 'JP', venueName: { ko: '도쿄 돔', en: 'Tokyo Dome' }, coordinates: { lat: 35.7056, lng: 139.7519 }, eventDate: '2026-04-12T18:00:00Z', status: 'ticketOpen', isHighlight: true },
  { eventId: 'gd-la-2026', artistId: 'bigbang-gd', artistName: { ko: '지드래곤', en: 'G-DRAGON', ja: 'G-DRAGON', zh: 'G-DRAGON' }, city: { ko: '로스앤젤레스', en: 'Los Angeles', ja: 'ロサンゼルス', zh: '洛杉矶' }, country: 'US', venueName: { ko: '크립토닷컴 아레나', en: 'Crypto.com Arena' }, coordinates: { lat: 34.043, lng: -118.2673 }, eventDate: '2026-05-02T20:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'gd-paris-2026', artistId: 'bigbang-gd', artistName: { ko: '지드래곤', en: 'G-DRAGON', ja: 'G-DRAGON', zh: 'G-DRAGON' }, city: { ko: '파리', en: 'Paris', ja: 'パリ', zh: '巴黎' }, country: 'FR', venueName: { ko: '아코르 아레나', en: 'Accor Arena' }, coordinates: { lat: 48.8388, lng: 2.3786 }, eventDate: '2026-05-20T20:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'gd-bkk-2026', artistId: 'bigbang-gd', artistName: { ko: '지드래곤', en: 'G-DRAGON', ja: 'G-DRAGON', zh: 'G-DRAGON' }, city: { ko: '방콕', en: 'Bangkok', ja: 'バンコク', zh: '曼谷' }, country: 'TH', venueName: { ko: '임팩트 아레나', en: 'Impact Arena' }, coordinates: { lat: 13.9113, lng: 100.5484 }, eventDate: '2026-06-10T19:00:00Z', status: 'scheduled', isHighlight: false },

  // 2. BTS 2026 Complete World Tour
  { eventId: 'bts-seoul-2026', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: '防弾少年団', zh: '防弹少年团' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首尔' }, country: 'KR', venueName: { ko: '잠실종합운동장 주경기장', en: 'Olympic Stadium' }, coordinates: { lat: 37.5158, lng: 127.0728 }, eventDate: '2026-06-13T18:00:00Z', status: 'ticketOpen', isHighlight: true },
  { eventId: 'bts-ny-2026', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: '防弾少年団', zh: '防弹少年团' }, city: { ko: '뉴욕', en: 'New York', ja: 'ニューヨーク', zh: '纽约' }, country: 'US', venueName: { ko: '메트라이프 스타디움', en: 'MetLife Stadium' }, coordinates: { lat: 40.8128, lng: -74.0742 }, eventDate: '2026-07-04T19:30:00Z', status: 'scheduled', isHighlight: true },
  { eventId: 'bts-london-2026', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: '防弾少年団', zh: '防弹少年团' }, city: { ko: '런던', en: 'London', ja: 'ロンドン', zh: '伦敦' }, country: 'GB', venueName: { ko: '웸블리 스타디움', en: 'Wembley Stadium' }, coordinates: { lat: 51.556, lng: -0.2795 }, eventDate: '2026-07-18T19:00:00Z', status: 'scheduled', isHighlight: true },
  { eventId: 'bts-osaka-2026', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: '防弾少年団', zh: '防弹少年团' }, city: { ko: '오사카', en: 'Osaka', ja: '大阪', zh: '大阪' }, country: 'JP', venueName: { ko: '얀마 스타디움 나가이', en: 'Yanmar Stadium Nagai' }, coordinates: { lat: 34.6133, lng: 135.5186 }, eventDate: '2026-08-08T17:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'bts-sao-2026', artistId: 'bts', artistName: { ko: '방탄소년단', en: 'BTS', ja: '防弾少年団', zh: '防弹少年团' }, city: { ko: '상파울루', en: 'Sao Paulo', ja: 'サンパウロ', zh: '圣保罗' }, country: 'BR', venueName: { ko: '알리안츠 파르키', en: 'Allianz Parque' }, coordinates: { lat: -23.5275, lng: -46.6783 }, eventDate: '2026-09-12T19:00:00Z', status: 'scheduled', isHighlight: false },

  // 3. BLACKPINK 2026 World Tour
  { eventId: 'bp-seoul-2026', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'ブラックピンク', zh: 'BLACKPINK' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首尔' }, country: 'KR', venueName: { ko: 'KSPO DOME', en: 'KSPO DOME' }, coordinates: { lat: 37.5194, lng: 127.1274 }, eventDate: '2026-08-15T18:00:00Z', status: 'ticketOpen', isHighlight: true },
  { eventId: 'bp-tokyo-2026', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'ブラックピンク', zh: 'BLACKPINK' }, city: { ko: '도쿄', en: 'Tokyo', ja: '東京', zh: '东京' }, country: 'JP', venueName: { ko: '도쿄 돔', en: 'Tokyo Dome' }, coordinates: { lat: 35.7056, lng: 139.7519 }, eventDate: '2026-09-05T17:00:00Z', status: 'scheduled', isHighlight: true },
  { eventId: 'bp-la-2026', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'ブラックピンク', zh: 'BLACKPINK' }, city: { ko: '로스앤젤레스', en: 'Los Angeles', ja: 'ロサンゼルス', zh: '洛杉矶' }, country: 'US', venueName: { ko: '다저 스타디움', en: 'Dodger Stadium' }, coordinates: { lat: 34.0739, lng: -118.24 }, eventDate: '2026-09-26T19:30:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'bp-paris-2026', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'ブラックピンク', zh: 'BLACKPINK' }, city: { ko: '파리', en: 'Paris', ja: 'パリ', zh: '巴黎' }, country: 'FR', venueName: { ko: '스타드 드 프랑스', en: 'Stade de France' }, coordinates: { lat: 48.9244, lng: 2.3601 }, eventDate: '2026-10-17T20:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'bp-sg-2026', artistId: 'blackpink', artistName: { ko: '블랙핑크', en: 'BLACKPINK', ja: 'ブラックピンク', zh: 'BLACKPINK' }, city: { ko: '싱가포르', en: 'Singapore', ja: 'シンガポール', zh: '新加坡' }, country: 'SG', venueName: { ko: '국립경기장', en: 'National Stadium' }, coordinates: { lat: 1.3044, lng: 103.8742 }, eventDate: '2026-11-07T19:00:00Z', status: 'scheduled', isHighlight: false },

  // 4. SEVENTEEN 2026 World Tour
  { eventId: 'svt-incheon-2026', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'セブンティーン', zh: 'SEVENTEEN' }, city: { ko: '인천', en: 'Incheon', ja: '仁川', zh: '仁川' }, country: 'KR', venueName: { ko: '인천아시아드주경기장', en: 'Asiad Main Stadium' }, coordinates: { lat: 37.5303, lng: 126.6669 }, eventDate: '2026-04-04T18:00:00Z', status: 'ticketOpen', isHighlight: true },
  { eventId: 'svt-osaka-2026', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'セブンティーン', zh: 'SEVENTEEN' }, city: { ko: '오사카', en: 'Osaka', ja: '大阪', zh: '大阪' }, country: 'JP', venueName: { ko: '교세라 돔 오사카', en: 'Kyocera Dome' }, coordinates: { lat: 34.6692, lng: 135.4761 }, eventDate: '2026-05-16T17:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'svt-chicago-2026', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'セブンティーン', zh: 'SEVENTEEN' }, city: { ko: '시카고', en: 'Chicago', ja: 'シカゴ', zh: '芝加哥' }, country: 'US', venueName: { ko: '올스테이트 아레나', en: 'Allstate Arena' }, coordinates: { lat: 42.0052, lng: -87.8871 }, eventDate: '2026-06-06T19:30:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'svt-jakarta-2026', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'セブンティーン', zh: 'SEVENTEEN' }, city: { ko: '자카르타', en: 'Jakarta', ja: 'ジャカルタ', zh: '雅加达' }, country: 'ID', venueName: { ko: '자카르타 인터내셔널 스타디움', en: 'JIS' }, coordinates: { lat: -6.1256, lng: 106.8584 }, eventDate: '2026-07-11T18:30:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'svt-berlin-2026', artistId: 'seventeen', artistName: { ko: '세븐틴', en: 'SEVENTEEN', ja: 'セブンティーン', zh: 'SEVENTEEN' }, city: { ko: '베를린', en: 'Berlin', ja: 'ベルリン', zh: '柏林' }, country: 'DE', venueName: { ko: '메르세데스-벤츠 아레나', en: 'Uber Arena' }, coordinates: { lat: 52.5061, lng: 13.4437 }, eventDate: '2026-08-01T20:00:00Z', status: 'scheduled', isHighlight: false },

  // 5. Stray Kids 2026 World Tour (dominATE)
  { eventId: 'skz-seoul-2026', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首尔' }, country: 'KR', venueName: { ko: 'KSPO DOME', en: 'KSPO DOME' }, coordinates: { lat: 37.5194, lng: 127.1274 }, eventDate: '2026-03-21T18:00:00Z', status: 'ticketOpen', isHighlight: true },
  { eventId: 'skz-sydney-2026', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '시드니', en: 'Sydney', ja: 'シドニー', zh: '悉尼' }, country: 'AU', venueName: { ko: '알리안츠 스타디움', en: 'Allianz Stadium' }, coordinates: { lat: -33.8893, lng: 151.2253 }, eventDate: '2026-04-18T19:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'skz-fukuoka-2026', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '후쿠오카', en: 'Fukuoka', ja: '福岡', zh: '福冈' }, country: 'JP', venueName: { ko: '페이페이 돔', en: 'PayPay Dome' }, coordinates: { lat: 33.5954, lng: 130.3622 }, eventDate: '2026-05-09T17:00:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'skz-atlanta-2026', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '애틀랜타', en: 'Atlanta', ja: 'アトランタ', zh: '亚特兰大' }, country: 'US', venueName: { ko: '메르세데스-벤츠 스타디움', en: 'Mercedes-Benz Stadium' }, coordinates: { lat: 33.7554, lng: -84.4008 }, eventDate: '2026-06-20T19:30:00Z', status: 'scheduled', isHighlight: false },
  { eventId: 'skz-madrid-2026', artistId: 'stray-kids', artistName: { ko: '스트레이 키즈', en: 'Stray Kids', ja: 'Stray Kids', zh: 'Stray Kids' }, city: { ko: '마드리드', en: 'Madrid', ja: 'マドリード', zh: '马德里' }, country: 'ES', venueName: { ko: '시비타스 메트로폴리타노', en: 'Riyadh Air Metropolitano' }, coordinates: { lat: 40.4362, lng: -3.5995 }, eventDate: '2026-07-25T20:30:00Z', status: 'scheduled', isHighlight: false }
];

async function seed() {
  console.log(`🚀 [Firestore Seeding] 프로덕션 DB에 5대 아티스트 총 ${allEvents.length}개 도시 투어 일정 적재 시작...`);
  for (const ev of allEvents) {
    await setDoc(doc(db, 'events', ev.eventId), ev, { merge: true });
    console.log(`  ✓ 적재 완료: [${ev.artistId}] ${ev.eventId} (${ev.city.ko})`);
  }
  console.log(`\n🎉 [성공] 프로덕션 Firestore 실데이터 25건 적재 완료!`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ 시딩 실패:', err);
  process.exit(1);
});