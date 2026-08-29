import React, { useState } from 'react';
import { UserProfile, UserNotificationPrefs } from '../types/types';
import { userService } from '../services/userService';
import { allArtistsCatalog } from '../data/artistsCatalog';

interface Props {
  profile: UserProfile;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ profile, onClose }) => {
  const [emailEnabled, setEmailEnabled] = useState(profile.notificationPrefs?.emailEnabled ?? false);
  const [ticketOpen, setTicketOpen] = useState(profile.notificationPrefs?.ticketOpen ?? true);
  const [statusChange, setStatusChange] = useState(profile.notificationPrefs?.statusChange ?? true);
  const [consentGiven, setConsentGiven] = useState(Boolean(profile.notificationPrefs?.consentGivenAt));
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailEnabled && !consentGiven) {
      setMsg('⚠️ 이메일 알림을 받으시려면 법적 수신 동의 체크박스에 체크해 주셔야 합니다.');
      return;
    }
    setIsSaving(true);
    setMsg(null);

    const updatedPrefs: UserNotificationPrefs = {
      emailEnabled,
      ticketOpen,
      statusChange,
      language: profile.notificationPrefs?.language || 'ko',
      consentGivenAt: emailEnabled ? (profile.notificationPrefs?.consentGivenAt || new Date().toISOString()) : undefined
    };

    await userService.updateNotificationPrefs(updatedPrefs);
    setIsSaving(false);
    setMsg('✓ 알림 설정이 성공적으로 저장되었습니다!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '20px'
    }}>
      <div style={{
        background: '#121622',
        border: '1px solid #283042',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        color: '#f8fafc',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ fontSize: '32px', background: 'rgba(234, 179, 8, 0.2)', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            👤
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              {profile.displayName}
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {profile.email} · {profile.ageVerified ? '✓ 만 14세 인증 회원' : '일반 회원'}
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #1e2433', margin: '16px 0' }} />

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: 700 }}>
            ⭐ 팔로우 중인 관심 아티스트 ({profile.favoriteArtistIds?.length || 0}명)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {profile.favoriteArtistIds && profile.favoriteArtistIds.length > 0 ? (
              profile.favoriteArtistIds.map((id) => {
                const artist = allArtistsCatalog.find(a => a.artistId === id);
                return (
                  <span key={id} style={{ background: '#1e2433', color: '#ffd700', border: '1px solid #ca8a04', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                    ★ {artist ? (artist.name.ko || artist.name.en) : id}
                  </span>
                );
              })
            ) : (
              <span style={{ fontSize: '12px', color: '#64748b' }}>팔로우한 아티스트가 없습니다. 메인 화면에서 별표(★)를 눌러 등록하세요.</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ background: '#0b0e14', padding: '16px', borderRadius: '12px', border: '1px solid #1e2433', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#ffd700', display: 'block' }}>🔔 이메일 실시간 알림 수신</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>티켓 오픈 및 일정 변경 시 메일을 발송합니다.</span>
              </div>
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#eab308', cursor: 'pointer' }}
              />
            </div>

            {emailEnabled && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e2433' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#cbd5e1' }}>
                  <input
                    type="checkbox"
                    required
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#eab308' }}
                  />
                  <span>
                    <strong>[필수] 관심 아티스트 티켓 오픈 알림 수신에 동의합니다.</strong><br/>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      언제든지 메일 하단 '안전한 원클릭 수신거부' 또는 마이페이지에서 수신을 해제하실 수 있습니다.
                    </span>
                  </span>
                </label>
              </div>
            )}
          </div>

          {msg && (
            <div style={{
              color: msg.includes('⚠️') ? '#ef4444' : '#22c55e',
              fontSize: '12px',
              marginBottom: '14px',
              fontWeight: 700
            }}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ffd700, #eab308)',
              color: '#000',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isSaving ? '저장 중...' : '설정 저장하기'}
          </button>
        </form>
      </div>
    </div>
  );
};