import React from 'react';
import { TourNewsFact } from '../types/types';

interface Props {
  news: TourNewsFact[];
}

export const NewsFactFeed: React.FC<Props> = ({ news }) => {
  return (
    <div style={{ marginTop: '28px', background: '#12151e', padding: '24px', borderRadius: '16px', border: '1px solid #1e2433' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📰 저작권 안심 팩트 피드 (공식 출처 기반)
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {news.map((item) => (
          <div key={item.newsId} style={{ background: '#181d2a', padding: '16px', borderRadius: '10px', border: '1px solid #232a3d' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ color: '#f1f5f9' }}>{item.title}</strong>
              {item.isOfficial && (
                <span style={{ background: '#0284c7', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                  ✓ 공식 인증
                </span>
              )}
            </div>
            <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
              {item.factSummary.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
            <small style={{ color: '#64748b' }}>출처: {item.sourceName}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
