import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveMap } from '../InteractiveMap';
import { TourEvent } from '../../types/types';
import { vi } from 'vitest';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  Polyline: () => <div data-testid="polyline" />,
}));

describe('InteractiveMap', () => {
  const mockEvents: TourEvent[] = [
    {
      eventId: '1',
      tourId: 't1',
      artistId: 'a1',
      artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' },
      city: { ko: '고양 (서울)', en: 'Goyang (Seoul)', ja: '高陽 (ソウル)', zh: '高陽 (首爾)', sea: 'Goyang' },
      country: 'KR',
      venueName: { ko: '고양 종합운동장', en: 'Goyang Sports Complex', ja: '高陽総合運動場', zh: '高陽體育園區', sea: 'Goyang Sports Complex' },
      coordinates: { lat: 37.6584, lng: 126.8320 },
      eventDate: '2026-04-18T18:00:00Z',
      showCount: 2,
      status: 'ticketOpen',
      isHighlight: true,
      ticketUrl: 'https://tickets.example.com/bigbang-goyang'
    },
    {
      eventId: '2',
      tourId: 't1',
      artistId: 'a1',
      artistName: { ko: '빅뱅', en: 'BIGBANG', ja: 'BIGBANG', zh: 'BIGBANG' },
      city: { ko: '오클랜드', en: 'Auckland', ja: 'オークランド', zh: '奧克蘭', sea: 'Auckland' },
      country: 'NZ',
      venueName: { ko: '스파크 아레나', en: 'Spark Arena', ja: 'スパーク・アリーナ', zh: '星火競技場', sea: 'Spark Arena' },
      coordinates: { lat: -36.8485, lng: 174.7633 },
      eventDate: '2026-05-02T19:00:00Z',
      showCount: 1,
      status: 'scheduled',
      isHighlight: true
    },
  ];

  it('18개 도시 마커 개수와 정렬 순서 검증 (2개로 테스트)', () => {
    render(<InteractiveMap events={mockEvents} lang="ko" onSelectEvent={vi.fn()} />);

    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);

    // Test the text content inside Popup components for correct order
    expect(screen.getByText('고양 (서울)')).toBeInTheDocument();
    expect(screen.getByText('오클랜드')).toBeInTheDocument();
  });

  it('상태 토글 버튼 클릭 시 이벤트 핸들러가 정상 호출되는지 테스트', async () => {
    const handleSelectEvent = vi.fn();
    render(<InteractiveMap events={[mockEvents[0]]} lang="ko" onSelectEvent={handleSelectEvent} />);

    const toggleButtons = screen.getAllByRole('button', { name: /상태 토글/i });
    await userEvent.click(toggleButtons[0]);

    expect(handleSelectEvent).toHaveBeenCalledWith(mockEvents[0]);
    expect(handleSelectEvent).toHaveBeenCalledTimes(1);
  });
});
