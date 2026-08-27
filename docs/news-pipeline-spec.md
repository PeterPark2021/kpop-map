# 뉴스 수집 파이프라인 스펙 — 요약 · 번역 · 저작권 필터

## 목적

이 문서는 K-pop 아티스트 관련 뉴스를 수집·요약·번역해 `newsItems` 컬렉션에
저장하는 파이프라인의 설계 스펙이다. 저작권 침해 리스크가 가장 큰 구간이므로,
**AI의 판단에 맡기지 않고 구조적으로 강제되는 검증 게이트**를 각 단계에 둔다.

관련 문서: [`data-schema.md`](./data-schema.md)의 `news_items`,
`entity_news_map`, `news_translations` 테이블 설계 참고.

---

## 설계 원칙

1. **원문은 절대 저장하지 않는다.** 요약 생성을 위한 원문 발췌(최대 500자)는
   처리 중 메모리에서만 존재하며, DB에도 API 응답에도 노출되지 않는다.
2. **저작권 검증은 문자열 비교 함수로 기계적으로 수행한다.** LLM에게
   "표절하지 마"라고 지시하는 것만으로는 일관성이 없다.
3. **민감한 이슈는 자동 확산을 차단한다.** 논란성 키워드가 포함된 기사는
   사람 검토 전까지 한국어 외 언어로 번역되지 않는다.
4. **이미지는 완전 수동 화이트리스트 방식이다.** 파이프라인이 기사에서
   이미지를 자동으로 가져오는 로직은 아예 만들지 않는다.
5. **모든 단계의 실패/거부는 감사 로그에 남긴다.** 필터가 너무 엄격한지
   느슨한지 나중에 데이터로 조정하기 위함이다.

---

## 파이프라인 단계

### Stage 1 — 수집 (Ingestion)
- 화이트리스트에 등록된 소스만 수집 (RSS 우선, 공식 소속사 발표 페이지 포함)
- 추출 항목: 헤드라인, 발행일, 출처명, 출처 URL, 내부 처리용 원문 발췌
  (최대 500자, DB 저장 및 API 노출 금지)
- 중복 제거: (정규화된 헤드라인 + 출처 도메인 + 날짜) 해시 기준

### Stage 2 — 아티스트 매칭 (Entity Matching)
- `entities` 컬렉션과 별칭 테이블(`entity_aliases`)로 이름 매칭
  (예: "지디" / "GD" / "권지용" / "G-DRAGON")
- 매칭된 아티스트가 없으면 해당 아이템은 폐기
- `relevance`: 명확한 주제면 `primary`, 언급 수준이면 `mentioned`

### Stage 3 — AI 요약 (저작권 핵심 단계)
- 원문 발췌는 "인용/추출 대상"이 아니라 "사실관계 참고용 컨텍스트"로만 제공
- 출력: 한국어 2~3문장, 사실 정보(누가/무엇을/언제/어디서) 중심
- **검증 게이트**: 생성된 요약과 원문 발췌 사이에 8단어 이상 연속 일치하는
  구간이 있는지 n-gram 슬라이딩 윈도우로 검사
  - 실패 시 1회 재시도 ("문장 구조를 따라가지 말고 재구성하라" 강화 지시)
  - 2회 실패 시 게시하지 않고 수동 검토(`review_status: 'pending'`)로 전환
- 논란 키워드(논란, 결별, 소송, 사고, 사망 등, 설정 파일로 관리) 포함 시
  `sentiment: 'sensitive'` 자동 태깅 → 한국어 외 번역 보류, 수동 승인 필요
- `category` 자동 분류: comeback / tour / award / controversy / collab /
  chart / other

### Stage 4 — 번역 (Localization)
- 승인된(민감하지 않은) 한국어 요약만 대상
- 대상 언어: en, ja, zh-TW, th, vi, id, ms
  (앞서 정리한 투어 도시 언어 우선순위 기준)
- 언어별 현지화 톤 적용 (`entity_translations.localization_tone` 참조,
  예: 일본어는 敬語, 영어는 캐주얼체)
- `translation_engine`(모델명+버전) 메타데이터 필수 기록
- 원문 대비 검증은 불필요(우리 요약의 파생물이므로)하되, 번역 모델이
  원 기사 문장을 학습 데이터로 알고 있어 그대로 재현할 가능성에 대비해
  이례적으로 긴 정확 일치 구간이 나오면 검토 플래그

### Stage 5 — 이미지 처리
- 파이프라인은 이미지를 자동으로 첨부하지 않는다 (`imageUrl: null` 기본값)
- `approvedImages` 컬렉션(소속사명, 이미지 URL, 사용 근거, 승인자, 승인일)에
  등록된 이미지만 수동으로 연결 가능
- Firestore 보안 규칙으로 `approvedImages`에 없는 URL 쓰기를 거부

### Stage 6 — 게시
- `newsItems`에 기록: headline_ko, summary_ko, category, source_name,
  source_url, published_at, sentiment, review_status, relatedEntities,
  translations
- 민감 태그가 아닌 정상 카테고리는 자동 `review_status: 'approved'`
- 공개 API는 `approved` 상태만 노출 (애플리케이션 로직이 아니라 보안 규칙
  단에서 강제)

---

## 모니터링

- `pipeline_audit_log` 컬렉션: 모든 거부/재시도 기록 + 사유
- 내부 관리자 대시보드: `review_status = pending` 항목 원클릭 승인/반려

---

## 착수 전 준비물 체크리스트

- [ ] 초기 소스 화이트리스트 확정 (RSS 지원 여부 확인된 언론사 3~5곳)
- [ ] 논란 키워드 리스트 초안 (한국어 기준)
- [ ] 언어별 현지화 톤 가이드 (`entity_translations.localization_tone`에
      들어갈 값)

---

## Antigravity 실행 프롬프트

전체 프롬프트 원문: [`prompts/news-pipeline-prompt.md`](./prompts/news-pipeline-prompt.md)

요약하면 다음 산출물을 요청:

1. Cloud Functions로 구현된 전체 파이프라인 (Pub/Sub 또는 Firestore
   트리거로 단계 연결)
2. n-gram 검증 유틸 함수 (단위 테스트 포함)
3. 소스 화이트리스트 config 파일
4. 내부 검토용 관리자 대시보드
5. `pipeline_audit_log` 뷰어

RSS가 없는 매체의 커스텀 스크래퍼는 1차 범위에서 제외 ("deferred"로 표시).
