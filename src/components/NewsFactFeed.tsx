import React, { useState } from 'react';
import { TourNewsFact } from '../types/types';
interface Props { news: TourNewsFact[]; }
export const NewsFactFeed: React.FC<Props> = ({ news }) => {
  const [filterOfficial, setFilterOfficial] = useState(false);
  const displayedNews = filterOfficial ? news.filter(n => n.isOfficial) : news;
  return (
    <section style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', fontWeight: 800 }}>📰 검증된 투어 팩트 뉴스 ({displayedNews.length}건)</h2>
        <button onClick={() => setFilterOfficial(!filterOfficial)} style={{ background: filterOfficial ? '#16a34a' : '#1e2433', color: filterOfficial ? '#fff' : '#94a3b8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
          {filterOfficial ? '✓ 공식 보도만 보는 중' : '공식 보도자료 필터'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {displayedNews.map((item) => (
          <div key={item.newsId} style={{ background: '#161b26', padding: '18px', borderRadius: '12px', border: '1px solid #232a3d' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#eab308', fontWeight: 800 }}>{item.sourceName || item.source || 'Official Source'}</span>
              <span style={{ fontSize: '10px', background: item.isOfficial ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)', color: item.isOfficial ? '#4ade80' : '#94a3b8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{item.isOfficial ? '✓ 공식 보도' : '일반 보도'}</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px 0' }}>{item.title || item.headline}</h3>
            {item.factSummary && (
              <ul style={{ margin: '0 0 12px 0', paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                {(item.factSummary || []).map((fact: string, idx: number) => <li key={idx}>{fact}</li>)}
              </ul>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e2433', paddingTop: '10px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</span>
              {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#ffd700', textDecoration: 'none', fontWeight: 700 }}>원문 보기 ↗</a>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};