import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TourEvent, LanguageCode, LocalizedString } from '../types/types';

interface Props {
  events: TourEvent[];
  lang: LanguageCode;
  onSelectEvent?: (event: TourEvent) => void;
}

const customGoldIcon = new L.DivIcon({
  className: 'custom-gold-marker',
  html: `<div style="
    background: #ffd700;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #000;
    box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const customLiveIcon = new L.DivIcon({
  className: 'custom-live-marker',
  html: `<div style="
    background: #ef4444;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 15px #ef4444, 0 0 30px #ef4444;
    animation: pulse 1.5s infinite;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapBoundsManager({ events }: { events: TourEvent[] }) {
  const map = useMap();
  useEffect(() => {
    if (events.length > 0) {
      const bounds = L.latLngBounds(events.map(e => [e.coordinates.lat, e.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [events, map]);
  return null;
}

export const InteractiveMap: React.FC<Props> = ({ events, lang, onSelectEvent }) => {
  const polylineCoords = events.map(e => [e.coordinates.lat, e.coordinates.lng] as [number, number]);

  const getVenueDisplay = (venue: string | LocalizedString | undefined): string => {
    if (!venue) return '';
    if (typeof venue === 'string') return venue;
    return venue[lang] || venue.en || venue.ko || '';
  };

  return (
    <div style={{ height: '480px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #232a3d', position: 'relative' }}>
      <MapContainer
        center={[30, 40]}
        zoom={2}
        minZoom={2}
        style={{ height: '100%', width: '100%', background: '#0b0e14' }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapBoundsManager events={events} />

        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#ffd700',
              weight: 2.5,
              opacity: 0.75,
              dashArray: '6, 8'
            }}
          />
        )}

        {events.map((ev) => {
          const isLive = ev.status === 'inProgress';
          const icon = isLive ? customLiveIcon : customGoldIcon;
          const cityName = ev.city[lang] || ev.city.en || ev.city.ko || 'City';
          const artistName = ev.artistName[lang] || ev.artistName.en || ev.artistName.ko || 'K-POP';
          const venueDisplay = getVenueDisplay(ev.venueName);

          return (
            <Marker
              key={ev.eventId}
              position={[ev.coordinates.lat, ev.coordinates.lng]}
              icon={icon}
            >
              <Popup>
                <div style={{ padding: '6px', minWidth: '180px', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#ca8a04', textTransform: 'uppercase' }}>
                      {artistName}
                    </span>
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

                  <strong style={{ fontSize: '14px', display: 'block', color: '#0f172a' }}>
                    {cityName}
                  </strong>
                  <p style={{ margin: '3px 0 6px 0', fontSize: '12px', color: '#475569' }}>
                    {venueDisplay}
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                    📅 {new Date(ev.eventDate).toLocaleDateString()}
                  </div>

                  {onSelectEvent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        background: '#0f172a',
                        color: '#ffd700',
                        border: '1px solid #ca8a04',
                        padding: '6px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '11px'
                      }}
                    >
                      ⚡ 상태 토글
                    </button>
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