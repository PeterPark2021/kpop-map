# K-pop 콘서트 지도 서비스 — 도구별 실행 계획

## 핵심 원칙

> **GitHub 저장소가 유일한 진실 공급원(Single Source of Truth)이다.**
> Stitch, AI Studio, Antigravity, Jules — 모든 도구는 결과물을 GitHub로 
> "수렴"시켜야 하며, 각 도구 안에서만 존재하는 상태(로컬 세션, 미동기화 
> 변경사항)를 만들지 않는다. 코드가 꼬이는 대부분의 원인은 "여러 도구가 
> 동시에 서로 모르는 상태로 같은 파일을 건드리는 것"이므로, **한 시점에는 
> 하나의 도구만 코드를 쓰게 하고 나머지는 읽기/설계만 하도록 순서를 강제**한다.

---

## 0단계 — 로컬 PC & GitHub 초기 세팅 (가장 먼저, 1회성)

**우선순위: 최상 (다른 모든 작업의 전제조건)**

로컬 PC 폴더:
```
~/projects/kpop-map/
├── .git/
├── docs/                    ← 지금까지 만든 전략 문서들 보관
│   ├── data-schema.md
│   ├── news-pipeline-spec.md
│   └── workflow-plan.md     ← 이 문서
├── design/                  ← Stitch export 결과물 (아직 코드 아님)
│   └── stitch-exports/
├── prototype/                ← AI Studio export 결과물
├── app/                       ← Antigravity가 실제로 작업할 프로덕션 코드
│   ├── frontend/
│   ├── functions/            ← Firebase Cloud Functions
│   └── firestore.rules
└── README.md
```

체크리스트:
1. GitHub에 **private 저장소** 생성 (`kpop-map`)
2. 로컬에 `git clone`, 위 폴더 구조로 초기 커밋
3. **브랜치 전략 확정**: `main`(항상 배포 가능 상태) / `dev`(통합 브랜치) / 
   기능별 `feature/*` 브랜치
4. `docs/` 폴더에 지금까지 대화에서 나온 전략 문서(스키마, 파이프라인 스펙 등) 
   먼저 커밋 — **이게 나중에 Antigravity/Jules에게 컨텍스트로 넘길 기준 문서**가 됨
5. `.gitignore` 세팅 (node_modules, .env, Firebase 서비스 계정 키 등)

> 왜 가장 먼저인가: Stitch/AI Studio/Antigravity 모두 "GitHub에 저장"이 
> 가능하므로, 저장소가 없는 상태에서 여러 도구를 먼저 써버리면 각 도구 
> 세션에 흩어진 결과물을 나중에 손으로 합쳐야 하는 상황이 생긴다.

---

## 1단계 — Stitch (디자인, 코드 작성 금지 구간)

**우선순위: 상 · 소요: 1~2일 · 이 단계에서는 `app/` 폴더를 절대 건드리지 않음**

작업 순서:
1. GD 허브 페이지 프롬프트 실행 → 여러 시안 생성
2. 지도 하이라이트 핀 컴포넌트 프롬프트 실행
3. 모바일 버전 프롬프트 실행
4. 마음에 드는 결과물을 **HTML/CSS로 export**
5. export한 파일을 로컬 `design/stitch-exports/` 에 저장 → **커밋**
   ```
   git add design/stitch-exports/
   git commit -m "docs: Stitch 디자인 시안 - GD 허브 v1"
   git push origin dev
   ```

> 주의: Stitch export물은 "참고용 정적 HTML"이지 프로덕션 코드가 아니다. 
> `app/frontend/`가 아니라 `design/`에 넣어서, 나중에 Antigravity가 이걸 
> "베낄 대상"으로만 참조하게 하고 실수로 그대로 배포되지 않게 격리한다.

---

## 2단계 — AI Studio (프로토타입, 별도 브랜치에서 실험)

**우선순위: 상 · 소요: 2~3일 · `feature/prototype` 브랜치에서만 작업**

