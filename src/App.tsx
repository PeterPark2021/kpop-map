import { useState, useEffect } from 'react';
import { gdArtistProfile, sampleNewsFacts, sampleAuditLogs } from './data/initialData';
import { useTourEvents } from './hooks/useTourEvents';
import { useNewsFacts } from './hooks/useNewsFacts';
import { useLanguage } from './hooks/useLanguage';
import { GdAnchorHero } from './components/GdAnchorHero';
import { WorldTourMap } from './components/WorldTourMap';
import { NewsFactFeed } from './components/NewsFactFeed';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AdminDashboard } from './components/AdminDashboard';
import { TourEvent, TourNewsFact, PipelineAuditLog } from './types/types';

export default function App() {
  const { currentLang, setCurrentLang } = useLanguage('ko');
  const { events, updateStatus } = useTourEvents();
  const { news } = useNewsFacts('bigbang-gd', currentLang);
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 관리자 대시보드 상태 (sampleNewsFacts로 즉시 초기화)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [allNews, setAllNews] = useState<TourNewsFact[]>(sampleNewsFacts);
  const [auditLogs] = useState<PipelineAuditLog[]>(sampleAuditLogs);

  // 훅에서 새로운 뉴스가 들어올 때 상태 동기화 (기존 검수 변경점 유지)
  useEffect(() => {
    if (news.length > 0) {
      setAllNews((prev) => {
        const reviewStatusMap = new Map(prev.map((n) => [n.newsId, n.reviewStatus]));
        return news.map((n) => ({
          ...n,
          reviewStatus: reviewStatusMap.get(n.newsId) || n.reviewStatus || 'approved'
        }));
      });
    }
  }, [news]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  // Stage 6 검수 승인 처리
  const handleApproveNews = (newsId: string) => {
    setAllNews((prev) =>
      prev.map((n) => (n.newsId === newsId ? { ...n, reviewStatus: 'approved' } : n))
    );
    showToast('✓ 해당 뉴스 팩트가 승인되어 공개 피드에 노출됩니다!');
  };

  // Stage 6 검수 반려 처리
  const handleRejectNews = (newsId: string, reason: string) => {
    setAllNews((prev) =>
      prev.map((n) => (n.newsId === newsId ? { ...n, reviewStatus: 'rejected', rejectionReason: reason } : n))
    );
    showToast('✕ 해당 뉴스 팩트가 반려 처리되었습니다.');
  };

  // 현재 언어에 맞는 뉴스 중 '승인된(approved)' 팩트만 필터링
  const targetLang = currentLang === 'sea' ? 'en' : currentLang;
  const approvedNews = allNews.filter(
    (n) => n.reviewStatus === 'approved' && (n.language === targetLang || n.language === 'ko')
  );

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

      {/* 관리자 모달 */}
      {isAdminOpen && (
        <AdminDashboard
          newsList={allNews}
          auditLogs={auditLogs}
          onApprove={handleApproveNews}
          onReject={handleRejectNews}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
            ● Google Cloud Firestore Live Connected
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
            ⚙️ 관리자 콘솔 ({allNews.filter(n => n.reviewStatus === 'pending').length})
          </button>
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={setCurrentLang} />
        </div>
      </header>

      {viewMode === 'anchor' && (
        <GdAnchorHero
          profile={gdArtistProfile}
          lang={currentLang}
          onExploreAll={() => setViewMode('all')}
        />
      )}

      <WorldTourMap
        events={events}
        lang={currentLang}
        onSelectEvent={handleStatusToggle}
      />

      <NewsFactFeed news={approvedNews} />
    </div>
  );
}