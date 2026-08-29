import React, { useState } from 'react';
import { userService } from '../services/userService';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const UserAuthModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isAgeGateView, setIsAgeGateView] = useState(false);
  const [isUnderAgeBlocked, setIsUnderAgeBlocked] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // 생년월일 입력 (만 14세 검증용)
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState<number>(currentYear - 20); // 기본값: 20세
  const [birthMonth, setBirthMonth] = useState<number>(1);

  const [socialPendingUser, setSocialPendingUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const years = Array.from({ length: 90 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (isLoginView) {
      const res = await userService.loginWithEmail(email, password);
      setIsLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {
      // 회원가입: 나이 검증 포함
      const res = await userService.signupWithEmail(email, password, displayName, birthYear, birthMonth);
      setIsLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
      } else if (res.error?.includes('UNDER_14_BLOCKED')) {
        setIsUnderAgeBlocked(true);
      } else {
        setErrorMsg(res.error || '회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    const res = await userService.signInWithGoogle();
    setIsLoading(false);

    if (res.success) {
      if (res.requiresAgeVerification && res.uid) {
        setSocialPendingUser({
          uid: res.uid,
          email: res.email || '',
          displayName: res.displayName || 'Google 팬'
        });
        setIsAgeGateView(true);
      } else {
        onSuccess();
        onClose();
      }
    } else {
      setErrorMsg(res.error || 'Google 로그인에 실패했습니다.');
    }
  };

  const handleCompleteSocialAgeGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialPendingUser) return;
    setIsLoading(true);
    setErrorMsg(null);

    const res = await userService.completeSocialSignup(
      socialPendingUser.uid,
      socialPendingUser.email,
      socialPendingUser.displayName,
      birthYear,
      birthMonth
    );
    setIsLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else if (res.error?.includes('UNDER_14_BLOCKED')) {
      setIsUnderAgeBlocked(true);
    } else {
      setErrorMsg(res.error || '가입 완료 중 오류가 발생했습니다.');
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
        padding: '32px',
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

        {/* 1. 만 14세 미만 가입 차단 안내 화면 */}
        {isUnderAgeBlocked ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 12px 0' }}>
              서비스 이용 연령 안내
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              죄송합니다. <strong>K-POP Tour Pulse</strong>는 정보통신망법 및 글로벌 아동 온라인 개인정보 보호 규정(COPPA)에 따라 <strong>만 14세 이상</strong>만 가입하여 이용하실 수 있습니다.
            </p>
            <div style={{ background: '#1a2234', padding: '14px', borderRadius: '10px', fontSize: '12px', color: '#64748b', textAlign: 'left', marginBottom: '24px' }}>
              ℹ️ 입력하신 생년월일 정보는 나이 확인 후 즉시 폐기되었으며 일체 보관되지 않습니다. 문의사항은 법정대리인을 통해 <a href="mailto:privacy@galaxycorp.com" style={{ color: '#ffd700', textDecoration: 'underline' }}>privacy@galaxycorp.com</a> 으로 연락해 주세요.
            </div>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                background: '#283042',
                color: '#f8fafc',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              확인 및 창 닫기
            </button>
          </div>
        ) : isAgeGateView ? (
          /* 2. 소셜 로그인 최초 가입자 나이 확인 단계 */
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffd700' }}>
              🎂 연령 확인 (필수)
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' }}>
              안전한 팬 커뮤니티 환경 조성을 위해 출생년월을 선택해 주세요. (만 14세 이상 이용 가능)
            </p>

            <form onSubmit={handleCompleteSocialAgeGate}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>출생 연도</label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px' }}
                  >
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>출생 월</label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', marginBottom: '20px' }}>
                ※ 생년월일은 나이 확인 목적으로만 1회 검증되며, 서버에 일체 보관되지 않습니다.
              </p>

              {errorMsg && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '14px' }}>{errorMsg}</div>}

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
                  cursor: 'pointer'
                }}
              >
                {isLoading ? '확인 중...' : '확인 및 회원가입 완료'}
              </button>
            </form>
          </div>
        ) : (
          /* 3. 기본 로그인 / 회원가입 화면 */
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => { setIsLoginView(true); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  background: isLoginView ? '#1e2433' : 'transparent',
                  color: isLoginView ? '#ffd700' : '#64748b',
                  border: isLoginView ? '1px solid #ffd70044' : '1px solid transparent',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                로그인
              </button>
              <button
                onClick={() => { setIsLoginView(false); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  background: !isLoginView ? '#1e2433' : 'transparent',
                  color: !isLoginView ? '#ffd700' : '#64748b',
                  border: !isLoginView ? '1px solid #ffd70044' : '1px solid transparent',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                회원가입 (만 14세+)
              </button>
            </div>

            {/* Google 원클릭 로그인 */}
            <button
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#0f172a',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '18px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google 계정으로 계속하기
            </button>

            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', margin: '14px 0' }}>또는 이메일로 계속하기</div>

            <form onSubmit={handleEmailAuth}>
              {!isLoginView && (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>닉네임</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="팬 닉네임"
                      style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* 이메일 가입 출생년월 선택 */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#ffd700', display: 'block', marginBottom: '6px' }}>출생 연도 (만 14세+)</label>
                      <select
                        value={birthYear}
                        onChange={(e) => setBirthYear(Number(e.target.value))}
                        style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px' }}
                      >
                        {years.map(y => <option key={y} value={y}>{y}년</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#ffd700', display: 'block', marginBottom: '6px' }}>출생 월</label>
                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(Number(e.target.value))}
                        style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px' }}
                      >
                        {months.map(m => <option key={m} value={m}>{m}월</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>이메일 주소</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fan@example.com"
                  style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>비밀번호</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', background: '#0b0e14', border: '1px solid #334155', color: '#f8fafc', padding: '10px', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>

              {!isLoginView && (
                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', marginBottom: '16px' }}>
                  ※ 생년월일은 만 14세 이상 여부 확인에만 사용되며 DB에 저장되지 않습니다.
                </p>
              )}

              {errorMsg && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '14px', padding: '8px', background: '#450a0a', borderRadius: '6px' }}>
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
                  cursor: 'pointer'
                }}
              >
                {isLoading ? '처리 중...' : (isLoginView ? '로그인' : '만 14세 이상 확인 및 가입하기')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};