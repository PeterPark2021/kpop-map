import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types/types';
import { userService } from '../services/userService';
import { allArtistsCatalog } from '../data/artistsCatalog';

interface Props {
  profile?: UserProfile | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ profile, onClose }) => {
  // 100% 방어 기본값 설정
  const defaultPrefs = profile?.notificationPrefs || {
    emailEnabled: false,
    language: 'ko',
    consentGivenAt: null
  };

  const [emailEnabled, setEmailEnabled] = useState(Boolean(defaultPrefs.emailEnabled));
  const [lang, setLang] = useState<LanguageCode>(defaultPrefs.language || 'ko');
  const [consentChecked, setConsentChecked] = useState(Boolean(defaultPrefs.emailEnabled));
  const [savedToast, setSavedToast] = useState(false);

  const displayName = profile?.displayName || 'K-POP 팬';
  const email = profile?.email || 'fan@kpop-tour.com';
  const favoriteIds = profile?.favoriteArtistIds || [];

  const handleSavePreferences = async () => {
    if (emailEnabled && !consentChecked) {
      alert('이메일 알림을 수신하려면 [필수 동의] 체크박스에 체크해야 합니다.');
      return;
    }

    await userService.updateNotificationPrefs(emailEnabled, lang);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleUnfollow = async (artistId: string) => {
    await userService.toggleFavoriteArtist(artistId);
  };

  const followedArtists = allArtistsCatalog.filter(a => favoriteIds.includes(a.artistId));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 12, 0.90)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999, // 최상위 zIndex 보장
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#121622',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid #ffd70066',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* 우측 상단 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: '#1e2433', border: '1px solid #334155', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}
        >
          ✕
        </button>

        {savedToast && (
          <div style={{ background: '#16a34a', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>
            ✓ 티켓 알림 수신 설정이 안전하게 저장되었습니다!
          </div>
        )}

        {/* 사용자 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffd700, #eab308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#000', boxShadow: '0 0 16px rgba(255, 215, 0, 0.4)' }}>
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#f8fafc' }}>{displayName}</h2>
              <span style={{ fontSize: '11px', background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>팬 회원</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{email}</span>
          </div>
        </div>

        {/* 1. 내가 팔로우하는 아티스트 */}
        <div style={{ background: '#0e121a', padding: '18px', borderRadius: '12px', border: '1px solid #1e2433', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⭐</span> 내가 팔로우하는 아티스트 ({followedArtists.length})
          </h3>
          {followedArtists.length === 0 ? (
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              아직 팔로우한 아티스트가 없습니다.<br/>메인 화면 아티스트 바에서 [☆] 버튼을 눌러보세요!
            </p>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {followedArtists.map(a => (
                <span
                  key={a.artistId}
                  style={{ background: '#1e2433', border: '1px solid #334155', color: '#f8fafc', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>★ {a.name.ko || a.name.en}</span>
                  <button
                    onClick={() => handleUnfollow(a.artistId)}
                    title="팔로우 취소"
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 800 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. 티켓 오픈 알림 구독 설정 (법적 필수 동의) */}
        <div style={{ background: '#0e121a', padding: '18px', borderRadius: '12px', border: '1px solid #1e2433', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔔</span> 관심 아티스트 티켓 오픈 이메일 알림
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>티켓 오픈(예매 시작) 시 실시간 메일 받기</span>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => {
                setEmailEnabled(e.target.checked);
                if (e.target.checked) setConsentChecked(true);
              }}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#eab308' }}
            />
          </div>

          {emailEnabled && (
            <div style={{ background: '#161b26', padding: '14px', borderRadius: '10px', border: '1px solid #283042', marginTop: '12px' }}>
              {/* 알림 언어 선택 */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>알림 수신 언어</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LanguageCode)}
                  style={{ width: '100%', background: '#0a0d14', color: '#fff', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}
                >
                  <option value="ko">🇰🇷 한국어 (Korean)</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="ja">🇯🇵 日本語 (Japanese)</option>
                  <option value="zh">🇹🇼 繁體中文 (Traditional Chinese)</option>
                  <option value="sea">🌏 South East Asia</option>
                </select>
              </div>

              {/* 법적 수신 동의 체크박스 */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#94a3b8', cursor: 'pointer', lineHeight: '1.4' }}>
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  style={{ marginTop: '2px', accentColor: '#eab308' }}
                />
                <span>
                  <strong style={{ color: '#ffd700' }}>[필수 동의]</strong> 티켓 오픈 알림을 이메일로 받는 것에 동의합니다. (수신된 이메일 하단에서 언제든 1초 만에 수신 거부 가능)
                </span>
              </label>
            </div>
          )}

          <button
            onClick={handleSavePreferences}
            style={{ width: '100%', background: 'linear-gradient(135deg, #ffd700, #eab308)', color: '#000', fontWeight: 900, border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '14px', boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)' }}
          >
            설정 저장하기
          </button>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={async () => { await userService.logout(); onClose(); }}
          style={{ width: '100%', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '9px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};