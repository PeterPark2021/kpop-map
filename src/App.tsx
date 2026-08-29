import { useState, useEffect, useMemo } from 'react';
import { allArtistsCatalog, btsTourEvents, blackpinkTourEvents, seventeenTourEvents, strayKidsTourEvents } from './data/artistsCatalog';
import { initialBigBangTourEvents, sampleNewsFacts, sampleAuditLogs } from './data/initialData';
import { sampleLanguageContents } from './data/sampleLanguageContent';
import { tourService } from './services/tourService';
import { userService } from './services/userService';
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
  const { events: gdEvents, updateStatus } = useTourEvents();
  const [selectedArtistId, setSelectedArtistId] = useState<string>('bigbang-gd');
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 일반 사용자 상태 & 모달 제어
  const [userProfile, setUserProfile] = useState<UserProfile | null>(userService.getCurrentProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [filterOnlyFavorites, setFilterOnlyFavorites] = useState(false);

  const [allNews, setAllNews] = useState<TourNewsFact[]>(sampleNewsFacts);
  const [allLangContent, setAllLangContent] = useState<LanguageContentItem[]>(sampleLanguageContents);
  const [auditLogs] = useState<PipelineAuditLog[]>(sampleAuditLogs);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenProfileModal = () => {
    if (!userProfile) {
      userService.loginDemoUser('K-POP 열정팬');
    }
    setIsProfileModalOpen(true);
  };

  const handleToggleFavorite = async (artistId: string) => {
    if (!userProfile) {
      userService.loginDemoUser('K-POP 열정팬');
    }
    const isNowFav = await userService.toggleFavoriteArtist(artistId);
    showToast(isNowFav ? '⭐ 관심 아티스트로 등록되었습니다!' : '관심 아티스트 등록이 해제되었습니다.');
  };

  const currentProfile = useMemo(() => {
    return allArtistsCatalog.find(a => a.artistId === selectedArtistId) || allArtistsCatalog[0];
  }, [selectedArtistId]);

  const currentEvents = useMemo(() => {
    if (selectedArtistId === 'bts') return btsTourEvents;
    if (selectedArtistId === 'blackpink') return blackpinkTourEvents;
    if (selectedArtistId === 'seventeen') return seventeenTourEvents;
    if (selectedArtistId === 'stray-kids') return strayKidsTourEvents;
    return gdEvents.length > 0 ? gdEvents : initialBigBangTourEvents;
  }, [selectedArtistId, gdEvents]);

  const handleStatusToggle = async (selectedEv: TourEvent) => {
    const nextStatus: TourEvent['status'] =
      selectedEv.status === 'ticketOpen'
        ? 'inProgress'
        : selectedEv.status === 'inProgress'
        ? 'completed'
        : 'ticketOpen';

    const statusName =
      nextStatus === 'ticketOpen' ? '티켓 오픈' : nextStatus === 'inProgress' ? '공연 진행중 (LIVE)' : '공연 종료';

    const cityName = selectedEv.city[currentLang] || selectedEv.city.en;
    showToast(`⚡ [${cityName}] 상태가 '${statusName}'(으)로 실시간 변경되었습니다!`);
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
          background: '#059669',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: 700,
          fontSize: '14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 9999,
          border: '1px solid #34d399'
        }}>
          {toastMessage}
        </div>
      )}

      {/* 일반 사용자 로그인/회원가입 모달 */}
      {isAuthModalOpen && (
        <UserAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => showToast('🎉 로그인되었습니다!')}
        />
      )}

      {/* 마이페이지 & 티켓 오픈 알림 설정 모달 */}
      {isProfileModalOpen && (
        <UserProfileModal
          profile={userProfile || userService.loginDemoUser('K-POP 열정팬')}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* 관리자 콘솔 */}
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
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
            ● 5대 메가 아티스트 글로벌 월드투어 & 실시간 티켓 알림
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 마이페이지 & 알림 설정 버튼 (상시 노출) */}
          <button
            onClick={handleOpenProfileModal}
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
            <span>🔔</span> {userProfile ? `${userProfile.displayName}` : '마이페이지 / 알림 설정'}
          </button>

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

      {/* 🌟 메인 화면 중앙: 티켓 오픈 실시간 알림 & 마이페이지 전용 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #182030 0%, #101520 100%)',
        border: '1px solid #ffd70055',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(234, 179, 8, 0.2)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🔔
          </div>
          <div>
            <strong style={{ color: '#ffd700', fontSize: '15px', display: 'block' }}>
              관심 아티스트 티켓 오픈 실시간 이메일 알림
            </strong>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
              {userProfile?.notificationPrefs.emailEnabled
                ? '✓ 현재 이메일 알림이 [활성화] 상태입니다. 티켓팅 오픈 즉시 알림이 발송됩니다.'
                : '티켓팅 시작 1분 전 놓치지 않도록 이메일 알림을 설정하세요! (수신 동의 필수)'}
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenProfileModal}
          style={{
            background: 'linear-gradient(135deg, #ffd700, #eab308)',
            color: '#000',
            fontWeight: 900,
            border: 'none',
            padding: '10px 20px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '13px',
            boxShadow: '0 0 16px rgba(255, 215, 0, 0.4)',
            transition: 'transform 0.15s ease'
          }}
        >
          ⚙️ 마이페이지 & 티켓 알림 설정 열기
        </button>
      </div>

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

      {/* 콘서트 필수 표현 미니 위젯 */}
      <ConcertPhraseWidget items={allLangContent} lang={currentLang} />

      {viewMode === 'anchor' && (
        <GdAnchorHero
          profile={currentProfile}
          lang={currentLang}
          onExploreAll={() => setViewMode('all')}
        />
      )}

      <WorldTourMap
        events={currentEvents}
        lang={currentLang}
        onSelectEvent={handleStatusToggle}
      />

      <NewsFactFeed news={approvedNews} />

      {/* 한국어 팬덤 & 공연 표현 학습 피드 */}
      <LanguageContentFeed
        items={allLangContent}
        currentLanguage={currentLang}
      />
    </div>
  );
}