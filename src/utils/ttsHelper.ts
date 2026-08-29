/**
 * [K-POP 한국어 100% 즉시 발음 재생기]
 * - 사용자 클릭 제스처 토큰 유지 (동기식 즉시 실행)
 * - 브라우저 시작 시 한국어 음성 사전 로드 (Pre-loading)
 * - V8 가비지 컬렉션 방지 및 즉각적인 오디오 피드백
 */

let koreanVoice: SpeechSynthesisVoice | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

// 브라우저 시작 시 한국어 음성 엔진 사전 로드
function preloadKoreanVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const voices = window.speechSynthesis.getVoices();
  // 1순위: Google 한국어, 2순위: Microsoft Heami/SunHi, 3순위: 기타 ko-KR
  const found =
    voices.find(v => v.lang === 'ko-KR' && v.name.includes('Google')) ||
    voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko')) ||
    voices.find(v => v.lang.includes('ko'));

  if (found) {
    koreanVoice = found;
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  preloadKoreanVoices();
  window.speechSynthesis.onvoiceschanged = preloadKoreanVoices;
}

// 클릭 즉시 스피커 동작 여부를 확인할 수 있는 미세 비프음 (Web Audio API)
function playHapticBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 음계
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {
    // 무시
  }
}

export function playKoreanTTS(text: string, onStart?: () => void, onEnd?: () => void) {
  const cleanText = text.trim();
  if (!cleanText || typeof window === 'undefined') return;

  // 1. 오디오 하드웨어 즉시 활성화 (사용자 제스처 컨텍스트)
  playHapticBeep();

  if ('speechSynthesis' in window) {
    try {
      // 멈춤 상태 해제 및 이전 큐 정리
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      // 음성 재확인
      if (!koreanVoice) {
        preloadKoreanVoices();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85; // 또박또박한 표준 학습 속도
      utterance.pitch = 1.0;

      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      let hasFinished = false;
      const complete = () => {
        if (!hasFinished) {
          hasFinished = true;
          activeUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = complete;
      utterance.onerror = (err) => {
        console.warn('[TTS Error]:', err);
        complete();
      };

      // 타임아웃 안전장치 (3.5초)
      setTimeout(complete, 3500);

      // GC 방지 전역 참조
      activeUtterance = utterance;
      (window as any).__ttsUtterance = utterance;

      // 동기식 즉시 발화 (User Activation 유지)
      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.error('[TTS Fatal Error]:', e);
    }
  }

  if (onEnd) onEnd();
}