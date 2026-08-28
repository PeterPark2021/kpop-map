import { render, screen } from '@testing-library/react';
import { NewsFactFeed } from '../NewsFactFeed';
import { TourNewsFact } from '../../types/types';

describe('NewsFactFeed', () => {
  const mockNews: TourNewsFact[] = [
    {
      newsId: '1',
      artistId: '1',
      language: 'ko',
      title: '테스트 뉴스',
      factSummary: ['팩트 1', '팩트 2'],
      sourceName: '테스트 소스',
      sourceUrl: 'https://test.com',
      isOfficial: true,
      publishedAt: '2023-10-27T00:00:00Z',
    },
  ];

  it('팩트 요약 불릿 리스트가 정상 렌더링되는지 검증', () => {
    render(<NewsFactFeed news={mockNews} />);
    expect(screen.getByText('팩트 1')).toBeInTheDocument();
    expect(screen.getByText('팩트 2')).toBeInTheDocument();
  });

  it('공식 인증 출처 배지(isOfficial == true)가 있을 때 배지가 표시되는지 확인', () => {
    render(<NewsFactFeed news={mockNews} />);
    expect(screen.getByText('✓ 공식 인증 출처')).toBeInTheDocument();
  });

  it('빈 데이터 전달 시 안전하게 fallback UI가 나타나는지 테스트', () => {
    render(<NewsFactFeed news={[]} />);
    expect(screen.getByText('📰 저작권 안심 팩트 피드 (Copyright-Safe Fact Feed)')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
