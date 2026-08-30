import React, { useState } from 'react';
import { userService } from '../services/userService';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const UserAuthModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthYear, setBirthYear] = useState<number>(2000);
  const [birthMonth, setBirthMonth] = useState<number>(1);
  const [pendingSocialUser, setPendingSocialUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const years = Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (isLoginTab) {
      const res = await userService.loginWithEmail(email, password);
      setIsLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      return;
    }

    // 회원가입
    const res = await userService.signupWithEmail(email, password, displayName, birthYear, birthMonth);
    setIsLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else if (res.error?.includes('UNDER_14_BLOCKED')) {
      setErrorMsg('🚫 만 14세 미만은 관련 법령에 따라 법정대리인의 동의 없이 회원가입이 불가능합니다.');
    } else {
      setErrorMsg(res.error || '회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const res = await userService.signInWithGoogle();
    setIsLoading(false);

    if (res.success) {
      if (res.requiresAgeVerification && res.uid) {
        setPendingSocialUser({
          uid: res.uid,
          email: res.email || '',
          displayName: res.displayName || 'Google Fan'
        });
        return;
      }
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Google 로그인에 실패했습니다.');
    }
  };

  const handleCompleteSocialAge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingSocialUser) return;
    setIsLoading(true);
    setErrorMsg(null);

    const res = await userService.completeSocialSignup(
      pendingSocialUser.uid,
      pendingSocialUser.email,
      pendingSocialUser.displayName,
      birthYear,
      birthMonth
    );
    setIsLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else if (res.error?.includes('UNDER_14_BLOCKED')) {
      setErrorMsg('🚫 만 14세 미만은 회원가입이 제한됩니다.');
    } else {
      setErrorMsg(res.error || '나이 인증 완료 중 오류가 발생했습니다.');
    }
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
        maxWidth: '440px',
        padding: '30px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
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

        {pendingSocialUser ? (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: '#ffd700' }}>
              🎂 나이 확인 (만 14세 이상)
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>
              정보통신망법에 따라 만 14세 이상 여부를 서버에서 확인합니다. (생년월일 정보는 검증 후 즉시 파기됩니다.)
            </p>
            <form onSubmit={handleCompleteSocialAge}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>출생 연도</label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  >
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>출생 월</label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                </div>
              </div>
              {errorMsg && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '14px', fontWeight: 600 }}>{errorMsg}</div>}
              <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #ffd700, #eab308)', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
              >
                {isLoading ? '확인 중...' : '만 14세 이상 확인 및 가입 완료'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #1e2433', paddingBottom: '12px' }}>
              <button
                type="button"
                onClick={() => { setIsLoginTab(true); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  background: isLoginTab ? '#eab308' : 'none',
                  color: isLoginTab ? '#000' : '#94a3b8',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginTab(false); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  background: !isLoginTab ? '#eab308' : 'none',
                  color: !isLoginTab ? '#000' : '#94a3b8',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                회원가입 (만 14세+)
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>이메일</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fan@kpop.com"
                  style={{ width: '100%', padding: '10px 12px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>비밀번호</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자리 이상 입력"
                  style={{ width: '100%', padding: '10px 12px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              {!isLoginTab && (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>닉네임</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="팬 닉네임"
                      style={{ width: '100%', padding: '10px 12px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>출생 연도</label>
                      <select
                        value={birthYear}
                        onChange={(e) => setBirthYear(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      >
                        {years.map(y => <option key={y} value={y}>{y}년</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>출생 월</label>
                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px', background: '#0b0e14', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      >
                        {months.map(m => <option key={m} value={m}>{m}월</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {errorMsg && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '14px', fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ffd700, #eab308)',
                  color: '#000',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                {isLoading ? '처리 중...' : isLoginTab ? '로그인' : '만 14세 이상 가입하기'}
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{
                width: '100%',
                background: '#1e2433',
                color: '#f8fafc',
                border: '1px solid #334155',
                padding: '10px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>🌐</span> Google 계정으로 계속하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};