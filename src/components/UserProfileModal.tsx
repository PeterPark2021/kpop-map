import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types/types';
import { userService } from '../services/userService';
import { allArtistsCatalog } from '../data/artistsCatalog';

interface Props {
  profile: UserProfile;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ profile, onClose }) => {
  const [emailEnabled, setEmailEnabled] = useState(profile.notificationPrefs.emailEnabled);
  const [lang, setLang] = useState<LanguageCode>(profile.notificationPrefs.language);
  const [consentChecked, setConsentChecked] = useState(profile.notificationPrefs.emailEnabled);
  const [savedToast, setSavedToast] = useState(false);

  const handleSavePreferences = async () => {
    if (emailEnabled && !consentChecked) {
      alert('이메일 알림을 수신하려면 필수 동의 체크박스에 체크해야 합니다.');
      return;
    }

    await userService.updateNotificationPrefs(emailEnabled, lang);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const followedArtists = allArtistsCatalog.filter(a => profile.favoriteArtistIds.includes(a.artistId));

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
        background: '#121622',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid #232a3d',
        padding: '28px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer' }}
        >
          ✕
        </button>

        {savedToast && (
          <div style={{ background: '#16a34a', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textAlign: 'center', marginBottom: '14px' }}>
            ✓ 알림 설정이 성공적으로 저장되었습니다!
          </div>
        )}

        {/* 사용자 기본 정보 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: '#000' }}>
            {profile.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{profile.displayName}</h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{profile.email}</span>
          </div>
        </div>

        {/* 1. 내가 팔로우하는 아티스트 */}
        <div style={{ background: '#0e121a', padding: '16px', borderRadius: '12px', border: '1px solid #1e2433', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⭐</span> 내가 팔로우하는 아티스트 ({followedArtists.length})
          </h3>
          {followedArtists.length === 0 ? (
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              아직 팔로우한 아티스트가 없습니다. 메인 화면에서 [★ 팔로우]를 눌러보세요!
            </p>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {followedArtists.map(a => (
                <span
                  key={a.artistId}
                  style={{ background: '#1e2433', border: '1px solid #334155', color: '#f8fafc', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}
                >
                  ★ {a.name.ko || a.name.en}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. 티켓 오픈 알림 구독 설정 (법적 필수 동의) */}
        <div style={{ background: '#0e121a', padding: '16px', borderRadius: '12px', border: '1px solid #1e2433', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔔</span> 티켓 오픈 이메일 알림 설정
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>관심 아티스트 티켓 오픈 시 이메일 수신</span>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => {
                setEmailEnabled(e.target.checked);
                if (e.target.checked) setConsentChecked(true);
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#eab308' }}
            />
          </div>

          {emailEnabled && (
            <div style={{ background: '#161b26', padding: '12px', borderRadius: '8px', border: '1px solid #283042', marginTop: '10px' }}>
              {/* 알림 언어 선택 */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>알림 수신 언어</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LanguageCode)}
                  style={{ width: '100%', background: '#0a0d14', color: '#fff', border: '1px solid #334155', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}
                >
                  <option value="ko">🇰🇷 한국어</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="ja">🇯🇵 日本語</option>
                  <option value="zh">🇹🇼 繁體中文</option>
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
                  <strong>[필수]</strong> 티켓 오픈 알림을 이메일로 받는 것에 동의합니다. (수신된 이메일에서 언제든 원클릭 수신 거부 가능)
                </span>
              </label>
            </div>
          )}

          <button
            onClick={handleSavePreferences}
            style={{ width: '100%', background: '#eab308', color: '#000', fontWeight: 800, border: 'none', padding: '9px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginTop: '12px' }}
          >
            설정 저장하기
          </button>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={async () => { await userService.logout(); onClose(); }}
          style={{ width: '100%', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};