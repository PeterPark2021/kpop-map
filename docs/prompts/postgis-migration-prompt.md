# Antigravity 프롬프트 — PostGIS 이관 (지리 쿼리 고도화 시점)

> 사용 시점: Firestore MVP 검증 후, 반경 검색·복잡한 조인 쿼리가 필요해질 때.
> [`workflow-plan.md`](../workflow-plan.md) 참고 — 이관 시점은 트래픽/쿼리
> 복잡도가 늘어난 뒤로 의도적으로 미뤄둔 단계.
> 기준 스키마: [`data-schema.md`](../data-schema.md)의 전체 SQL DDL

---

```
Set up a PostgreSQL + PostGIS backend (Cloud SQL for PostgreSQL) for a
K-pop tour tracking platform, implementing this schema exactly as
specified — treat this as the source of truth relational schema:

[여기에 docs/data-schema.md의 전체 SQL DDL 섹션을 붙여넣기]

ADDITIONAL REQUIREMENTS:
1. Convert venues.latitude/longitude into a proper PostGIS `geography(Point,4326)`
   column instead of separate float columns, and add a GIST index for
   radius queries (e.g., "concerts within 50km of this city").
2. Create a materialized view `map_pins` that pre-joins events + tours +
   venues + entities into a single flat structure optimized for the
   map API endpoint, refreshed on a schedule (every 15 minutes) via
   pg_cron.
3. Write a recursive CTE query (and expose it as a view
   `entity_all_events`) that resolves "all events visible for an entity,
   including via group membership" — this replaces the UNION query
   designed earlier, so it works for arbitrary depth (solo → group →
   future sub-units).
4. Set up Row-Level Security: public read-only role for all tables,
   separate service-role for the ingestion pipeline with write access.
5. Generate a REST API layer (using PostgREST or a thin Express/Fastify
   wrapper) exposing:
   - GET /api/map-pins?status=onsale&country=JP
   - GET /api/entities/:id/events
   - GET /api/news?entity_id=X&lang=en

Seed with BIGBANG + G-DRAGON + the 2026 World Tour (18 cities, 31 shows)
as realistic sample data, matching what's publicly known about the tour.
```

---

## 이관 시 참고사항

- Firestore → PostGIS 이관 스크립트도 함께 요청해두면 데이터 유실 없이
  전환 가능 ("두 스키마 간 마이그레이션 스크립트도 짜줘" 추가 지시)
- Firestore 단계에서 필드명을 PostGIS 스키마와 최대한 일관되게 맞춰두면
  이관 비용이 줄어듦 (예: `eventDate` ↔ `event_date` 같은 케이스 변환만
  필요하도록)

## 실행 체크리스트

- [ ] 이관이 실제로 필요한 시점인지 먼저 확인 (Firestore로 충분한데
      선제적으로 이관하지 않기)
- [ ] 별도 `feature/postgis-migration` 브랜치에서 진행
- [ ] 기존 Firestore 프로덕션 데이터와 병행 운영 기간을 두고 검증 후 전환
