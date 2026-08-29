import { useState, useEffect, useMemo } from 'react';
import { allArtistsCatalog } from './data/artistsCatalog';
import { sampleNewsFacts } from './data/initialData';
import { sampleLanguageContents } from './data/sampleLanguageContent';
import { tourService } from './services/tourService';
import { userService } from './services/userService';
import { verifyUnsubscribeToken } from './utils/tokenSigner';
import { useTourEvents } from './hooks/useTourEvents';
import { useLanguage } from './hooks/useLanguage';
import { GdAnchorHero } from './components/GdAnchorHero';
import { WorldTourMap } from './components/WorldTourMap';
import { NewsFactFeed } from './components/NewsFactFeed';
import { LanguageContentFeed } from './components/LanguageContentFeed';
import { ConcertPhraseWidget } from './components/ConcertPhraseWidget';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AdminDashboard } from './components/AdminDashboard';
import { ArtistSelector } from './components/ArtistSelector';
import { UserAuthModal } from './components/UserAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { TourEvent, TourNewsFact, PipelineAuditLog, LanguageContentItem, UserProfile } from './types/types';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const [selectedArtistId, setSelectedArtistId] = useState<string>('bigbang-gd');
  const { events: liveEvents, updateStatus } = useTourEvents(selectedArtistId);
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(userService.getCurrentProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [filterOnlyFavorites, setFilterOnlyFavorites] = useState(false);

  const [allNews, setAllNews] = useState<TourNewsFact[]>(sampleNewsFacts);
  const [allLangContent, setAllLangContent] = useState<LanguageContentItem[]>(sampleLanguageContents);
  const [auditLogs] = useState<PipelineAuditLog[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        const result = verifyUnsubscribeToken(token);
        if (result.valid && result.uid) {
          userService.unsubscribeByToken(result.uid).then(() => {
            showToast('✓ [보안 인증 완료] 이메일 알림 수신거부 처리가 안전하게 완료되었습니다.');
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    const unsubLang = tourService.subscribeToLanguageContent((items) => {
      if (items && items.length > 0) setAllLangContent(items);
    });
    const unsubUser = userService.subscribe((profile) => {
      setUserProfile(profile);
    });
    return () => {
      unsubLang();
      unsubUser();
    };
  }, []);

  const handleOpenProfileModal = () => {
    if (!userProfile) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsProfileModalOpen(true);
  };

  const handleToggleFavorite = async (artistId: string) => {
    if (!userProfile) {
      setIsAuthModalOpen(true);
      return;
    }
    const isNowFav = await userService.toggleFavoriteArtist(artistId);
    showToast(isNowFav ? '⭐ 관심 아티스트로 등록되었습니다!' : '관심 아티스트 등록이 해제되었습니다.');
  };

  const currentProfile = useMemo(() => {
    return allArtistsCatalog.find(a => a.artistId === selectedArtistId) || allArtistsCatalog[0];
  }, [selectedArtistId]);

  const handleStatusToggle = async (selectedEv: TourEvent) => {
    const nextStatus: TourEvent['status'] =
      selectedEv.status === 'ticketOpen'
        ? 'inProgress'
        : selectedEv.status === 'inProgress'
        ? 'completed'
        : 'ticketOpen';

    const statusName =
      nextStatus === 'ticketOpen' ? '티켓 오픈' : nextStatus === 'inProgress' ? '공연 진행중 (LIVE)' : '공연 종료';

    const cityName = selectedEv.city[currentLang] || selectedEv.city.en || 'City';
    showToast(`⚡ [${cityName}] Firestore 실시간 상태가 '${statusName}'(으)로 동기화되었습니다!`);
    await updateStatus(selectedEv.eventId, nextStatus);
  };

  const handleApproveNews = async (newsId: string) => {
    await tourService.updateNewsReviewStatus(newsId, 'approved');
    setAllNews(prev => prev.map(n => n.newsId === newsId ? { ...n, reviewStatus: 'approved' } : n));
    showToast('✓ 해당 뉴스 팩트가 승인되어 공개 피드에 노출됩니다!');
  };

  const handleRejectNews = async (newsId: string, reason: string) => {
    await tourService.updateNewsReviewStatus(newsId, 'rejected', reason);
    setAllNews(prev => prev.map(n => n.newsId === newsId ? { ...n, reviewStatus: 'rejected', rejectionReason: reason } : n));
    showToast('✕ 해당 뉴스 팩트가 반려 처리되었습니다.');
  };

  const handleApproveLang = async (contentId: string) => {
    await tourService.updateLanguageReviewStatus(contentId, 'approved');
    setAllLangContent(prev => prev.map(l => l.contentId === contentId ? { ...l, reviewStatus: 'approved' } : l));
    showToast('✓ 한국어 학습 표현이 승인되어 피드에 노출됩니다!');
  };

  const handleRejectLang = async (contentId: string) => {
    await tourService.updateLanguageReviewStatus(contentId, 'rejected');
    setAllLangContent(prev => prev.map(l => l.contentId === contentId ? { ...l, reviewStatus: 'rejected' } : l));
    showToast('✕ 해당 한국어 학습 표현이 반려되었습니다.');
  };

  const targetLang = currentLang === 'sea' ? 'en' : currentLang;
  const approvedNews = allNews.filter(
    (n) => n.reviewStatus === 'approved' &&
           (n.artistId === selectedArtistId || selectedArtistId === 'bigbang-gd') &&
           (n.language === targetLang || n.language === 'ko')
  );

  const totalPending =
    allNews.filter(n => n.reviewStatus === 'pending').length +
    allLangContent.filter(l => l.reviewStatus === 'pending').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toastMessage.includes('⚠️') ? '#dc2626' : '#059669',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: 700,
          fontSize: '14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 99999,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {toastMessage}
        </div>
      )}

      {isAuthModalOpen && (
        <UserAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => showToast('🎉 로그인이 완료되었습니다.')}
        />
      )}

      {isProfileModalOpen && userProfile && (
        <UserProfileModal
          profile={userProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isAdminOpen && (
        <AdminDashboard
          newsList={allNews}
          auditLogs={auditLogs}
          languageItems={allLangContent}
          onApproveNews={handleApproveNews}
          onRejectNews={handleRejectNews}
          onApproveLang={handleApproveLang}
          onRejectLang={handleRejectLang}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* 상단 네비게이션 헤더 */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>
            ● FIRESTORE LIVE CONNECTED · 5대 메가 아티스트 실시간 월드투어 스트리밍 중
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {userProfile ? (
            <>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                style={{
                  background: '#1e2433',
                  color: '#ffd700',
                  border: '1px solid #ca8a04',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🔔</span> {userProfile.displayName}
              </button>
              <button
                onClick={() => {
                  userService.logout();
                  showToast('로그아웃되었습니다.');
                }}
                style={{
                  background: '#121622',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #ffd700, #eab308)',
                color: '#000',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)'
              }}
            >
              <span>🔑</span> 로그인 / 회원가입 (만 14세+)
            </button>
          )}

          <button
            onClick={() => setIsAdminOpen(true)}
            style={{
              background: '#121622',
              color: '#94a3b8',
              border: '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ⚙️ 관리자 ({totalPending})
          </button>
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={setCurrentLang} />
        </div>
      </header>

      {/* 5대 아티스트 셀렉터 & 팔로우 필터 바 */}
      <ArtistSelector
        artists={allArtistsCatalog}
        selectedArtistId={selectedArtistId}
        lang={currentLang}
        favoriteArtistIds={userProfile?.favoriteArtistIds || []}
        filterOnlyFavorites={filterOnlyFavorites}
        onSelectArtist={(id) => {
          setSelectedArtistId(id);
          setViewMode('anchor');
        }}
        onToggleFavorite={handleToggleFavorite}
        onToggleFilterFavorites={() => setFilterOnlyFavorites(!filterOnlyFavorites)}
      />

      <ConcertPhraseWidget items={allLangContent} lang={currentLang} />

      {viewMode === 'anchor' && (
        <GdAnchorHero
          profile={currentProfile}
          lang={currentLang}
          onExploreAll={() => setViewMode('all')}
        />
      )}

      {/* 실시간 Firestore onSnapshot 데이터 바인딩 */}
      <WorldTourMap
        events={liveEvents}
        lang={currentLang}
        onSelectEvent={handleStatusToggle}
      />

      <NewsFactFeed news={approvedNews} />

      <LanguageContentFeed
        items={allLangContent}
        currentLanguage={currentLang}
      />
    </div>
  );
}