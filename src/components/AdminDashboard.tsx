import React, { useState } from 'react';
import { TourNewsFact, PipelineAuditLog, LanguageContentItem } from '../types/types';
import { officialRssSources } from '../data/rssSourcesCatalog';
import { rssCollectorService } from '../services/rssCollectorService';

interface Props {
  newsList: TourNewsFact[];
  auditLogs: PipelineAuditLog[];
  languageItems: LanguageContentItem[];
  onApproveNews: (newsId: string) => Promise<void>;
  onRejectNews: (newsId: string, reason: string) => Promise<void>;
  onApproveLang: (contentId: string) => Promise<void>;
  onRejectLang: (contentId: string) => Promise<void>;
  onClose: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  newsList,
  auditLogs,
  languageItems,
  onApproveNews,
  onRejectNews,
  onApproveLang,
  onRejectLang,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'lang' | 'rss' | 'audit'>('news');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<string | null>(null);

  const pendingNews = newsList.filter(n => n.reviewStatus === 'pending');
  const pendingLang = languageItems.filter(l => l.reviewStatus === 'pending');

  const handleRunRssSync = async () => {
    setIsSyncing(true);
    setSyncStats(null);
    try {
      const res = await rssCollectorService.executeRssSync();
      setSyncStats(`✓ ${res.totalFeedsChecked}개 피드 점검 완료: 팩트 ${res.newFactsExtracted}건 추출 (자동승인: ${res.autoApprovedCount}, 검수대기: ${res.pendingReviewCount})`);
    } catch (err) {
      setSyncStats('⚠️ RSS 수집 중 일시적 네트워크 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '20px'
    }}>
      <div style={{
        background: '#121622',
        border: '1px solid #283042',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
        color: '#f8fafc',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              ⚙️ K-POP Tour Pulse 통합 관리자 콘솔
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              투어 뉴스 교차 검증, 한국어 표현 검수 및 RSS 피드 수집 파이프라인
            </span>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e2433', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('news')}
            style={{
              background: activeTab === 'news' ? '#eab308' : '#1e2433',
              color: activeTab === 'news' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📰 뉴스 검수 ({pendingNews.length})
          </button>
          <button
            onClick={() => setActiveTab('lang')}
            style={{
              background: activeTab === 'lang' ? '#eab308' : '#1e2433',
              color: activeTab === 'lang' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🇰🇷 한국어 학습 ({pendingLang.length})
          </button>
          <button
            onClick={() => setActiveTab('rss')}
            style={{
              background: activeTab === 'rss' ? '#eab308' : '#1e2433',
              color: activeTab === 'rss' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📡 RSS 수집원 ({officialRssSources.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              background: activeTab === 'audit' ? '#eab308' : '#1e2433',
              color: activeTab === 'audit' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🛡️ 감사 로그 ({auditLogs.length})
          </button>
        </div>

        {/* 탭 1: RSS 수집원 관리 */}
        {activeTab === 'rss' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#ffd700' }}>
                  5대 기획사 & 글로벌 미디어 공식 RSS 피드 ({officialRssSources.length}개)
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>
                  6시간마다 자동 수집되며, 수동 즉시 수집도 지원합니다.
                </span>
              </div>
              <button
                onClick={handleRunRssSync}
                disabled={isSyncing}
                style={{
                  background: 'linear-gradient(135deg, #ffd700, #eab308)',
                  color: '#000',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {isSyncing ? '📡 수집 및 검증 중...' : '🚀 즉시 RSS 수집 실행'}
              </button>
            </div>

            {syncStats && (
              <div style={{ background: '#0f291e', border: '1px solid #22c55e', color: '#4ade80', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
                {syncStats}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {officialRssSources.map(s => (
                <div key={s.sourceId} style={{ background: '#161b26', padding: '14px', borderRadius: '10px', border: '1px solid #283042' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', background: s.isOfficial ? '#16a34a' : '#475569', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {s.isOfficial ? '✓ 공식 기획사' : '글로벌 미디어'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#ffd700', fontWeight: 700 }}>
                      가중치 {s.reliabilityWeight}
                    </span>
                  </div>
                  <strong style={{ fontSize: '13px', color: '#f8fafc', display: 'block' }}>{s.name}</strong>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{s.agencyName}</span>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', wordBreak: 'break-all' }}>
                    🔗 {s.siteUrl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 탭 2: 뉴스 검수 */}
        {activeTab === 'news' && (
          <div>
            {pendingNews.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '30px 0' }}>검수 대기 중인 뉴스가 없습니다. (모두 승인 완료)</p>
            ) : (
              pendingNews.map(item => (
                <div key={item.newsId} style={{ background: '#161b26', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #283042' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#ffd700', fontWeight: 700 }}>출처: {item.sourceName || item.source}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>신뢰도 점수: {(item.verificationConfidence || 0.8) * 100}%</span>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#f8fafc' }}>{item.title || item.headline}</h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 12px 0' }}>{item.summary}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onApproveNews(item.newsId)}
                      style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✓ 승인 및 공개 피드 반영
                    </button>
                    <button
                      onClick={() => onRejectNews(item.newsId, rejectReason || '내용 불일치')}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ✕ 반려
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 탭 3: 한국어 학습 검수 */}
        {activeTab === 'lang' && (
          <div>
            {pendingLang.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '30px 0' }}>검수 대기 중인 한국어 학습 표현이 없습니다.</p>
            ) : (
              pendingLang.map(l => (
                <div key={l.contentId} style={{ background: '#161b26', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #283042' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#ffd700', fontSize: '1.2rem' }}>{l.koreanText || l.koreanPhrase}</h4>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>[{l.romanization || l.pronunciation}] 👉 {l.englishMeaning}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => onApproveLang(l.contentId)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>✓ 승인</button>
                    <button onClick={() => onRejectLang(l.contentId)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>✕ 반려</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 탭 4: 감사 로그 */}
        {activeTab === 'audit' && (
          <div>
            {auditLogs.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '30px 0' }}>감사 로그가 비어있습니다.</p>
            ) : (
              auditLogs.map(log => (
                <div key={log.logId} style={{ background: '#0b0e14', padding: '12px', borderRadius: '8px', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#ffd700' }}>[{log.timestamp}]</span> <strong>{log.articleTitle}</strong> — {log.detail}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};