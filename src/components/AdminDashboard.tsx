import React, { useState, useEffect } from 'react';
import { TourNewsFact, PipelineAuditLog } from '../types/types';

interface Props {
  newsList: TourNewsFact[];
  auditLogs: PipelineAuditLog[];
  onApprove: (newsId: string) => void;
  onReject: (newsId: string, reason: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  newsList,
  auditLogs,
  onApprove,
  onReject,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'audit'>('review');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [localNews, setLocalNews] = useState<TourNewsFact[]>(newsList);

  useEffect(() => {
    setLocalNews(newsList);
  }, [newsList]);

  const handleLocalApprove = (newsId: string) => {
    setLocalNews(prev =>
      prev.map(n => (n.newsId === newsId ? { ...n, reviewStatus: 'approved' } : n))
    );
    onApprove(newsId);
  };

  const handleLocalReject = (newsId: string, reason: string) => {
    setLocalNews(prev =>
      prev.map(n => (n.newsId === newsId ? { ...n, reviewStatus: 'rejected', rejectionReason: reason } : n))
    );
    onReject(newsId, reason);
  };

  const pendingCount = localNews.filter(n => n.reviewStatus === 'pending').length;
  const filteredNews = localNews.filter((n) => {
    if (filterStatus === 'all') return true;
    return n.reviewStatus === filterStatus;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#11151f',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid #283042',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #1e2433',
          background: '#161b26'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
              ⚙️ K-POP 파이프라인 관리자 콘솔
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Stage 6 검수 대시보드 & n-gram 감사 로그
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#232a3d',
              color: '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ✕ 닫기
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #1e2433', background: '#0e121a', padding: '0 24px' }}>
          <button
            onClick={() => setActiveTab('review')}
            style={{
              padding: '14px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'review' ? '2px solid #eab308' : '2px solid transparent',
              color: activeTab === 'review' ? '#fef08a' : '#94a3b8',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📋 뉴스 팩트 검수 큐 ({pendingCount}건 대기)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '14px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'audit' ? '2px solid #eab308' : '2px solid transparent',
              color: activeTab === 'audit' ? '#fef08a' : '#94a3b8',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🛡️ 8-gram 표절 감사 로그 ({auditLogs.length}건)
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'review' ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    style={{
                      background: filterStatus === status ? '#eab308' : '#181d2a',
                      color: filterStatus === status ? '#000' : '#94a3b8',
                      border: '1px solid #283042',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 700
                    }}
                  >
                    {status === 'pending' ? `🟡 검수 대기 (${pendingCount})` : status === 'approved' ? '🟢 승인됨' : status === 'rejected' ? '🔴 반려됨' : '전체'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredNews.map((item) => (
                  <div
                    key={item.newsId}
                    style={{
                      background: '#161b26',
                      padding: '18px',
                      borderRadius: '12px',
                      border: item.reviewStatus === 'pending' ? '1px solid #eab308' : '1px solid #232a3d'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: item.reviewStatus === 'approved' ? '#16a34a' : item.reviewStatus === 'rejected' ? '#e11d48' : '#ca8a04',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {item.reviewStatus === 'approved' ? '✓ 승인 완료' : item.reviewStatus === 'rejected' ? '✕ 반려됨' : '● 검수 대기'}
                          </span>
                          <strong style={{ color: '#f8fafc', fontSize: '1.05rem' }}>{item.title}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                          출처: {item.sourceName} ({item.sourceUrl})
                        </div>
                      </div>
                    </div>

                    <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
                      {item.factSummary.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>

                    {item.reviewStatus === 'pending' && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', borderTop: '1px solid #232a3d', paddingTop: '12px' }}>
                        <button
                          onClick={() => handleLocalApprove(item.newsId)}
                          style={{
                            background: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}
                        >
                          ✓ 승인 (공개 피드에 즉시 노출)
                        </button>
                        <button
                          onClick={() => handleLocalReject(item.newsId, '사실 확인 불명확')}
                          style={{
                            background: '#e11d48',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}
                        >
                          ✕ 반려 (비공개 차단)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.logId}
                  style={{
                    background: '#161b26',
                    padding: '16px',
                    borderRadius: '10px',
                    border: log.status === 'BLOCKED_NGRAM' ? '1px solid #e11d48' : '1px solid #232a3d'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      background: log.status === 'SUCCESS' ? '#16a34a' : log.status === 'BLOCKED_NGRAM' ? '#e11d48' : '#3b82f6',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}>
                      {log.status}
                    </span>
                    <small style={{ color: '#64748b' }}>{new Date(log.timestamp).toLocaleString()}</small>
                  </div>
                  <strong style={{ color: '#f1f5f9', fontSize: '14px' }}>{log.articleTitle}</strong>
                  <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '13px' }}>{log.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};