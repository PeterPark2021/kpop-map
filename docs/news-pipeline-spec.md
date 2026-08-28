# K-Pop 뉴스 파이프라인 확장 스펙 (v2.0)

## 1. 화이트리스트 소스 목록 및 분류 (official vs press)

| 소스 ID | 소스명 | 타입 | 수집 방식 | 상태 |
| :--- | :--- | :---: | :---: | :---: |
| `yna` | 연합뉴스 | `press` | RSS 2.0 | `active` |
| `news1` | 뉴스1 | `press` | RSS 2.0 | `active` |
| `newsis` | 뉴시스 | `press` | RSS 2.0 | `active` |
| `sbs-ent` | SBS연예뉴스 | `press` | RSS 2.0 | `active` |
| `star-news` | 스타뉴스 | `press` | RSS 2.0 | `active` |
| `tenasia` | 텐아시아 | `press` | RSS 2.0 | `active` |
| `isplus` | 일간스포츠 | `press` | Scraper | `deferred_scraper` |
| `galaxy-corp` | 갤럭시코퍼레이션 공식 | `official` | RSS / Notice | `active` |
| `yg-family` | YG Entertainment 공식 | `official` | Scraper | `active` |
| `bighit-music` | 빅히트 뮤직 공식 | `official` | Scraper | `active` |
| `pledis-ent` | PLEDIS 공식 발표 (세븐틴) | `official` | Scraper | `deferred_scraper` |
| `jyp-ent` | JYP 공식 발표 (스트레이키즈) | `official` | Scraper | `deferred_scraper` |

## 2. 8-gram 표절 탐지 및 중복 방지 규칙
1. **8-gram 일치율 0% 원칙**: 기사 원문과 8연속 단어가 일치할 경우 즉시 차단(BLOCKED_NGRAM) 및 재시도(RETRY).
2. **소속사 우선권 (Official Priority)**: 동일한 소식이 여러 언론사에서 수집될 경우 `sourceType: 'official'`을 최상위에 노출하고 중복 카드는 병합.