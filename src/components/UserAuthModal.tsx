import React, { useState } from 'react';
import { userService } from '../services/userService';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserAuthModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await userService.signUpWithEmail(email.trim(), password, displayName.trim());
      } else {
        await userService.loginWithEmail(email.trim(), password);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('이미 가입된 이메일 주소입니다. 로그인을 진행하세요.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorMsg(err.message || '인증에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg(null);
    try {
      await userService.loginWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(`Google 로그인 실패: ${err.message}`);
      }
    }
  };

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
        maxWidth: '400px',
        borderRadius: '16px',
        border: '1px solid #232a3d',
        padding: '28px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer' }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '2rem' }}>⭐</span>
          <h2 style={{ margin: '8px 0 4px 0', fontSize: '1.25rem', color: '#f8fafc' }}>
            {isSignUp ? 'K-POP 팬 계정 만들기' : 'K-POP 팬 로그인'}
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
            관심 아티스트를 팔로우하고 티켓 오픈 알림을 받아보세요!
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          style={{ width: '100%', background: '#ffffff', color: '#0f172a', fontWeight: 700, border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          Google 계정으로 계속하기
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0', color: '#475569', fontSize: '11px' }}>
          <div style={{ flex: 1, height: '1px', background: '#1e2433' }} />
          <span>또는 이메일로 {isSignUp ? '가입' : '로그인'}</span>
          <div style={{ flex: 1, height: '1px', background: '#1e2433' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>닉네임</label>
              <input
                type="text"
                required
                placeholder="예: 지디팬클럽"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#0a0d14', border: '1px solid #232a3d', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>이메일</label>
            <input
              type="email"
              required
              placeholder="fan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#0a0d14', border: '1px solid #232a3d', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>비밀번호 (6자 이상)</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#0a0d14', border: '1px solid #232a3d', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#eab308', color: '#000', fontWeight: 800, border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginTop: '6px' }}
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입 완료' : '로그인'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          {isSignUp ? '이미 계정이 있으신가요?' : '아직 회원이 아니신가요?'}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }}
            style={{ background: 'transparent', border: 'none', color: '#fde047', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignUp ? '로그인하기' : '회원가입하기'}
          </button>
        </div>
      </div>
    </div>
  );
};