작업 순서:
1. AI Studio에 Stitch export물 업로드 (스크린샷/HTML)
2. 지도 인터랙션(MapLibre) + 더미 데이터로 동작 프로토타입 제작
3. Firebase 연동 초기 세팅 (인증, Firestore 프로젝트 생성)
4. **"Export to Antigravity" 또는 GitHub 저장** 기능으로 결과물을 
   `feature/prototype` 브랜치에 push
5. 로컬에서 `prototype/` 폴더로 pull해서 확인

체크리스트 (다음 단계로 넘어가기 전):
- [ ] 지도가 더미 데이터로라도 실제로 렌더링되는가
- [ ] Firebase 프로젝트/Firestore가 생성되고 연결 테스트 성공했는가
- [ ] 이 브랜치가 `dev`에 머지해도 될 만큼 정리됐는가 (아니면 실험 브랜치로 
      남겨두고 Antigravity 단계에서 새로 시작해도 무방)

> 이 단계 산출물은 "검증"이 목적이지 최종 코드가 아니어도 된다. 프로토타입 
> 품질이 낮으면 `prototype/`에만 남기고 `dev` 브랜치에는 머지하지 않는 
> 선택도 정상이다.

---

## 3단계 — Antigravity (본 개발, 여기서부터 `app/`이 진짜 코드가 됨)

**우선순위: 최상 · 소요: 1~2주 · 이 프로젝트의 메인 개발 단계**

### 3-1. 착수 전 준비
- `dev` 브랜치에서 새 `feature/data-layer` 브랜치 생성
- Antigravity 워크스페이스를 **이 GitHub 저장소에 직접 연결** (로컬 클론이 
  아니라 저장소 자체를 워크스페이스로 열기 — 세션 컨텍스트가 최신 커밋과 
  항상 일치하도록)
- `docs/` 폴더의 스키마 문서, 뉴스 파이프라인 스펙을 프롬프트에 함께 
  첨부하거나 참조 지시 ("docs/data-schema.md 기준으로 진행해줘")

### 3-2. 작업 순서 (기능 단위로 브랜치 분리)

| 순서 | 브랜치명 | 작업 | 앞서 만든 프롬프트 |
|---|---|---|---|
| 1 | `feature/data-layer` | Firestore 컬렉션 구조, 보안 규칙, 시드 데이터 | 프롬프트 A (Firestore) |
| 2 | `feature/map-frontend` | Stitch/AI Studio 산출물 기반 실제 지도 UI 구현 | GD 허브 디자인 |
| 3 | `feature/news-pipeline` | 뉴스 수집·요약·번역 파이프라인 | 뉴스 파이프라인 프롬프트 |
| 4 | `feature/admin-dashboard` | 검토용 내부 대시보드 | 뉴스 파이프라인 Stage 6 |

**각 기능마다 별도 브랜치 + 별도 PR을 강제하는 이유**: Antigravity는 
자율적으로 여러 파일을 동시에 고치는데, 데이터 레이어와 프론트엔드를 
같은 브랜치에서 동시에 진행시키면 한쪽이 실패했을 때 되돌리기가 
어려워진다. 기능별로 쪼개면 문제 생긴 브랜치만 버리고 다시 시작 가능.

### 3-3. 각 기능 완료 시 루틴
1. Antigravity가 브라우저에서 자체 검증 완료
2. 로컬에서 `git pull`, 직접 눈으로 diff 확인 (`git diff dev...feature/xxx`)
3. GitHub에 PR 생성 → 셀프 리뷰 → `dev`에 머지
4. **머지 후 반드시 새 브랜치로 다음 기능 시작** (이전 브랜치 재사용 금지)

---

## 4단계 — Jules (백그라운드 유지보수, Antigravity와 동시 진행 가능)

**우선순위: 중 · Antigravity의 메인 개발과 병렬로 돌리되, 별도 브랜치만**

Jules에게 맡기기 좋은 작업 (Antigravity가 큰 기능을 만드는 동안 병행):
- 번역 API 에러 핸들링 보강
- 테스트 코드 작성/커버리지 확충
- `entity_aliases` 데이터 추가 (신규 아티스트 별칭 등록)
- 사소한 버그 수정

