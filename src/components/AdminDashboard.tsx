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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kpop_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'review' | 'audit'>('review');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [localNews, setLocalNews] = useState<TourNewsFact[]>(newsList);

  useEffect(() => {
    setLocalNews(newsList);
  }, [newsList]);

  // 관리자 PIN 인증 처리 (기본 마스터 PIN: 2026)
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('kpop_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

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
      background: 'rgba(5, 7, 12, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#11151f',
        width: '100%',
        maxWidth: isAuthenticated ? '1000px' : '420px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid #283042',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid #1e2433',
          background: '#161b26'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
              🔒 K-POP 관리자 보안 콘솔
            </h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {isAuthenticated ? '관리자 인증 완료 (Authorized Session)' : '보안 접근 통제 구역'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#232a3d',
              color: '#94a3b8',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ✕ 닫기
          </button>
        </div>

        {/* 1단계: PIN 인증 게이트 (미인증 시) */}
        {!isAuthenticated ? (
          <form onSubmit={handlePinSubmit} style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔐</div>
            <h3 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>
              관리자 인증 코드를 입력하세요
            </h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 20px 0' }}>
              인가된 운영자만 뉴스 검수 및 감사 로그에 접근할 수 있습니다.
            </p>

            <input
              type="password"
              placeholder="보안 PIN 코드 입력 (기본: 2026)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 16px',
                background: '#0d0e12',
                border: pinError ? '1px solid #ef4444' : '1px solid #283042',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                textAlign: 'center',
                letterSpacing: '4px',
                outline: 'none',
                marginBottom: '12px'
              }}
            />

            {pinError && (
              <div style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>
                ⚠️ 잘못된 관리자 PIN 코드입니다. 다시 시도하세요.
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#eab308',
                color: '#000',
                fontWeight: 800,
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              인증 및 관리자 콘솔 열기
            </button>
          </form>
        ) : (
          /* 2단계: 인증 통과 후 실제 검수 및 감사 화면 */
          <>
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
          </>
        )}
      </div>
    </div>
  );
};