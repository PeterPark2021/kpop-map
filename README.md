# K-pop Map (kpop-map)

전 세계 K-pop 콘서트/투어 일정을 지도 위에 표출하고, 관련 아티스트 뉴스를
다국어로 제공하는 서비스. 메인 앵커 아티스트: G-DRAGON / BIGBANG.

## 프로젝트 상태

🚧 초기 개발 단계 — 자세한 실행 계획은 [`docs/workflow-plan.md`](docs/workflow-plan.md) 참고

## 폴더 구조

```
.
├── docs/           전략 문서 (데이터 스키마, 뉴스 파이프라인 스펙, 워크플로우 계획)
├── design/         Stitch 디자인 export 결과물 (참고용, 프로덕션 코드 아님)
├── prototype/       AI Studio 프로토타입 export 결과물 (검증용)
├── app/
│   ├── frontend/    실제 서비스 프론트엔드
│   ├── functions/   Firebase Cloud Functions (뉴스 파이프라인, 트리거 등)
│   └── firestore.rules
└── README.md
```

## 핵심 원칙

- **GitHub이 유일한 진실 공급원.** Stitch/AI Studio 산출물은 `design/`,
  `prototype/`에만 두고 `app/`과 분리한다.
- 기능 단위로 브랜치를 분리한다 (`feature/data-layer`,
  `feature/map-frontend`, `feature/news-pipeline` 등).
- 뉴스 콘텐츠는 원문을 저장하지 않고 AI 재구성 요약만 저장한다
  (`docs/news-pipeline-spec.md` 참고).

## 기술 스택

- Frontend: MapLibre GL
- Backend: Firebase / Firestore (MVP), PostGIS 이관 검토 중
- AI: Gemini 3 (요약/번역), Claude (필요 시 보조)
- 개발 도구: Stitch, Google AI Studio, Antigravity, Jules

## 브랜치 전략

- `main`: 항상 배포 가능한 상태
- `dev`: 통합 브랜치
- `feature/*`: 기능 단위 작업 브랜치
- `jules/*`: Jules가 생성하는 백그라운드 유지보수 브랜치

## 문서

- [데이터 스키마](docs/data-schema.md)
- [뉴스 파이프라인 스펙](docs/news-pipeline-spec.md)
- [도구별 워크플로우 계획](docs/workflow-plan.md)

## 라이선스 / 저작권 원칙

- 뉴스 원문 재게시 금지, AI 재구성 요약 + 출처 링크만 사용
- 이미지는 공식 배포 이미지만 사용 (`approvedImages` 컬렉션 통해 수동 승인)
- 자세한 내용은 `docs/news-pipeline-spec.md`의 Stage 3, 5 참고
