# Antigravity 프롬프트 — 뉴스 수집·요약·번역·저작권 필터 파이프라인

> 사용 시점: [`workflow-plan.md`](../workflow-plan.md) 3단계,
> `feature/news-pipeline` 브랜치. `feature/data-layer`가 먼저 머지되어
> `entities`, `newsItems` 컬렉션 구조가 존재해야 함.
> 설계 근거 및 스펙 요약: [`news-pipeline-spec.md`](../news-pipeline-spec.md)

---

```
Build a news ingestion pipeline for the K-pop tour platform, targeting
the Firestore `newsItems` collection designed earlier. This pipeline
must enforce copyright-safe content generation as a structural constraint,
not just a prompt instruction — build validation checks that reject
non-compliant output before it's written to the database.

PIPELINE STAGES (implement as separate, testable functions/modules):

## STAGE 1 — INGESTION
- Poll a configurable list of source feeds every 30 minutes (Cloud
  Scheduler + Cloud Function):
  - RSS/news aggregator feeds for pre-approved outlets only (start with
    a whitelist config file, not open crawling)
  - Official agency press release pages (YG, 갤럭시코퍼레이션 등) —
    store as a separate `source_type: 'official'` vs `source_type: 'press'`
- For each item, extract ONLY: headline, publish date, source name,
  source URL, and a short raw excerpt (max 500 chars) for internal
  processing use only — this raw excerpt must NEVER be written to the
  database or exposed via any API. It exists only in memory during
  Stage 2 processing.
- Deduplicate: hash on (normalized headline + source domain + date) to
  avoid re-ingesting the same story from syndicated reprints.

## STAGE 2 — ENTITY MATCHING
- Match each ingested item against the `entities` collection using a
  name-matching function (stage names, legal names, group names, common
  aliases — build an `entity_aliases` lookup table/collection to handle
  variants like "지디" / "GD" / "권지용" / "G-DRAGON").
- Output: a list of matched entityIds with relevance ('primary' if the
  entity is the clear subject, 'mentioned' if referenced in passing).
- If zero entities match, discard the item (don't store irrelevant item).

## STAGE 3 — AI SUMMARIZATION (copyright-critical stage)
Call the summarization LLM with this exact system-level constraint set
— implement these as an enforced prompt template, not a suggestion:

  - The model must NEVER receive an instruction to "quote" or "extract
    verbatim text." Only feed it the headline + raw excerpt as CONTEXT,
    and instruct it to write a summary using its own words describing
    only the factual content (who, what, when, where — dates, cities,
    ticket status, chart positions, award names).
  - Output must be 2-3 sentences maximum, in Korean.
  - Reject any output where more than 8 consecutive words match the
    raw excerpt verbatim (implement this as a post-generation string
    comparison check — sliding window n-gram match against the raw
    excerpt, threshold at 8 words, NOT the model's own judgment). If
    the check fails, retry generation once with a stronger
    "paraphrase, do not mirror sentence structure" instruction; if it
    fails twice, flag the item for manual review instead of publishing.
  - Auto-tag `sentiment: 'sensitive'` if the summary or headline
    contains any of a configurable list of controversy-related keywords
    (논란, 결별, 소송, 사고, 사망 등) — these items get `review_status:
    'pending'` and are excluded from any language beyond Korean until
    a human approves them.
  - Auto-tag `category` (comeback/tour/award/controversy/collab/chart/
    other) using classification, not free text.

## STAGE 4 — TRANSLATION
- For each approved (non-sensitive) Korean summary, generate
  translations into the target languages: en, ja, zh-TW, th, vi, id, ms
- Use a translation prompt that explicitly asks for LOCALIZED tone per
  language (formal register for ja, casual for en, etc. — reference the
  localization_tone notes from entity_translations if present for that
  artist)
- Store translation_engine metadata (model name + version) alongside
  each translation for audit purposes
- Run the same 8-word verbatim-match check against source text is NOT
  needed here (translations are derivative of our own summary, not the
  original article) — but DO check that the translation doesn't
  reintroduce quoted material if a translator model has training data
  overlap with the original article. Flag for review if suspiciously
  long exact phrase matches appear against a web search of the headline.

## STAGE 5 — IMAGE HANDLING
- This pipeline does NOT auto-select images from articles. Every
  newsItems document gets `imageUrl: null` by default.
- Build a separate, manually-curated `approvedImages` collection
  (agency_name, image_url, usage_note, approved_by, approved_date) —
  images can only be attached to a news item by explicit reference to
  an approvedImages doc ID, never by pipeline automation. Add a
  validation rule (Firestore security rule or Cloud Function check)
  that rejects any write to newsItems.imageUrl that doesn't reference
  an existing approvedImages doc.

## STAGE 6 — WRITE & PUBLISH
- Write to `newsItems` with: headline_ko, summary_ko, category,
  source_name, source_url, published_at, sentiment, review_status,
  relatedEntities array, translations map
- review_status defaults to 'pending' for anything flagged sensitive
  in Stage 3, or 'approved' automatically for routine categories
  (tour, comeback, chart) that passed all checks
- Only 'approved' items are readable by the public API — enforce this
  in Firestore security rules, not just application logic

## MONITORING & SAFETY
- Log every rejected/retried generation (Stage 3 failures) to a
  separate `pipeline_audit_log` collection with the reason for
  rejection — this is for periodically reviewing whether the
  copyright filter is too strict/loose
- Build a simple admin dashboard page (internal, auth-gated) listing
  items in review_status='pending' with one-click approve/reject,
  since sensitive-tagged items need human review before publishing in
  any language

## DELIVERABLES
1. The full pipeline as Cloud Functions (ingestion, matching,
   summarization, translation, write stages as separate functions
   chained via Pub/Sub or Firestore triggers)
2. The n-gram verbatim-match validator as a standalone, unit-tested
   utility function
3. A config file listing the initial source whitelist (start with 3-5
   major Korean entertainment news outlets + official agency sites —
   I'll provide the list)
4. The admin review dashboard (simple internal page, not part of the
   public product)
5. A `pipeline_audit_log` viewer for debugging

Do not build the outlet whitelist scraper logic yet for outlets beyond
RSS-available ones — flag any outlet without a public RSS feed as
"needs custom scraper, deferred."
```

---

## 실행 전 준비물 (Antigravity에 넣기 전에 먼저 정리)

- [ ] 초기 소스 화이트리스트 (RSS 지원 확인된 언론사 3~5곳)
- [ ] 논란 키워드 리스트 초안 (한국어)
- [ ] 언어별 현지화 톤 가이드

## 실행 체크리스트

- [ ] `feature/data-layer`가 `dev`에 먼저 머지되어 있는가
- [ ] `feature/news-pipeline` 브랜치에서 진행했는가
- [ ] n-gram 검증 유틸의 단위 테스트가 통과하는가 (머지 전 필수 확인)
- [ ] `firestore.rules`에 `newsItems.imageUrl` 검증 규칙이 실제로 반영됐는가
      (Antigravity가 언급만 하고 실제 rules 파일에 반영을 빠뜨리는 경우가
      있으니 diff에서 직접 확인)
