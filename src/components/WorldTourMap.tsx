import React, { useState } from 'react';
import { TourEvent, LanguageCode } from '../types/types';
import { InteractiveMap } from './InteractiveMap';

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  onSelectEvent: (ev: TourEvent) => void;
}

export const WorldTourMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  const [viewTab, setViewTab] = useState<'map' | 'cards'>('map');

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
    <div style={{ background: '#12151e', padding: '24px', borderRadius: '16px', border: '1px solid #1e2433', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc' }}>
            🗺️ 빅뱅 20주년 18개 도시 순회 월드투어 맵 (31회 공연)
          </h2>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            골드 핀을 클릭하면 상세 공연장 정보와 실시간 티켓 상태를 확인할 수 있습니다.
          </span>
        </div>

        {/* 뷰 전환 탭 */}
        <div style={{ display: 'flex', background: '#181d2a', padding: '4px', borderRadius: '8px', border: '1px solid #2d3343' }}>
          <button
            onClick={() => setViewTab('map')}
            style={{
              background: viewTab === 'map' ? '#eab308' : 'transparent',
              color: viewTab === 'map' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px'
            }}
          >
            🌐 인터랙티브 지도
          </button>
          <button
            onClick={() => setViewTab('cards')}
            style={{
              background: viewTab === 'cards' ? '#eab308' : 'transparent',
              color: viewTab === 'cards' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px'
            }}
          >
            📋 도시 목록 카드
          </button>
        </div>
      </div>

      {viewTab === 'map' ? (
        <InteractiveMap events={events} lang={lang} onSelectEvent={onSelectEvent} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {events.map((ev, index) => {
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
                    #{index + 1} {ev.city[lang] || ev.city.en}
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
      )}
    </div>
  );
};