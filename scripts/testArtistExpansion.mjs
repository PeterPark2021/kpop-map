import { allArtistsCatalog, seventeenTourEvents, strayKidsTourEvents } from '../src/data/artistsCatalog.ts';
import { entityAliasesDictionary } from '../src/data/entityAliases.ts';

console.log('🧪 [Test Suite] 세븐틴 & 스트레이키즈 아티스트 데이터 확장 검증...\n');

let passed = 0;
let total = 0;

function assert(condition, name) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${name}`);
  }
}

// 1. 카탈로그 검증
assert(allArtistsCatalog.some(a => a.artistId === 'seventeen'), '세븐틴(SEVENTEEN) 카탈로그 등록 확인');
assert(allArtistsCatalog.some(a => a.artistId === 'stray-kids'), '스트레이 키즈(Stray Kids) 카탈로그 등록 확인');

// 2. 스타디움 투어 데이터 검증
assert(seventeenTourEvents.length >= 5, '세븐틴 5대 스타디움(인천/도쿄/오사카/LA/방콕) 등록 확인');
assert(strayKidsTourEvents.length >= 5, '스트레이키즈 5대 스타디움(서울/싱가포르/런던/시드니/가오슝) 등록 확인');

// 3. 다국어 별칭 사전 검증
const svtAlias = entityAliasesDictionary.find(e => e.artistId === 'seventeen');
assert(svtAlias && svtAlias.aliases.ko.includes('세봉이') && svtAlias.aliases.ja.includes('セブチ'), '세븐틴 한/일 별칭 매칭 사전 완성');

const skzAlias = entityAliasesDictionary.find(e => e.artistId === 'stray-kids');
assert(skzAlias && skzAlias.aliases.ko.includes('스키즈') && skzAlias.aliases.zh.includes('迷孩'), '스트레이키즈 한/중 별칭 매칭 사전 완성');

console.log(`\n🎉 아티스트 확장 테스트 완료: ${passed}/${total} 통과 (${Math.round((passed/total)*100)}%)`);
if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}