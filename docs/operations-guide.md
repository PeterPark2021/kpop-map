# K-Pop Tour Pulse 상시 서비스 운영 및 품질 관리 매뉴얼 (SOP)

## 1. Cloud Functions 실시간 에러 모니터링 및 알림 설정
뉴스 크롤링 파이프라인은 원본 언론사/공지 사이트의 HTML 구조나 RSS 피드 변경 시 깨질 수 있습니다.

### 🔔 GCP Cloud Monitoring 알림 채널 설정 (이메일/슬랙)
1. **[GCP Console](https://console.cloud.google.com/) ➔ Error Reporting** 이동.
2. 프로젝트 `kpop-map-prod` 선택 후 알림 수신 이메일/슬랙 채널 등록.
3. `ingestTourNews` 함수의 에러 발생 시 즉시 개발팀 알림 발송 설정:
   - 필터 조건: `resource.type="cloud_function" severity>=ERROR`
   - 임계치: 5분 내 3회 이상 실패 시 P1 긴급 알림.

---

## 2. `pipeline_audit_log` 주간 정기 점검 루틴 (Weekly Audit)
매주 월요일 관리자 콘솔의 감사 로그를 확인하여 AI 필터의 품질을 미세 조정합니다.

| 점검 지표 | 정상 범위 | 이상 발생 시 조치 |
| :--- | :---: | :--- |
| **8-gram 표절 거부율** | **5% ~ 15%** | **비정상적 고거부율 (>25%)**: 필터가 지나치게 엄격하여 유효 팩트까지 차단 중 ➔ Gemini 프롬프트 조정.<br>**비정상적 저거부율 (<2%)**: 원문 문장이 그대로 통과될 위험 ➔ n-gram 임계치 강화(8단어 ➔ 6단어로 강화). |
| **화이트리스트 차단율** | **< 10%** | 미등록된 신규 공식 티켓팅 플랫폼이 차단되었는지 확인 후 `copyrightFilter.ts` 화이트리스트에 도메인 추가. |
| **재시도(RETRY) 성공률** | **> 90%** | 재시도 실패가 잦은 경우 Gemini 재작성 프롬프트 템플릿 개선. |

---

## 3. Jules 상시 운영(Ops) 브랜치 규칙
서비스 런칭 이후에는 "개발 단계"가 아닌 "운영/유지보수 단계"로 전환됩니다.

- **브랜치 네이밍 규칙**:
  - 신규 아티스트 추가: `ops/artist-{artistId}` (예: `ops/artist-bts`, `ops/artist-blackpink`)
  - 크롤러/파이프라인 긴급 수정: `hotfix/scraper-{sourceName}`
  - 정기 팩트 동기화/검증: `chore/weekly-audit-{YYYYMMDD}`
- **머지 주기**: 모든 Jules의 운영 PR은 `dev`에서 테스트 통과 후 주 1회 정기 배포로 `main`에 반영.