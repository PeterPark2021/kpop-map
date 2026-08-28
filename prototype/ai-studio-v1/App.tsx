import React, { useState } from 'react';
import { gdArtistProfile } from './data/initialData';
import { useTourEvents } from './hooks/useTourEvents';
import { useLanguage } from './hooks/useLanguage';
import { GdAnchorHero } from './components/GdAnchorHero';
import { WorldTourMap } from './components/WorldTourMap';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const { events, setSelectedEvent } = useTourEvents();
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#fff' }}>K-Pop World Tour Pulse</h1>
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
        onSelectEvent={(ev) => alert(`${ev.city[currentLang] || ev.city.en} - ${ev.venueName} 선택됨`)}
      />
    </div>
  );
}
