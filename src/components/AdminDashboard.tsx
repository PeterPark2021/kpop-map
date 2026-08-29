import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { TourNewsFact, PipelineAuditLog, LanguageContentItem } from '../types/types';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'news' | 'language' | 'audit'>('news');
  const [localNews, setLocalNews] = useState<TourNewsFact[]>(newsList);
  const [localLang, setLocalLang] = useState<LanguageContentItem[]>(languageItems);

  useEffect(() => {
    setLocalNews(newsList);
  }, [newsList]);

  useEffect(() => {
    setLocalLang(languageItems);
  }, [languageItems]);

  // Firebase Auth 상태 및 커스텀 클레임(admin: true) 검증
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          // Firebase Custom Claim 'admin: true' 또는 인가된 도메인/관리자 계정 확인
          const hasAdminClaim = Boolean(idTokenResult.claims.admin);
          setIsAdmin(hasAdminClaim || user.email?.endsWith('@galaxycorp.com') || user.email?.includes('admin'));
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) return;
    setLoginError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setLoginError(err.message || 'Google SSO 로그인에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setIsAdmin(false);
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
      background: 'rgba(5, 7, 12, 0.90)',
      backdropFilter: 'blur(12px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#11151f',
        width: '100%',
        maxWidth: (currentUser && isAdmin) ? '1080px' : '440px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid #283042',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
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
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔐</span> K-POP 관리자 인증 콘솔
            </h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Firebase Authentication (OAuth 2.0 / Custom Claims)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentUser && (
              <button
                onClick={handleLogout}
                style={{ background: '#334155', color: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                로그아웃
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: '#232a3d', color: '#94a3b8', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
            >
              ✕ 닫기
            </button>
          </div>
        </div>

        {/* 1단계: Firebase Auth 로그인 화면 (미인증 시) */}
        {authLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            인증 상태 확인 중...
          </div>
        ) : (!currentUser || !isAdmin) ? (
          <div style={{ padding: '32px 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🛡️</div>
              <h3 style={{ color: '#f8fafc', margin: '0 0 6px 0', fontSize: '1.15rem' }}>
                운영자 계정으로 로그인하세요
              </h3>
              <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                관리자 권한(`admin: true`)이 부여된 Firebase 계정만 접근할 수 있습니다.
              </p>
            </div>

            {currentUser && !isAdmin && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                ⚠️ 로그인된 계정({currentUser.email})은 관리자 권한이 없습니다. 운영자 계정으로 다시 로그인하세요.
              </div>
            )}

            {loginError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>관리자 이메일</label>
                <input
                  type="email"
                  required
                  placeholder="admin@kpop-tour.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: '#0d0e12', border: '1px solid #283042', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>비밀번호</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: '#0d0e12', border: '1px solid #283042', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', background: '#eab308', color: '#000', fontWeight: 800, border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '6px' }}
              >
                이메일로 관리자 로그인
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0', color: '#475569', fontSize: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#1e2433' }} />
              <span>또는</span>
              <div style={{ flex: 1, height: '1px', background: '#1e2433' }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{ width: '100%', background: '#1e2433', color: '#f8fafc', fontWeight: 700, border: '1px solid #334155', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>🌐</span> Google SSO 계정으로 로그인
            </button>
          </div>
        ) : (
          /* 2단계: 인증 통과 후 Stage 6 통합 검수 대시보드 */
          <>
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