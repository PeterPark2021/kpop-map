import React from 'react';
import { TourNewsFact } from '../types/types';

interface Props {
  news: TourNewsFact[];
}

export const NewsFactFeed: React.FC<Props> = ({ news }) => {
  return (
    <div style={{
      marginTop: '32px',
      background: '#12151e',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #1e2433',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📰 저작권 안심 팩트 피드 (Copyright-Safe Fact Feed)
        </h3>
        <span style={{ fontSize: '12px', background: '#0369a1', color: '#e0f2fe', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
          AI 팩트 추출 & 5개 국어 자동 번역
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {news.map((item) => (
          <div
            key={item.newsId}
            style={{
              background: '#181d2a',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #283042'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <strong style={{ color: '#f8fafc', fontSize: '1.05rem' }}>{item.title}</strong>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ background: '#334155', color: '#94a3b8', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {item.language}
                </span>
                {item.isOfficial && (
                  <span style={{ background: '#059669', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    ✓ 공식 인증 출처
                  </span>
                )}
              </div>
            </div>

            <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
              {(item.factSummary || []).map((fact, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{fact}</li>
              ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #232a3d', paddingTop: '10px' }}>
              <small style={{ color: '#64748b', fontSize: '12px' }}>
                출처: <strong>{item.sourceName}</strong>
              </small>
              <small style={{ color: '#64748b', fontSize: '12px' }}>
                {new Date(item.publishedAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};