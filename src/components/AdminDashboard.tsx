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
    // 1. 대시보드 내부 상태 즉시 갱신
    setLocalNews(prev =>
      prev.map(n => (n.newsId === newsId ? { ...n, reviewStatus: 'approved' } : n))
    );
    // 2. 부모 및 서비스 계층으로 전파
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
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #1e2433',
          background: '#161b26'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚙️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
                K-POP 파이프라인 관리자 콘솔
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Stage 6 검수 대시보드 & n-gram 감사 로그 뷰어
              </span>
            </div>
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

        {/* 탭 네비게이션 */}
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
            🛡️ 8-gram 표절 감사 로그 ({auditLogs.length}건 기록)
          </button>
        </div>

        {/* 본문 영역 */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'review' ? (
            <div>
              {/* 필터 탭 */}
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
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    {status === 'pending' ? `🟡 검수 대기 (${pendingCount})` : status === 'approved' ? '🟢 승인됨' : status === 'rejected' ? '🔴 반려됨' : '전체'}
                  </button>
                ))}
              </div>

              {filteredNews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#141822', borderRadius: '12px' }}>
                  현재 선택된 상태의 항목이 없습니다.
                </div>
              ) : (
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
                          <strong style={{ color: '#f8fafc', fontSize: '1.05rem' }}>{item.title}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                            출처: {item.sourceName} ({item.sourceUrl})
                          </div>
                        </div>
                        <span style={{
                          background: item.reviewStatus === 'approved' ? '#16a34a' : item.reviewStatus === 'rejected' ? '#e11d48' : '#ca8a04',
                          color: '#fff',
                          padding: '3px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {item.reviewStatus.toUpperCase()}
                        </span>
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
                            onClick={() => handleLocalReject(item.newsId, '사실 확인 불명확 / 출처 신뢰도 낮음')}
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
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
                🛡️ AI 요약 파이프라인에서 8연속 단어 일치 표절 탐지 및 재시도 실행 기록을 실시간으로 추적합니다.
              </p>
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

                    {log.detectedOverlapSnippet && (
                      <div style={{ marginTop: '8px', background: '#0a0d14', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #e11d48', color: '#fca5a5', fontSize: '12px' }}>
                        <strong>감지된 일치 구문:</strong> "{log.detectedOverlapSnippet}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};