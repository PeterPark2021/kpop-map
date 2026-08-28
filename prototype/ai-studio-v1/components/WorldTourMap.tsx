import React from 'react';
import { TourEvent, LanguageCode } from '../types/types';

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  onSelectEvent: (event: TourEvent) => void;
}

export const WorldTourMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  return (
    <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '12px', color: '#fff' }}>
      <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        🗺️ 빅뱅 20주년 월드투어 18개 도시 순회 현황
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginTop: '15px' }}>
        {events.map((ev) => (
          <div
            key={ev.eventId}
            onClick={() => onSelectEvent(ev)}
            style={{
              background: '#1e1e1e',
              padding: '15px',
              borderRadius: '8px',
              border: ev.isHighlight ? '1px solid #ffd700' : '1px solid #444',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.2rem', color: '#ffd700' }}>
                {ev.city[lang] || ev.city.en}
              </strong>
              <span style={{
                background: ev.status === 'ticketOpen' ? '#28a745' : '#555',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                {ev.status}
              </span>
            </div>
            <p style={{ margin: '8px 0 4px 0', color: '#bbb' }}>{ev.venueName}</p>
            <small style={{ color: '#888' }}>
              📅 {new Date(ev.eventDate).toLocaleDateString()} ({ev.showCount || 1}회 공연)
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
