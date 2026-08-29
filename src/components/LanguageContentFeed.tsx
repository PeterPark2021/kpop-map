import React, { useState } from 'react';
import { LanguageContentItem, LanguageCode } from '../types/types';
import { LanguageContentCard } from './LanguageContentCard';

interface Props {
  items: LanguageContentItem[];
  currentLanguage: LanguageCode;
}

export const LanguageContentFeed: React.FC<Props> = ({ items, currentLanguage }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fandomTerms' | 'onomatopoeia'>('all');

  // 승인된(approved) 항목만 필터링 (Governance Rule)
  const approvedItems = items.filter(item => item.reviewStatus === 'approved');

  const filteredItems = approvedItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🗣️</span> K-POP 콘서트 현장 한국어 학습 팩
          </h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            글로벌 팬덤 필수 유행어 및 콘서트 떼창·의성어 가이드
          </span>
        </div>

        {/* 카테고리 필터 탭 */}
        <div style={{ display: 'flex', gap: '6px', background: '#121622', padding: '4px', borderRadius: '10px', border: '1px solid #232a3d' }}>
          {[
            { id: 'all', label: '전체 (All)' },
            { id: 'fandomTerms', label: '💬 팬덤 용어' },
            { id: 'onomatopoeia', label: '🔊 의성어·의태어' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              style={{
                background: selectedCategory === tab.id ? '#eab308' : 'transparent',
                color: selectedCategory === tab.id ? '#000' : '#94a3b8',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 그리드 또는 Empty State */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: '#121622',
          borderRadius: '16px',
          border: '1px dashed #283042',
          color: '#64748b'
        }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>📚</span>
          현재 승인 완료된 학습 표현이 없습니다. (관리자 검수 대기 중)
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '18px'
        }}>
          {filteredItems.map(item => (
            <LanguageContentCard
              key={item.contentId}
              item={item}
              currentLanguage={currentLanguage}
            />
          ))}
        </div>
      )}
    </section>
  );
};