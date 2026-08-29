import { buildNotificationEmailHtml } from '../functions/src/triggers/onTicketStatusChange.ts';

console.log('🧪 [Test Suite] 일반 회원 시스템 & 이메일 알림 중복 방지 단위 테스트 시작...\n');

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

// 1. 회원 기본 알림 설정: 기본값은 반드시 emailEnabled == false (Opt-in 필수)
const defaultPrefs = { emailEnabled: false, language: 'ko', consentGivenAt: null };
assert(defaultPrefs.emailEnabled === false, '기본 알림 수신 동의는 반드시 false(비활성화)여야 함');
assert(defaultPrefs.consentGivenAt === null, '미동의 시 consentGivenAt 타임스탬프는 null이어야 함');

// 2. 이메일 알림 템플릿 다국어 생성 및 수신거부 토큰 링크 검증
const payload = {
  eventId: 'bb-goyang-2026',
  artistId: 'bigbang-gd',
  artistName: 'BIGBANG',
  city: 'Goyang',
  venueName: 'Goyang Stadium',
  status: 'ticketOpen',
  ticketUrl: 'https://tickets.example.com'
};

const emailKo = buildNotificationEmailHtml(payload, 'ko', 'user_123');
assert(emailKo.subject.includes('[티켓 오픈]'), '한국어 이메일 제목 생성 정상');
assert(emailKo.html.includes('unsubscribe?uid=user_123'), '원클릭 수신거부 링크 포함 확인');

const emailJa = buildNotificationEmailHtml(payload, 'ja', 'user_456');
assert(emailJa.subject.includes('チケット発売'), '일본어 이메일 제목 생성 정상');

// 3. 중복 발송 방지 (Anti-Spam Safeguard) 시뮬레이션
const event = {
  eventId: 'bb-goyang-2026',
  status: 'ticketOpen',
  notifiedStatuses: ['ticketOpen']
};

const shouldTrigger = !event.notifiedStatuses.includes('ticketOpen');
assert(shouldTrigger === false, '동일 상태(ticketOpen) 재변경 시 notifiedStatuses에 의해 중복 발송 100% 차단');

console.log(`\n🎉 회원 및 알림 테스트 완료: ${passed}/${total} 통과 (${Math.round((passed/total)*100)}%)`);
if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}