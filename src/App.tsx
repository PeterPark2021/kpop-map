import { useState } from 'react';
import { gdArtistProfile } from './data/initialData';
import { useTourEvents } from './hooks/useTourEvents';
import { useNewsFacts } from './hooks/useNewsFacts';
import { useLanguage } from './hooks/useLanguage';
import { GdAnchorHero } from './components/GdAnchorHero';
import { WorldTourMap } from './components/WorldTourMap';
import { NewsFactFeed } from './components/NewsFactFeed';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TourEvent } from './types/types';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const { events, updateStatus } = useTourEvents();
  const { news } = useNewsFacts('bigbang-gd', currentLang);
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStatusToggle = async (selectedEv: TourEvent) => {
    const nextStatus: TourEvent['status'] =
      selectedEv.status === 'ticketOpen'
        ? 'inProgress'
        : selectedEv.status === 'inProgress'
        ? 'completed'
        : 'ticketOpen';

    const statusName =
      nextStatus === 'ticketOpen' ? '티켓 오픈' : nextStatus === 'inProgress' ? '공연 진행중 (LIVE)' : '공연 종료';

    const cityName = selectedEv.city[currentLang] || selectedEv.city.en;
    setToastMessage(`⚡ [${cityName}] 상태가 '${statusName}'(으)로 실시간 변경되었습니다!`);
    setTimeout(() => setToastMessage(null), 3500);

    await updateStatus(selectedEv.eventId, nextStatus);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#059669',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: 700,
          fontSize: '14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 9999,
          border: '1px solid #34d399'
        }}>
          {toastMessage}
        </div>
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
            ● Google Cloud Firestore Live Connected
          </span>
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

      <NewsFactFeed news={news} />
    </div>
  );
}