import { useState, useEffect, useMemo } from 'react';
import { allArtistsCatalog, btsTourEvents, blackpinkTourEvents, seventeenTourEvents, strayKidsTourEvents } from './data/artistsCatalog';
import { initialBigBangTourEvents, sampleNewsFacts, sampleAuditLogs } from './data/initialData';
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
  const { events: gdEvents, updateStatus } = useTourEvents();
  const [selectedArtistId, setSelectedArtistId] = useState<string>('bigbang-gd');
  const [viewMode, setViewMode] = useState<'anchor' | 'all'>('anchor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(userService.getCurrentProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [filterOnlyFavorites, setFilterOnlyFavorites] = useState(false);

  const [allNews, setAllNews] = useState<TourNewsFact[]>(sampleNewsFacts);
  const [allLangContent, setAllLangContent] = useState<LanguageContentItem[]>(sampleLanguageContents);
  const [auditLogs] = useState<PipelineAuditLog[]>(sampleAuditLogs);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ?뵏 ?쒕챸???섏떊嫄곕? ?좏겙 寃利??몃뱾??  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const legacyUid = params.get('uid');

      if (token) {
        const result = verifyUnsubscribeToken(token);
        if (result.valid && result.uid) {
          userService.unsubscribeByToken(result.uid).then(() => {
            showToast('??[蹂댁븞 ?몄쬆 ?꾨즺] ?대찓???뚮┝ ?섏떊嫄곕? 泥섎━媛 ?덉쟾?섍쾶 ?꾨즺?섏뿀?듬땲??');
          });
        } else {
          showToast(`?좑툘 [?섏떊嫄곕? ?ㅽ뙣] ?좏슚?섏? ?딄굅??蹂議곕맂 ?좏겙?낅땲?? (${result.error})`);
        }
      } else if (legacyUid) {
        showToast('?좑툘 蹂댁븞 ?뺤콉 媛뺥솕濡??명빐 ?댁쟾 ?뺤떇???섏떊嫄곕? 留곹겕??留뚮즺?섏뿀?듬땲?? 留덉씠?섏씠吏?먯꽌 ?ㅼ젙??蹂寃쏀븯?몄슂.');
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
    showToast(isNowFav ? '狩?愿???꾪떚?ㅽ듃濡??깅줉?섏뿀?듬땲??' : '愿???꾪떚?ㅽ듃 ?깅줉???댁젣?섏뿀?듬땲??');
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
      nextStatus === 'ticketOpen' ? '?곗폆 ?ㅽ뵂' : nextStatus === 'inProgress' ? '怨듭뿰 吏꾪뻾以?(LIVE)' : '怨듭뿰 醫낅즺';

    const cityName = selectedEv.city[currentLang] || selectedEv.city.en;
    showToast(`??[${cityName}] ?곹깭媛 '${statusName}'(??濡??ㅼ떆媛?蹂寃쎈릺?덉뒿?덈떎!`);
    await updateStatus(selectedEv.eventId, nextStatus);
  };

  const handleApproveNews = async (newsId: string) => {
    await tourService.updateNewsReviewStatus(newsId, 'approved');
    setAllNews(prev => prev.map(n => n.newsId === newsId ? { ...n, reviewStatus: 'approved' } : n));
    showToast('???대떦 ?댁뒪 ?⑺듃媛 ?뱀씤?섏뼱 怨듦컻 ?쇰뱶???몄텧?⑸땲??');
  };

  const handleRejectNews = async (newsId: string, reason: string) => {
    await tourService.updateNewsReviewStatus(newsId, 'rejected', reason);
    setAllNews(prev => prev.map(n => n.newsId === newsId ? { ...n, reviewStatus: 'rejected', rejectionReason: reason } : n));
    showToast('???대떦 ?댁뒪 ?⑺듃媛 諛섎젮 泥섎━?섏뿀?듬땲??');
  };

  const handleApproveLang = async (contentId: string) => {
    await tourService.updateLanguageReviewStatus(contentId, 'approved');
    setAllLangContent(prev => prev.map(l => l.contentId === contentId ? { ...l, reviewStatus: 'approved' } : l));
    showToast('???쒓뎅???숈뒿 ?쒗쁽???뱀씤?섏뼱 ?쇰뱶???몄텧?⑸땲??');
  };

  const handleRejectLang = async (contentId: string) => {
    await tourService.updateLanguageReviewStatus(contentId, 'rejected');
    setAllLangContent(prev => prev.map(l => l.contentId === contentId ? { ...l, reviewStatus: 'rejected' } : l));
    showToast('???대떦 ?쒓뎅???숈뒿 ?쒗쁽??諛섎젮?섏뿀?듬땲??');
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
          background: toastMessage.includes('?좑툘') ? '#dc2626' : '#059669',
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

      {/* ?쇰컲 ?ъ슜??濡쒓렇???뚯썝媛??紐⑤떖 (留?14??寃뚯씠???ы븿) */}
      {isAuthModalOpen && (
        <UserAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => showToast('?럦 ?섏쁺?⑸땲?? 濡쒓렇?몄씠 ?꾨즺?섏뿀?듬땲??')}
        />
      )}

      {/* 留덉씠?섏씠吏 & ?곗폆 ?ㅽ뵂 ?뚮┝ ?ㅼ젙 紐⑤떖 */}
      {isProfileModalOpen && userProfile && (
        <UserProfileModal
          profile={userProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* 愿由ъ옄 肄섏넄 */}
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

      {/* ?곷떒 ?ㅻ퉬寃뚯씠???ㅻ뜑 */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#f8fafc', fontWeight: 800 }}>
            K-POP TOUR PULSE
          </h1>
          <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
            ??5? 硫붽? ?꾪떚?ㅽ듃 湲濡쒕쾶 ?붾뱶?ъ뼱 & ?ㅼ떆媛??곗폆 ?뚮┝
          </span>
        </div>

        {/* ?곷떒 ?≪뀡 踰꾪듉 洹몃９ (濡쒓렇??/ 留덉씠?섏씠吏 / 愿由ъ옄 / ?몄뼱) */}
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
                <span>?뵒</span> {userProfile.displayName} (留덉씠?섏씠吏)
              </button>
              <button
                onClick={() => {
                  userService.logout();
                  showToast('濡쒓렇?꾩썐?섏뿀?듬땲??');
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
                濡쒓렇?꾩썐
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
              <span>?뵎</span> 濡쒓렇??/ ?뚯썝媛??(留?14??)
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
            ?숋툘 愿由ъ옄 ({totalPending})
          </button>
          <LanguageSwitcher currentLang={currentLang} onLanguageChange={setCurrentLang} />
        </div>
      </header>

      {/* 硫붿씤 ?붾㈃ 以묒븰: ?곗폆 ?뚮┝ 諛곕꼫 */}
      <div style={{
        background: 'linear-gradient(135deg, #182030 0%, #101520 100%)',
        border: '1px solid #ffd70055',
        borderRadius: '16px',
          gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '28px', background: 'rgba(234, 179, 8, 0.2)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ?뵒
          </div>
          <div>
            <strong style={{ color: '#ffd700', fontSize: '15px', display: 'block' }}>
              愿???꾪떚?ㅽ듃 ?곗폆 ?ㅽ뵂 ?ㅼ떆媛??대찓???뚮┝
            </strong>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
              {userProfile?.notificationPrefs?.emailEnabled
                ? '???꾩옱 ?대찓???뚮┝??[?쒖꽦?? ?곹깭?낅땲?? ?곗폆???ㅽ뵂 利됱떆 ?뚮┝??諛쒖넚?⑸땲??'
                : '?곗폆???쒖옉 1遺????볦튂吏 ?딅룄濡??대찓???뚮┝???ㅼ젙?섏꽭?? (留?14???댁긽 ?뚯썝 ?꾩슜)'}
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
            boxShadow: '0 0 16px rgba(255, 215, 0, 0.4)'
          }}
        >
          {userProfile ? '?숋툘 留덉씠?섏씠吏 & ?곗폆 ?뚮┝ ?ㅼ젙' : '?뵎 濡쒓렇?명븯怨??뚮┝ 諛쏄린'}
        </button>
      </div>
      {/* 5? ?꾪떚?ㅽ듃 ??됲꽣 & ?붾줈???꾪꽣 諛?*/}
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
      {/* 肄섏꽌???꾩닔 ?쒗쁽 誘몃땲 ?꾩젽 */}
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
      {/* ?쒓뎅???숈뒿 ?쇰뱶 */}
      <LanguageContentFeed
        items={allLangContent}
        currentLanguage={currentLang}
      />
    </div>
  );
}