운영 규칙:
1. Jules는 **항상 `dev`에서 분기한 자기 브랜치**를 쓰게 하고, Antigravity가 
   작업 중인 `feature/*` 브랜치는 절대 건드리지 않게 분리
2. Jules가 만든 PR은 **사람이 직접 리뷰 후 머지** (자동 머지 금지 — 
   백그라운드 작업일수록 방심하기 쉬움)
3. 같은 파일을 Antigravity와 Jules가 동시에 건드리는 상황이 예상되면 
   (예: 둘 다 `firestore.rules`를 고쳐야 하는 경우) Jules 작업을 
   Antigravity 브랜치 머지 이후로 순서를 미룬다

> Jules는 "24시간 돌아가는 인턴"이라고 생각하고, 절대 메인 아키텍처 결정을 
> 맡기지 않는다. 구조를 바꾸는 작업은 항상 Antigravity(또는 사람)가 먼저 
> 브랜치를 만들어둔 뒤에 그 위에서 Jules가 디테일을 다듬게 한다.

---

## 5단계 — 반복 주기 확립 (2단계 사이클 반복)

3단계와 4단계를 아래 순서로 반복하며 기능을 늘려간다:

```
[Antigravity: 새 feature 브랜치, 큰 기능 구현]
        ↓ PR 머지
[dev 브랜치 업데이트]
        ↓
[Jules: dev에서 분기, 디테일/버그/테스트 보강 (병렬 가능)]
        ↓ PR 머지
[dev 브랜치 업데이트]
        ↓
[필요시 Stitch/AI Studio로 돌아가 새 화면 디자인 → 1~2단계 반복]
```

---

## 전체 타임라인 요약

| 시점 | 도구 | 브랜치 | 산출물 |
|---|---|---|---|
| Day 0 | 로컬 + GitHub | `main`, `dev` 생성 | 저장소 구조, 전략 문서 커밋 |
| Day 1-2 | Stitch | (코드 아님, `design/`에만) | GD 허브 시안, 핀 컴포넌트 |
| Day 3-5 | AI Studio | `feature/prototype` | 동작하는 지도 프로토타입 |
| Day 6-8 | Antigravity | `feature/data-layer` | Firestore 스키마 + 시드 |
| Day 9-11 | Antigravity | `feature/map-frontend` | 실제 GD 허브 + 지도 UI |
| Day 12-14 | Antigravity | `feature/news-pipeline` | 뉴스 파이프라인 |
| Day 12-14 (병렬) | Jules | `jules/*` | 테스트, 에러 핸들링 (병렬 진행) |
| Day 15 | Antigravity | `feature/admin-dashboard` | 검토 대시보드 |
| Day 16 | 로컬 + GitHub | `main`으로 최종 머지 | 배포 준비 완료 |

---

## 버전 관리 사고를 막는 5가지 규칙

1. **한 브랜치, 한 도구, 한 목적**: 같은 브랜치를 Antigravity와 Jules가 
   동시에 건드리지 않는다.
2. **Stitch/AI Studio 산출물은 `design/`, `prototype/`에 격리**: 
   프로덕션 코드(`app/`)와 물리적으로 폴더를 분리해, 실험적 산출물이 
   실수로 배포 대상에 섞이지 않게 한다.
3. **모든 PR은 머지 전 diff를 사람이 눈으로 훑는다**: AI가 자율적으로 
   많은 파일을 고치므로, 특히 `firestore.rules`나 스키마 관련 파일은 
   반드시 직접 확인.
4. **문서(`docs/`)를 코드보다 먼저, 그리고 항상 최신으로 유지**: 
   Antigravity/Jules에게 매번 전체 맥락을 새로 설명하지 않도록, 
   스키마/파이프라인 스펙 문서를 프로젝트의 "기준점"으로 삼는다.
5. **작업 시작 전 항상 `git pull`, 끝나면 항상 `push`**: 여러 도구를 
   오가며 작업하다 로컬이 stale 상태가 되는 게 코드 꼬임의 가장 흔한 원인.
