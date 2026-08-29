import { useState, useEffect, useMemo } from 'react';
import { allArtistsCatalog, btsTourEvents, blackpinkTourEvents, seventeenTourEvents, strayKidsTourEvents } from './data/artistsCatalog';
import { initialBigBangTourEvents, sampleNewsFacts, sampleAuditLogs } from './data/initialData';
import { sampleLanguageContents } from './data/sampleLanguageContent';
import { tourService } from './services/tourService';
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
import { TourEvent, TourNewsFact, PipelineAuditLog, LanguageContentItem } from './types/types';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const { events: gdEvents, updateStatus } = useTourEvents();
  const [selectedArtistId, setSelectedArtistId] = useState<string>('bigbang-gd');
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [allNews, setAllNews] = useState<TourNewsFact[]>(sampleNewsFacts);
  const [allLangContent, setAllLangContent] = useState<LanguageContentItem[]>(sampleLanguageContents);
  const [auditLogs] = useState<PipelineAuditLog[]>(sampleAuditLogs);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Firestore languageContent 실시간 구독
  useEffect(() => {
    const unsub = tourService.subscribeToLanguageContent((items) => {
      if (items && items.length > 0) {
        setAllLangContent(items);
      }
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
            ● 5대 메가 아티스트 글로벌 월드투어 & 한국어 학습 네트워크
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsAdminOpen(true)}
            style={{
              background: '#1e2433',
              color: '#ffd700',
              border: '1px solid #ca8a04',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            ⚙️ 관리자 콘솔 ({totalPending})
          </button>
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={setCurrentLang} />
        </div>
      </header>

      {/* 5대 아티스트 셀렉터 바 */}
      <ArtistSelector
        artists={allArtistsCatalog}
        selectedArtistId={selectedArtistId}
        lang={currentLang}
        onSelectArtist={(id) => {
          setSelectedArtistId(id);
          setViewMode('anchor');
        }}
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