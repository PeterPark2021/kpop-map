import React from 'react';
import { TourEvent, LanguageCode } from '../types/types';

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  onSelectEvent: (ev: TourEvent) => void;
}

export const WorldTourMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  const getStatusBadge = (status: TourEvent['status']) => {
    switch (status) {
      case 'ticketOpen':
        return { text: '티켓 오픈', bg: '#16a34a', color: '#fff' };
      case 'inProgress':
        return { text: '공연 진행중', bg: '#e11d48', color: '#fff' };
      case 'completed':
        return { text: '공연 종료', bg: '#475569', color: '#cbd5e1' };
      default:
        return { text: '예정', bg: '#334155', color: '#cbd5e1' };
    }
  };

  return (
    <div style={{ background: '#12151e', padding: '24px', borderRadius: '16px', border: '1px solid #1e2433' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc' }}>
          🗺️ 빅뱅 20주년 18개 도시 순회 타임라인 (31회 공연)
        </h2>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
          총 {events.length}개 도시 등록됨
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {events.map((ev) => {
          const badge = getStatusBadge(ev.status);
          return (
            <div
              key={ev.eventId}
              onClick={() => onSelectEvent(ev)}
              style={{
                background: '#181d2a',
                padding: '18px',
                borderRadius: '12px',
                border: ev.isHighlight ? '1px solid rgba(234, 179, 8, 0.6)' : '1px solid #232a3d',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: ev.isHighlight ? '#fef08a' : '#fff' }}>
                  {ev.city[lang] || ev.city.en}
                </span>
                <span style={{
                  background: badge.bg,
                  color: badge.color,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {badge.text}
                </span>
              </div>
              <p style={{ margin: '8px 0 4px 0', color: '#94a3b8', fontSize: '13px' }}>{ev.venueName}</p>
              <small style={{ color: '#64748b' }}>
                📅 {new Date(ev.eventDate).toLocaleDateString()} · {ev.showCount || 1}회 공연
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};
