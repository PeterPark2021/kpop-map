import React, { useState } from 'react';
import { gdArtistProfile } from './data/initialData';
import { useTourEvents } from './hooks/useTourEvents';
import { useNewsFacts } from './hooks/useNewsFacts';
import { useLanguage } from './hooks/useLanguage';
import { GdAnchorHero } from './components/GdAnchorHero';
import { WorldTourMap } from './components/WorldTourMap';
import { NewsFactFeed } from './components/NewsFactFeed';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const { events, updateStatus } = useTourEvents();
  const { news } = useNewsFacts('bigbang-gd', currentLang);
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Realtime Global Concert Hub</span>
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
        onSelectEvent={(ev) => {
          const next = ev.status === 'ticketOpen' ? 'inProgress' : 'ticketOpen';
          updateStatus(ev.eventId, next);
        }}
      />

      <NewsFactFeed news={news} />
    </div>
  );
}
