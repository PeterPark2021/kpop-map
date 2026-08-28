# 아키텍처 결정 로그 (ADR)

프로젝트 진행 중 초기 계획(`docs/*.md`)에서 벗어난 결정들을 기록한다.
새 세션(Antigravity/Jules)이 옛 문서만 보고 되돌리는 실수를 막기 위함.

---

## ADR-001: 실시간 동기화 — WebSocket → Firestore 네이티브

- **날짜**: 3단계 진입 시점
- **배경**: AI Studio 프로토타입은 Express + 커스텀 WebSocket 서버로 구현됨
- **결정**: 프로덕션(`feature/firestore-integration`)에서는 `onSnapshot()`
  클라이언트 직접 구독 방식으로 전면 교체. `server.ts`,
  `useTourWebSocket.ts`는 `prototype/ai-studio-v1/`에만 보존
- **이유**: 상시 서버 운영 비용/복잡도 제거, Firestore가 연결 관리 대행
- **영향 파일**: `docs/workflow-plan.md` 3단계 설명

## ADR-002: 지도 라이브러리 — MapLibre GL → Leaflet

- **배경**: 초기 전략 문서는 MapLibre GL 기준으로 작성됨
- **결정**: 실제 구현은 **Leaflet + CartoDB Dark Matter 타일**로 진행됨
- **이유**: (기록 필요 — Antigravity가 이렇게 선택한 배경을 확인 후 채워둘 것.
  예: 커스텀 마커 애니메이션/펄스 효과 구현이 더 쉬웠는지 등)
- **영향**: 기능적으로 문제 없음. `docs/workflow-plan.md`의 "기술 스택"
  항목을 Leaflet으로 정정
- **후속 조치**: PostGIS 이관 시 지도 라이브러리는 그대로 유지 가능
  (백엔드 교체와 프론트 지도 라이브러리는 독립적)

## ADR-003: 뉴스 요약 모델 — Gemini 3 (범용) → Gemini 2.0 Flash (확정)

- **결정**: `ingestTourNews` Cloud Function은 Gemini 2.0 Flash로 구현됨
- **이유**: (기록 필요 — 속도/비용 이유로 Flash 모델을 선택했는지 확인)
- **영향 파일**: `docs/news-pipeline-spec.md`의 AI 모델 언급 부분,
  `news_translations.translation_engine`에 기록되는 실제 값과 일치 확인 필요

## ADR-004: 필드 네이밍 컨벤션

- **결정**: Firestore 구현체는 `camelCase` (`artistId`, `tourId`, `eventDate`),
  `docs/data-schema.md`의 SQL DDL은 `snake_case`로 유지 (PostGIS 이관
  시 참조용 원본이므로 변경하지 않음)
- **규칙**: 신규 필드 추가 시 Firestore 코드는 camelCase, 스키마 문서
  갱신 시 snake_case로 병기

---

## 업데이트 규칙

새로운 아키텍처 결정이 생기면 이 파일에 ADR 번호를 이어서 추가한다.
`docs/` 내 다른 문서를 고칠 필요는 없고(과거 결정 과정 기록이 사라지는 게
더 손해), 이 로그가 "최신 진실"로 우선한다.
