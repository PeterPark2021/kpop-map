# Antigravity 프롬프트 — Firestore 데이터 레이어 세팅 (MVP)

> 사용 시점: [`workflow-plan.md`](../workflow-plan.md) 3단계,
> `feature/data-layer` 브랜치에서 최초 실행.
> 기준 스키마: [`data-schema.md`](../data-schema.md)

---

```
Set up a Firestore data layer for a K-pop tour tracking platform, based
on the relational schema below. Since Firestore has no joins, denormalize
according to these rules:

SOURCE SCHEMA (PostgreSQL, for reference — do not create SQL, this is
context only):
- entities (entity_id, entity_type, stage_name, agency, status,
  official_image_url, image_license_note)
- entity_relations (parent_entity_id, member_entity_id, role, left_date)
- tours (tour_id, entity_id, tour_name, tour_type, start_date, end_date, status)
- venues (venue_id, venue_name, city, country_code, latitude, longitude, capacity)
- events (event_id, tour_id, venue_id, event_date, sequence_no, ticket_status,
  price_range_krw)
- ticket_windows (window_id, event_id, window_type, platform, opens_at, closes_at)
- news_items (news_id, headline_ko, summary_ko, category, source_name,
  source_url, published_at, sentiment, review_status)
- entity_news_map (entity_id, news_id, relevance)
- entity_translations (entity_id, lang_code, display_name, bio_summary)
- news_translations (news_id, lang_code, headline, summary, translation_engine)

FIRESTORE COLLECTION DESIGN — implement it this way:

1. `entities/{entityId}`
   - Store entity_type, stage_name, agency, status, official_image_url,
     image_license_note
   - Embed a `groupMemberships` array field:
     [{ parentEntityId, parentStageName, role, isCurrent }]
     (denormalize parent stage_name here so we never need a join to
     display "GD — member of BIGBANG")
   - Embed a `translations` map field keyed by lang_code:
     { "en": { displayName, bioSummary }, "ja": {...}, ... }
     (do NOT create a separate subcollection for translations — this
     data is small and always read together with the entity)

2. `tours/{tourId}`
   - Store entity_id AND denormalized entity_stage_name, entity_type
   - Store tour_name, tour_type, anniversary_note, start_date, end_date,
     status
   - Embed an `eventSummary` array for map rendering without extra reads:
     [{ eventId, city, countryCode, lat, lng, eventDate, ticketStatus,
        sequenceNo }]
     (this is the denormalized copy used by the map view; the full event
     doc still exists in the subcollection below for detail pages)

3. `tours/{tourId}/events/{eventId}` (subcollection)
   - Full event detail: venue_id, venue_name, city, country_code, lat,
     lng, event_date, event_time, sequence_no, ticket_status, capacity,
     price_range_krw, seating_chart_url, notes
   - Embed `ticketWindows` as an array field (no separate collection —
     always read together with the event):
     [{ windowType, platform, regionRestriction, opensAt, closesAt }]

4. `newsItems/{newsId}`
   - headline_ko, summary_ko, category, source_name, source_url,
     published_at, sentiment, review_status
   - Embed `relatedEntities` array:
     [{ entityId, stageName, relevance }]
     (replaces entity_news_map — this is the query-friendly direction
     since "news for artist X" is the common read pattern)
   - Embed `translations` map keyed by lang_code:
     { "en": { headline, summary, translationEngine }, ... }

5. `venues/{venueId}`
   - Keep as its own top-level collection since venues are reused across
     many tours/events
   - Fields: venue_name, city, country_code, latitude, longitude,
     capacity, venue_type
   - Add a GeoPoint field (Firestore native type) combining lat/lng for
     future geo-query support

QUERY PATTERNS TO OPTIMIZE FOR (design indexes accordingly):
- "All map pins for currently onsale/upcoming events" → composite index
  on tours.status + events within date range
- "All news for a given entityId in a given language" → array-contains
  query on relatedEntities.entityId, then read translations map client-side
- "GD's combined solo + group tour events" → query tours where
  entity_id == GD_id OR entity_id IN [group IDs where GD is current member]
  (resolve the group ID list at write-time when creating a tour, and
  store it denormalized on the tour doc as `visibleToEntityIds: []`
  array so this becomes a single array-contains query, not two queries
  merged client-side)

DELIVERABLES:
1. Firestore security rules (public read on entities/tours/events/venues/
   newsItems, write restricted to a backend service account only)
2. TypeScript type definitions matching this collection structure
3. A seed script populating BIGBANG + G-DRAGON + the 2026 World Tour
   (18 cities, 31 shows) as realistic sample data
4. A Cloud Function trigger stub: when a new document is written to
   `tours/{tourId}`, recompute and write the `eventSummary` array and
   `visibleToEntityIds` array automatically (this keeps denormalized
   fields in sync without manual maintenance)

Do not implement the news ingestion/translation pipeline yet — just the
data layer and seed data.
```

---

## 실행 체크리스트

- [ ] Antigravity 워크스페이스가 GitHub 저장소에 직접 연결되어 있는가
- [ ] `feature/data-layer` 브랜치에서 실행했는가 (`dev`/`main` 직접 작업 금지)
- [ ] 산출물 검토 후 PR 생성 → 셀프 리뷰 → `dev` 머지
