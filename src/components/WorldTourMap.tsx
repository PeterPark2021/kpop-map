import React, { useState } from 'react';
import { TourEvent, LanguageCode, LocalizedString } from '../types/types';
import { InteractiveMap } from './InteractiveMap';

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  onSelectEvent?: (event: TourEvent) => void;
}

export const WorldTourMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  const [viewTab, setViewTab] = useState<'map' | 'list'>('map');

  const getVenueDisplay = (venue: string | LocalizedString | undefined): string => {
    if (!venue) return '';
    if (typeof venue === 'string') return venue;
    return venue[lang] || venue.en || '';
  };

  return (
    <section style={{ margin: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', fontWeight: 800 }}>
            🗺️ 글로벌 월드투어 일정 ({events.length}개 도시 순회)
          </h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            골드 핀을 클릭하여 실시간 티켓팅 및 공연 진행 상태를 변경해보세요
          </span>
        </div>

        <div style={{ display: 'flex', background: '#121622', padding: '3px', borderRadius: '8px', border: '1px solid #283042' }}>
          <button
            onClick={() => setViewTab('map')}
            style={{
              background: viewTab === 'map' ? '#eab308' : 'transparent',
              color: viewTab === 'map' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            🌐 지도 뷰
          </button>
          <button
            onClick={() => setViewTab('list')}
            style={{
              background: viewTab === 'list' ? '#eab308' : 'transparent',
              color: viewTab === 'list' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            📋 목록 뷰
          </button>
        </div>
      </div>

      {viewTab === 'map' ? (
        <InteractiveMap events={events} lang={lang} onSelectEvent={onSelectEvent} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {events.map(ev => {
            const cityName = ev.city[lang] || ev.city.en;
            const venueDisplay = getVenueDisplay(ev.venueName);
            const artistName = ev.artistName[lang] || ev.artistName.en || 'K-POP';

            return (
              <div
                key={ev.eventId}
                style={{
                  background: '#161b26',
                  padding: '16px',
                  borderRadius: '12px',
                  border: ev.status === 'inProgress' ? '1px solid #ef4444' : '1px solid #232a3d'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#eab308', fontWeight: 800 }}>{artistName}</span>
                  <span style={{
                    fontSize: '10px',
                    background: ev.status === 'ticketOpen' ? '#16a34a' : ev.status === 'inProgress' ? '#ef4444' : '#64748b',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {ev.status === 'ticketOpen' ? '티켓 오픈' : ev.status === 'inProgress' ? 'LIVE' : '예정'}
                  </span>
                </div>

                <h3 style={{ margin: '8px 0 2px 0', fontSize: '1.2rem', color: '#f8fafc' }}>{cityName}</h3>
                <p style={{ margin: '8px 0 4px 0', color: '#94a3b8', fontSize: '13px' }}>{venueDisplay}</p>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  📅 {new Date(ev.eventDate).toLocaleDateString()} ({ev.showCount}회)
                </div>

                {onSelectEvent && (
                  <button
                    onClick={() => onSelectEvent(ev)}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      background: '#1e2433',
                      color: '#ffd700',
                      border: '1px solid #ca8a04',
                      padding: '6px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    ⚡ 상태 토글
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};