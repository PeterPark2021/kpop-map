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

// K-pop 골드 펄스 커스텀 마커 아이콘 생성
const createCustomMarker = (order: number, isHighlight?: boolean) => {
  return L.divIcon({
    className: 'custom-tour-pin',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        background: ${isHighlight ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : '#e11d48'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 0 15px ${isHighlight ? 'rgba(255, 215, 0, 0.8)' : 'rgba(225, 29, 72, 0.6)'};
        border: 2px solid #ffffff;
        cursor: pointer;
      ">
        ${order}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export const InteractiveMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  // 투어 일정 순으로 정렬하여 비행 경로(Polyline) 좌표 배열 생성
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [events]);

  const routePositions = useMemo(() => {
    return sortedEvents.map((ev) => [ev.coordinates.lat, ev.coordinates.lng] as [number, number]);
  }, [sortedEvents]);

  return (
    <div style={{
      height: '520px',
      width: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #2a3347',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      <MapContainer
        center={[20, 20]}
        zoom={2}
        minZoom={2}
        maxZoom={12}
        style={{ height: '100%', width: '100%', background: '#0a0d14' }}
      >
        {/* K-pop 다크 테마 타일맵 (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 18개 도시 순회 비행 경로 (Golden Polyline) */}
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: '#ffd700',
            weight: 2.5,
            dashArray: '6, 8',
            opacity: 0.75
          }}
        />

        {/* 18개 도시 핀 마커 */}
        {sortedEvents.map((ev, index) => (
          <Marker
            key={ev.eventId}
            position={[ev.coordinates.lat, ev.coordinates.lng]}
            icon={createCustomMarker(index + 1, ev.isHighlight)}
            eventHandlers={{
              click: () => onSelectEvent(ev)
            }}
          >
            <Popup className="tour-custom-popup">
              <div style={{ padding: '6px', color: '#111', fontFamily: 'sans-serif' }}>
                <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 800 }}>
                  STOP #{index + 1}
                </div>
                <strong style={{ fontSize: '15px', color: '#000' }}>
                  {ev.city[lang] || ev.city.en}
                </strong>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#555' }}>
                  {ev.venueName}
                </p>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
                  📅 {new Date(ev.eventDate).toLocaleDateString()} ({ev.showCount || 1}회)
                </div>
                <button
                  onClick={() => onSelectEvent(ev)}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    background: '#111',
                    color: '#ffd700',
                    border: 'none',
                    padding: '6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  상태 변경 (실시간 동기화)
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};