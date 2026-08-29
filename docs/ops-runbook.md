# K-POP Tour Pulse 프로덕션 운영 런북 (Operations Runbook)

## 1. 시스템 아키텍처 개요
- **프론트엔드**: React 18 + Vite + TypeScript + Leaflet 다크 테마 타일맵
- **호스팅 & CDN**: Google Firebase Hosting (`https://kpop-map-prod.web.app`)
- **실시간 데이터베이스**: Google Cloud Firestore (`events`, `newsFacts`, `approvedImages`)
- **AI 파이프라인**: Google Gemini 2.0 Flash + Cloud Functions (`ingestTourNews`)
- **자동화 크론**: GitHub Actions (`.github/workflows/auto-tour-sync.yml`)

---

## 2. 일상 운영 가이드 (Daily & Weekly SOP)

### 📅 일일 점검 (Daily - 약 3분 소요)
1. **Firestore 사용량 확인**: [Firebase Console ➔ Firestore ➔ 사용량]
   - 무료 일일 할당량(읽기 50,000건 / 쓰기 20,000건) 대비 사용률 80% 이하 유지 확인.
2. **Cloud Functions 에러 확인**: [GCP Console ➔ Cloud Logging]
   - `ingestTourNews` 함수 에러(Severity >= ERROR) 발생 여부 체크.

### 📅 주간 정기 점검 (Weekly - 매주 월요일)
1. **관리자 콘솔 감사 로그 분석 (Audit Review)**:
   - 8-gram 표절 거부율이 **5% ~ 15% (정상 범위)** 내에 있는지 확인.
   - **거부율 > 25% (너무 엄격)**: 정당한 팩트가 차단되고 있으므로 Gemini 프롬프트 완화.
   - **거부율 < 2% (너무 느슨)**: 표절 위험 문장이 통과될 수 있으므로 n-gram 임계치 강화.
2. **검수 큐 잔여 항목 처리**:
   - `pending` 상태의 뉴스를 검토하여 `승인(Approve)` 또는 `반려(Reject)` 처리.

---

## 3. 긴급 장애 대응 절차 (Incident Response)

### 🚨 장애 시나리오 1: 뉴스 크롤링 실패 / 기사 파싱 에러
- **원인**: 언론사/예매처 웹사이트의 HTML 구조 변경 또는 RSS 주소 변경.
- **조치 절차**:
  1. `functions/src/services/copyrightFilter.ts`의 `OFFICIAL_WHITELIST_DOMAINS`에 변경된 신규 도메인/URL 추가.
  2. Cloud Functions 재배포: `npx firebase-tools deploy --only functions`

### 🚨 장애 시나리오 2: 관리자 콘솔 PIN 유출 의심
- **원인**: 관리자 인증 PIN 코드(`2026`)가 외부에 노출된 경우.
- **조치 절차**:
  1. `src/components/AdminDashboard.tsx`에서 `pinInput === '2026'` 코드를 새로운 비밀번호로 변경.
  2. `sessionStorage.clear()` 처리 후 재배포: `npm run deploy`

### 🚨 장애 시나리오 3: 즉각적인 이전 버전 롤백 (Emergency Rollback)
- **조치 절차**:
  1. [Firebase Console ➔ 호스팅 ➔ 출시 내역]으로 이동.
  2. 정상 작동하던 직전 배포 버전의 점 3개 메뉴(`⋮`) 클릭 ➔ **"롤백"** 클릭 (3초 내 즉시 복구).

---

## 4. 신규 아티스트 온보딩 절차 (Artist Onboarding)

신규 Tier-1 그룹(예: NewJeans, SEVENTEEN 등) 추가 시:

1. **아티스트 프로필 & 투어 데이터 등록**:
   - `src/data/artistsCatalog.ts`에 `ArtistProfile` 및 `TourEvent[]` 데이터 추가.
2. **별칭 사전 등록**:
   - `src/data/entityAliases.ts`에 한/영/일/중 별칭 키워드 추가.
3. **다국어 검증 스크립트 실행**:
   - `node scripts/auditMultilingual.mjs`로 5개 언어 누락 여부 검증.
4. **배포**:
   - `git checkout -b ops/artist-{name}` ➔ PR 생성 ➔ `dev` 머지 ➔ `main` 배포.

---

## 5. 관리자 계정 및 접근 권한
- **관리자 콘솔 접속 URL**: `https://kpop-map-prod.web.app` 접속 ➔ 상단 `⚙️ 관리자 콘솔` 클릭
- **기본 마스터 PIN**: `2026`
- **보안 세션**: 브라우저 탭 종료 시 자동 세션 만료 (SessionStorage 기반).
## 6. Google Cloud TTS 오디오 사전 생성 비용 모니터링
- **방식**: 런타임 실시간 호출이 아닌 **사전 1회 생성(Pre-generation) 방식**으로 Cloud Storage/Public 에셋에 저장.
- **예상 비용**: 50개 어휘 × 약 10글자 = 500자 (Google Cloud TTS 매월 100만 자 무료 할당량 내 $0.00 유지).
- **운영 규칙**: 신규 languageContent 어휘 대량 추가 시에만 `node scripts/generateAudio.mjs`를 실행하여 1회 일괄 합성.