import React, { useState } from 'react';
import { gdArtistProfile, initialBigBangTourEvents, sampleNewsFacts } from './data/initialData';
import { useLanguage } from './hooks/useLanguage';
import { GdAnchorHero } from './components/GdAnchorHero';
import { WorldTourMap } from './components/WorldTourMap';
import { NewsFactFeed } from './components/NewsFactFeed';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TourEvent } from './types/types';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const [events, setEvents] = useState<TourEvent[]>(initialBigBangTourEvents);
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');

  const handleStatusToggle = (selectedEv: TourEvent) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.eventId === selectedEv.eventId
          ? { ...ev, status: ev.status === 'ticketOpen' ? 'inProgress' : 'ticketOpen' }
          : ev
      )
    );
  };

  // 현재 언어에 맞는 뉴스 필터링 (동남아는 en 매핑)
  const targetLang = currentLang === 'sea' ? 'en' : currentLang;
  const filteredNews = sampleNewsFacts.filter((n) => n.language === targetLang);
  const displayNews = filteredNews.length > 0 ? filteredNews : sampleNewsFacts.filter((n) => n.language === 'ko');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#64748b' }}>2026 Global Concert Hub & Fact Stream</span>
        </div>
        <LanguageSwitcher currentLang={currentLang} onLanguageChange={setCurrentLang} />
      </header>

      {viewMode === 'anchor' && (
        <GdAnchorHero
          profile={gdArtistProfile}
          lang={currentLang}
          onExploreAll={() => setViewMode('all')}
        />
      )}

      <WorldTourMap
        events={events}
        lang={currentLang}
        onSelectEvent={handleStatusToggle}
      />

      <NewsFactFeed news={displayNews} />
    </div>
  );
}