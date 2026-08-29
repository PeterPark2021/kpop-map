import { TourEvent, ArtistProfile } from '../types/types';
export function generateEventJsonLd(event: TourEvent) {
  const cityName = event.city.ko || event.city.en || 'Seoul';
  const artistName = event.artistName.ko || event.artistName.en || 'K-POP Artist';
  const venueDisplay = typeof event.venueName === 'string' ? event.venueName : (event.venueName?.ko || event.venueName?.en || 'Stadium');
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `${artistName} 2026 월드투어 [${cityName}]`,
    startDate: event.eventDate,
    location: {
      '@type': 'Place',
      name: venueDisplay,
      address: { '@type': 'PostalAddress', addressLocality: cityName, addressCountry: event.country || 'KR' },
      geo: { '@type': 'GeoCoordinates', latitude: event.coordinates.lat, longitude: event.coordinates.lng }
    },
    performer: { '@type': 'MusicGroup', name: artistName }
  };
}
export function generateArtistJsonLd(artist: ArtistProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name.ko || artist.name.en || 'Artist',
    description: artist.description?.ko || artist.description?.en || '',
    url: `https://kpop-map-prod.web.app/artists/${artist.artistId}`
  };
}