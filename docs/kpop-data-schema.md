# K-pop 콘서트 지도 서비스 — 데이터 스키마 설계

## 설계 원칙

1. **아티스트 다형성**: GD처럼 "솔로 아티스트이자 그룹 멤버"인 케이스를 1급 시민으로 다룬다. 그룹/솔로/유닛을 하나의 `entities` 테이블로 통합하고 관계 테이블로 소속을 표현한다.
2. **투어 ≠ 공연**: 투어(Tour)와 개별 공연(Event)을 분리해, "빅뱅 2026 월드투어" 아래 "고양 공연", "오클랜드 공연" 등 31회가 매달리는 구조로 만든다.
3. **다국어는 콘텐츠 레이어에서 해결**: 스키마 자체에 언어 컬럼을 두지 않고, 번역 테이블을 분리해 신규 언어 추가 시 스키마 변경이 필요 없게 한다.
4. **뉴스는 아티스트/이벤트에 다대다로 연결**: 하나의 뉴스가 여러 아티스트(예: 빅뱅 멤버 전원)에 걸치는 경우가 흔하다.
5. **출처 추적을 모든 테이블에 강제**: 저작권/신뢰성 관리를 위해 원본 출처 URL과 라이선스 상태를 콘텐츠 단위로 기록한다.

---

## ERD 개요

```
entities (아티스트/그룹) ──┬── entity_relations (소속/멤버십)
                          ├── entity_translations (다국어 프로필)
                          ├── tours (투어)
                          │      └── events (개별 공연)
                          │             ├── venues (공연장)
                          │             └── ticket_windows (예매 일정)
                          ├── news_items ──┬── entity_news_map (다대다)
                          │                └── news_translations
                          └── social_snapshots (SNS/차트 요약)

venues ── (지리 정보, PostGIS)
```

---

## 1. 아티스트/그룹 — `entities`

GD, 빅뱅(그룹), 태양(솔로) 모두 여기 한 행씩 들어간다.

```sql
CREATE TABLE entities (
    entity_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     TEXT NOT NULL CHECK (entity_type IN ('solo', 'group', 'unit')),
    stage_name      TEXT NOT NULL,               -- 'G-DRAGON', 'BIGBANG'
    legal_name      TEXT,                        -- '권지용' (선택)
    agency          TEXT,                        -- 'YG ENTERTAINMENT', '갤럭시코퍼레이션'
    debut_date      DATE,
    status          TEXT DEFAULT 'active' CHECK (status IN ('active','hiatus','disbanded')),
    official_site   TEXT,
    official_image_url TEXT,                     -- 반드시 공식 배포 이미지만
    image_license_note TEXT,                     -- 이미지 출처/라이선스 근거 기록 (감사 추적용)
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_status ON entities(status);
```

## 2. 소속 관계 — `entity_relations`

GD는 "빅뱅의 멤버"이면서 동시에 "솔로 아티스트"다. 이 다대다 관계를 여기서 표현한다.

```sql
CREATE TABLE entity_relations (
    relation_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_entity_id UUID NOT NULL REFERENCES entities(entity_id), -- 그룹 (BIGBANG)
    member_entity_id UUID NOT NULL REFERENCES entities(entity_id), -- 멤버 (GD)
    role            TEXT,                         -- 'member', 'leader', 'former_member'
    joined_date     DATE,
    left_date       DATE,                          -- NULL이면 현재도 소속
    UNIQUE (parent_entity_id, member_entity_id)
);
```

예시 데이터:
| parent (그룹) | member | role |
|---|---|---|
| BIGBANG | G-DRAGON | leader |
| BIGBANG | TAEYANG | member |
| BIGBANG | DAESUNG | member |

→ 이 구조 덕분에 "GD가 참여하는 모든 공연"을 조회할 때 솔로 활동 + 빅뱅 활동을 자동으로 합쳐서 보여줄 수 있다 (아래 쿼리 참고).

## 3. 투어 — `tours`

