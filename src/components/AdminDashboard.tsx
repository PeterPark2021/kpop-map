import React, { useState, useEffect } from 'react';
import { TourNewsFact, PipelineAuditLog, LanguageContentItem } from '../types/types';
import { LanguageContentCard } from './LanguageContentCard';

interface Props {
  newsList: TourNewsFact[];
  auditLogs: PipelineAuditLog[];
  languageItems: LanguageContentItem[];
  onApproveNews: (newsId: string) => void;
  onRejectNews: (newsId: string, reason: string) => void;
  onApproveLang: (contentId: string) => void;
  onRejectLang: (contentId: string) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kpop_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'news' | 'language' | 'audit'>('news');
  const [localNews, setLocalNews] = useState<TourNewsFact[]>(newsList);
  const [localLang, setLocalLang] = useState<LanguageContentItem[]>(languageItems);

  useEffect(() => {
    setLocalNews(newsList);
  }, [newsList]);

  useEffect(() => {
    setLocalLang(languageItems);
  }, [languageItems]);

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

  const handleLocalApproveNews = (newsId: string) => {
    setLocalNews(prev => prev.map(n => n.newsId === newsId ? { ...n, reviewStatus: 'approved' } : n));
    onApproveNews(newsId);
  };

  const handleLocalRejectNews = (newsId: string, reason: string) => {
    setLocalNews(prev => prev.map(n => n.newsId === newsId ? { ...n, reviewStatus: 'rejected', rejectionReason: reason } : n));
    onRejectNews(newsId, reason);
  };

  const handleLocalApproveLang = (contentId: string) => {
    setLocalLang(prev => prev.map(l => l.contentId === contentId ? { ...l, reviewStatus: 'approved' } : l));
    onApproveLang(contentId);
  };

  const handleLocalRejectLang = (contentId: string) => {
    setLocalLang(prev => prev.map(l => l.contentId === contentId ? { ...l, reviewStatus: 'rejected' } : l));
    onRejectLang(contentId);
  };

  const pendingNewsCount = localNews.filter(n => n.reviewStatus === 'pending').length;
  const pendingLangCount = localLang.filter(l => l.reviewStatus === 'pending').length;

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
        maxWidth: isAuthenticated ? '1080px' : '420px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid #283042',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
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
              🔒 K-POP 통합 관리자 콘솔
            </h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              뉴스 팩트 & 한국어 학습 콘텐츠 Stage 6 승인 대시보드
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#232a3d', color: '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕ 닫기
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handlePinSubmit} style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔐</div>
            <h3 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1.1rem' }}>
              관리자 인증 코드를 입력하세요
            </h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 20px 0' }}>
              인가된 운영자만 뉴스 및 학습 콘텐츠를 승인/반려할 수 있습니다.
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
            <button
              type="submit"
              style={{ width: '100%', background: '#eab308', color: '#000', fontWeight: 800, border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
            >
              인증 및 관리자 콘솔 열기
            </button>
          </form>
        ) : (
          <>
            {/* 3대 탭 네비게이션 */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1e2433', background: '#0e121a', padding: '0 24px' }}>
              <button
                onClick={() => setActiveTab('news')}
                style={{
                  padding: '14px 18px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'news' ? '2px solid #eab308' : '2px solid transparent',
                  color: activeTab === 'news' ? '#fef08a' : '#94a3b8',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                📋 뉴스 팩트 검수 ({pendingNewsCount})
              </button>
              <button
                onClick={() => setActiveTab('language')}
                style={{
                  padding: '14px 18px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'language' ? '2px solid #eab308' : '2px solid transparent',
                  color: activeTab === 'language' ? '#fef08a' : '#94a3b8',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🗣️ 한국어 학습 콘텐츠 ({pendingLangCount})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                style={{
                  padding: '14px 18px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'audit' ? '2px solid #eab308' : '2px solid transparent',
                  color: activeTab === 'audit' ? '#fef08a' : '#94a3b8',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🛡️ 표절 감사 로그 ({auditLogs.length})
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {activeTab === 'news' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {localNews.map((item) => (
                    <div key={item.newsId} style={{ background: '#161b26', padding: '16px', borderRadius: '10px', border: item.reviewStatus === 'pending' ? '1px solid #eab308' : '1px solid #232a3d' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ color: '#f8fafc' }}>{item.title}</strong>
                        <span style={{ fontSize: '11px', background: item.reviewStatus === 'approved' ? '#16a34a' : '#ca8a04', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.reviewStatus.toUpperCase()}
                        </span>
                      </div>
                      {item.reviewStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button onClick={() => handleLocalApproveNews(item.newsId)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>✓ 승인</button>
                          <button onClick={() => handleLocalRejectNews(item.newsId, '반려')} style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>✕ 반려</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'language' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {localLang.map((item) => (
                    <div key={item.contentId} style={{ background: '#161b26', padding: '18px', borderRadius: '12px', border: item.reviewStatus === 'pending' ? '1px solid #38bdf8' : '1px solid #232a3d' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: item.reviewStatus === 'approved' ? '#16a34a' : item.reviewStatus === 'rejected' ? '#e11d48' : '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                              {item.reviewStatus.toUpperCase()}
                            </span>
                            <strong style={{ color: '#f8fafc', fontSize: '1.2rem' }}>{item.koreanText}</strong>
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>[{item.romanization}]</span>
                          </div>
                          <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '6px' }}>
                            🇺🇸 {item.translations.en.term}: {item.translations.en.meaning}
                          </div>
                        </div>
                      </div>

                      {item.culturalNote && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', background: '#0d1017', padding: '8px 12px', borderRadius: '6px', marginTop: '8px' }}>
                          💡 <strong>문화 노트:</strong> {item.culturalNote}
                        </div>
                      )}

                      {item.reviewStatus === 'pending' && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', borderTop: '1px solid #232a3d', paddingTop: '10px' }}>
                          <button
                            onClick={() => handleLocalApproveLang(item.contentId)}
                            style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                          >
                            ✓ 승인 (공개 학습 피드 노출)
                          </button>
                          <button
                            onClick={() => handleLocalRejectLang(item.contentId)}
                            style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                          >
                            ✕ 반려 (비공개 처리)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'audit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {auditLogs.map(log => (
                    <div key={log.logId} style={{ background: '#161b26', padding: '14px', borderRadius: '8px' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '13px' }}>{log.articleTitle}</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>{log.detail}</p>
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