import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TourEvent, LanguageCode } from '../types/types';

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  onSelectEvent: (ev: TourEvent) => void;
}

const createCustomMarker = (order: number, isHighlight?: boolean, status?: TourEvent['status']) => {
  const isLive = status === 'inProgress';
  const isOpen = status === 'ticketOpen';

  const bgColor = isLive
    ? '#e11d48'
    : isOpen
    ? '#16a34a'
    : isHighlight
    ? 'linear-gradient(135deg, #ffd700, #ff8c00)'
    : '#475569';

  return L.divIcon({
    className: 'custom-tour-pin',
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        background: ${bgColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 0 16px ${isLive ? 'rgba(225, 29, 72, 0.9)' : 'rgba(255, 215, 0, 0.7)'};
        border: 2px solid #ffffff;
        cursor: pointer;
      ">
        ${order}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
  });
};

export const InteractiveMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [events]);

  const routePositions = useMemo(() => {
    return sortedEvents.map((ev) => [ev.coordinates.lat, ev.coordinates.lng] as [number, number]);
  }, [sortedEvents]);

  const getStatusLabel = (status: TourEvent['status']) => {
    switch (status) {
      case 'ticketOpen': return { text: '🟢 티켓 오픈', bg: '#16a34a' };
      case 'inProgress': return { text: '🔴 공연 진행중 (LIVE)', bg: '#e11d48' };
      case 'completed': return { text: '⚪ 공연 종료', bg: '#475569' };
      default: return { text: '🟡 예정', bg: '#ca8a04' };
    }
  };

  return (
    <div style={{
      height: '520px',
      width: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #2a3347',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
    }}>
      <MapContainer
        center={[25, 60]}
        zoom={2}
        minZoom={2}
        maxZoom={12}
        style={{ height: '100%', width: '100%', background: '#0a0d14' }}
      >
        {/* 워터마크 없는 고화질 다크 타일맵 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />

        {/* 18개 도시 순회 비행선 */}
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: '#ffd700',
            weight: 2.5,
            dashArray: '6, 8',
            opacity: 0.8
          }}
        />

        {sortedEvents.map((ev, index) => {
          const statusBadge = getStatusLabel(ev.status);
          return (
            <Marker
              key={`${ev.eventId}-${ev.status}`}
              position={[ev.coordinates.lat, ev.coordinates.lng]}
              icon={createCustomMarker(index + 1, ev.isHighlight, ev.status)}
            >
              <Popup>
                <div style={{ padding: '8px', color: '#111', minWidth: '180px', fontFamily: 'sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 800 }}>STOP #{index + 1}</span>
                    <span style={{ background: statusBadge.bg, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {statusBadge.text}
                    </span>
                  </div>
                  <strong style={{ fontSize: '15px', color: '#000' }}>
                    {ev.city[lang] || ev.city.en}
                  </strong>
                  <p style={{ margin: '4px 0', fontSize: '12px', color: '#4b5563' }}>
                    {ev.venueName}
                  </p>
                  <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, marginBottom: '10px' }}>
                    📅 {new Date(ev.eventDate).toLocaleDateString()} ({ev.showCount || 1}회)
                  </div>

                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onSelectEvent(ev);
                    }}
                    style={{
                      width: '100%',
                      background: '#111827',
                      color: '#facc15',
                      border: '1px solid #facc15',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  >
                    ⚡ 상태 토글 (실시간 동기화)
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};