```sql
CREATE TABLE tours (
    tour_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id       UUID NOT NULL REFERENCES entities(entity_id),
    tour_name       TEXT NOT NULL,                 -- '2026 WORLD TOUR', 'Übermensch'
    tour_type       TEXT CHECK (tour_type IN ('concert_tour','fanmeeting','festival_appearance')),
    anniversary_note TEXT,                         -- '데뷔 20주년 기념' 등 서사적 태그
    start_date      DATE,
    end_date        DATE,
    official_url    TEXT,
    status          TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

## 4. 공연장 — `venues`

```sql
CREATE TABLE venues (
    venue_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_name      TEXT NOT NULL,                 -- '고양종합운동장'
    city            TEXT NOT NULL,
    country_code    CHAR(2) NOT NULL,               -- ISO 3166-1 alpha-2
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    capacity        INTEGER,
    venue_type      TEXT CHECK (venue_type IN ('stadium','arena','dome','hall'))
);

CREATE INDEX idx_venues_geo ON venues USING GIST (
    ll_to_earth(latitude, longitude)
);
```

## 5. 개별 공연 — `events`

지도 위의 핀 하나하나가 여기서 나온다.

```sql
CREATE TABLE events (
    event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id         UUID NOT NULL REFERENCES tours(tour_id),
    venue_id        UUID NOT NULL REFERENCES venues(venue_id),
    event_date      DATE NOT NULL,
    event_time      TIME,
    sequence_no     INTEGER,                        -- 31회 중 몇 회차인지
    ticket_status   TEXT DEFAULT 'announced'
                    CHECK (ticket_status IN ('announced','presale','onsale','soldout','completed','cancelled')),
    seating_chart_url TEXT,
    price_range_krw INT4RANGE,                       -- 최저~최고가
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_tour ON events(tour_id);
```

## 6. 티켓 예매 일정 — `ticket_windows`

예매 단계가 여러 스텝(멤버십 서베이 → 사전인증 → 선예매 → 일반예매)으로 나뉘는 경우가 많아 별도 테이블로 분리한다.

```sql
CREATE TABLE ticket_windows (
    window_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(event_id),
    window_type     TEXT NOT NULL,                  -- 'membership_survey','presale','general_sale'
    platform        TEXT,                           -- 'NOL 티켓', 'Interpark'
    region_restriction TEXT,                        -- 'KR', 'INTL', NULL(제한없음)
    opens_at        TIMESTAMPTZ,
    closes_at       TIMESTAMPTZ
);

CREATE INDEX idx_ticket_windows_event ON ticket_windows(event_id);
```

## 7. 뉴스/콘텐츠 — `news_items`

원문 저작권 보호를 위해 **원문을 저장하지 않고 요약본만 저장**한다. `source_url`은 항상 필수로 기록해 링크아웃한다.

```sql
CREATE TABLE news_items (
    news_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline_ko     TEXT NOT NULL,                  -- 원 소스 기반, 자체 재구성 헤드라인
    summary_ko      TEXT NOT NULL,                  -- AI 요약 (원문 아님, 15단어 이하 인용만 허용)
    category        TEXT CHECK (category IN ('comeback','tour','award','controversy','collab','chart','other')),
    source_name     TEXT NOT NULL,                  -- '한국일보'
    source_url      TEXT NOT NULL,                  -- 반드시 원문 링크
    published_at    TIMESTAMPTZ,
    ingested_at     TIMESTAMPTZ DEFAULT now(),
    sentiment       TEXT CHECK (sentiment IN ('positive','neutral','sensitive')), -- 논란성 기사 필터링용
    review_status   TEXT DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected'))
);
```

## 8. 뉴스-아티스트 매핑 — `entity_news_map`

빅뱅 관련 뉴스 하나가 GD, 태양, 대성 모두에 걸릴 수 있다.

```sql
CREATE TABLE entity_news_map (
    entity_id   UUID NOT NULL REFERENCES entities(entity_id),
    news_id     UUID NOT NULL REFERENCES news_items(news_id),
    relevance   TEXT CHECK (relevance IN ('primary','mentioned')),
    PRIMARY KEY (entity_id, news_id)
);
```

## 9. 다국어 번역 — `entity_translations`, `news_translations`

언어 추가가 스키마 변경 없이 "행 추가"만으로 끝나도록 설계.

```sql
CREATE TABLE entity_translations (
    entity_id       UUID NOT NULL REFERENCES entities(entity_id),
    lang_code       TEXT NOT NULL,                  -- 'ja','en','zh-TW','th','vi','id','ms'
    display_name    TEXT NOT NULL,
    bio_summary     TEXT,
    localization_tone TEXT,                          -- 'formal','casual' 등 현지화 가이드 메모
    updated_at      TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (entity_id, lang_code)
);

CREATE TABLE news_translations (
    news_id         UUID NOT NULL REFERENCES news_items(news_id),
    lang_code       TEXT NOT NULL,
    headline        TEXT NOT NULL,
    summary         TEXT NOT NULL,
    translated_at   TIMESTAMPTZ DEFAULT now(),
    translation_engine TEXT,                          -- 'gemini-3-pro', 'claude-sonnet-5' 등 감사 기록
    PRIMARY KEY (news_id, lang_code)
);
```

## 10. SNS/차트 스냅샷 — `social_snapshots` (확장용, MVP 이후)

```sql
CREATE TABLE social_snapshots (
    snapshot_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id       UUID NOT NULL REFERENCES entities(entity_id),
    platform        TEXT,                           -- 'melon','spotify','youtube'
    metric_type     TEXT,                           -- 'chart_rank','followers','views'
    metric_value    NUMERIC,
    captured_at     TIMESTAMPTZ DEFAULT now()
);
```

---

## 핵심 쿼리 예시

### "GD와 관련된 모든 공연" (솔로 + 빅뱅 활동 통합)

```sql
SELECT e.event_id, t.tour_name, v.city, v.country_code, e.event_date
FROM events e
JOIN tours t ON e.tour_id = t.tour_id
JOIN venues v ON e.venue_id = v.venue_id
WHERE t.entity_id IN (
    -- GD 본인
    SELECT entity_id FROM entities WHERE stage_name = 'G-DRAGON'
    UNION
    -- GD가 멤버로 속한 그룹들
    SELECT parent_entity_id FROM entity_relations
    WHERE member_entity_id = (SELECT entity_id FROM entities WHERE stage_name = 'G-DRAGON')
    AND left_date IS NULL
)
ORDER BY e.event_date;
```

### 지도 표출용 GeoJSON 스타일 API 응답 (개념)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [126.835, 37.658] },
      "properties": {
        "event_id": "uuid",
        "entity": { "name": "BIGBANG", "highlight": true },
        "tour_name": "2026 WORLD TOUR",
        "venue": "고양종합운동장",
        "date": "2026-08-21",
        "ticket_status": "onsale",
        "sequence": "1 of 31"
      }
    }
  ]
}
```
`"highlight": true` 필드로 GD/빅뱅 같은 앵커 아티스트 핀을 프론트엔드에서 시각적으로 구분한다 (더 크게, 다른 색상 등).

---

## 확장 로드맵과 스키마 대응

| 확장 단계 | 필요한 스키마 변경 |
|---|---|
| 신규 언어 추가 | 없음 (translations 테이블에 행만 추가) |
| 신규 아티스트 추가 | 없음 (entities에 행 추가) |
| 유닛 활동 추가 (예: GD&태양 유닛) | entities에 `entity_type='unit'` 행 추가 + entity_relations로 양쪽 멤버 연결 |
| 팬 리뷰/직관 인증 기능 | `event_reviews` 테이블 신규 추가 (본 스키마와 독립적으로 확장 가능) |
| 굿즈/숙소 제휴 링크 | `affiliate_links` 테이블을 venues/events에 연결 |

---

## 저작권/신뢰성 관련 스키마 설계 근거

- `image_license_note`, `translation_engine`, `review_status`, `source_url` 컬럼은 모두 **감사 추적(audit trail)** 목적. 나중에 소속사나 언론사로부터 이의제기가 들어왔을 때 "이 콘텐츠가 어떤 근거로 게시됐는지" 즉시 추적 가능해야 한다.
- `news_items.summary_ko`에는 원문을 절대 저장하지 않고 AI 재구성 요약만 저장 — 이는 애플리케이션 레이어가 아니라 **스키마 설계 단계에서부터 강제**하는 것이 안전하다 (원문 컬럼 자체를 두지 않음으로써 실수로 원문이 저장/노출되는 것을 원천 차단).
