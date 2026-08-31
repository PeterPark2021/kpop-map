import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TourEvent, LanguageCode } from '../types/types';
import { computeLifecycleStatus } from '../utils/lifecycleHelper';

const pinColors: Record<string, string> = {
  ticketOpen: '#22c55e',
  inProgress: '#ef4444',
  completed: '#64748b',
  scheduled: '#eab308'
};

const createCustomIcon = (status: string, isAnchorCity?: boolean) => {
  const color = pinColors[status] || '#ffd700';
  const size = isAnchorCity ? 22 : 14;
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  isAdmin?: boolean;
  onSelectEvent?: (event: TourEvent) => void;
}

export const InteractiveMap: React.FC<Props> = ({ events, lang, isAdmin = false, onSelectEvent }) => {
  const polylineCoords = events.map(e => [e.coordinates.lat, e.coordinates.lng] as [number, number]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ticketOpen': return { text: '티켓 오픈', bg: '#16a34a' };
      case 'inProgress': return { text: '공연 진행중 (LIVE)', bg: '#dc2626' };
      case 'completed': return { text: '공연 종료', bg: '#475569' };
      default: return { text: '예정', bg: '#475569' };
    }
  };

  return (
    <div style={{ position: 'relative', height: '520px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #283042' }}>
      <MapContainer center={[25, 20]} zoom={2} minZoom={2} style={{ height: '100%', width: '100%', background: '#0b0e14' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        {polylineCoords.length > 1 && (
          <Polyline positions={polylineCoords} pathOptions={{ color: '#ffd700', weight: 2, dashArray: '6, 6', opacity: 0.7 }} />
        )}
        {events.map((event) => {
          // 🚀 [핵심] 날짜 기반 동적 상태 계산 적용
          const dynamicStatus = computeLifecycleStatus(event.eventDate, event.status);
          const statusInfo = getStatusDisplay(dynamicStatus);
          const artistName = event.artistName[lang] || event.artistName.ko || 'Artist';
          const cityName = event.city[lang] || event.city.ko || 'City';
          const venueDisplay = typeof event.venueName === 'string' ? event.venueName : (event.venueName?.[lang] || event.venueName?.ko || 'Stadium');

          return (
            <Marker key={event.eventId} position={[event.coordinates.lat, event.coordinates.lng]} icon={createCustomIcon(dynamicStatus, event.isHighlight)}>
              <Popup>
                <div style={{ padding: '4px', minWidth: '200px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#ca8a04' }}>{artistName}</span>
                    <span style={{ fontSize: '10px', background: statusInfo.bg, color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <h3 style={{ margin: '2px 0 4px 0', fontSize: '1.2rem', fontWeight: 800 }}>{cityName}</h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#64748b' }}>{venueDisplay}</p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#475569' }}>📅 {event.eventDate}</p>

                  {isAdmin && onSelectEvent && (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
                      <button
                        onClick={() => onSelectEvent(event)}
                        style={{ width: '100%', background: '#0f172a', color: '#ffd700', border: '1px solid #ca8a04', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        ⚡ [관리자] 상태 토글
                      </button>
                      <span style={{ display: 'block', fontSize: '9px', color: '#94a3b8', textAlign: 'center', marginTop: '3px' }}>
                        * 날짜가 지나면 자동으로 재계산됩니다
                      </span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};