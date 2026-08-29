/**
 * [K-POP 정식 라이선스 한국어 음성 재생 엔진]
 * 1순위: Firebase Storage / Public 정식 사전 생성 Google Cloud AI 음성 (audioUrl)
 * 2순위 (오프라인 폴백): 브라우저 표준 Web Speech API (SpeechSynthesis ko-KR)
 * ※ 비공식/미인가 엔드포인트(translate.google.com) 호출 100% 배제
 */

let activeAudioPlayer: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function playKoreanTTS(
  text: string,
  audioUrl?: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  const cleanText = text.trim();
  if (!cleanText || typeof window === 'undefined') return;

  // 기존 재생 오디오 중단
  if (activeAudioPlayer) {
    activeAudioPlayer.pause();
    activeAudioPlayer.currentTime = 0;
    activeAudioPlayer = null;
  }

  // 1순위: 정식 사전 생성 Cloud TTS 오디오 URL 재생
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      activeAudioPlayer = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        activeAudioPlayer = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        activeAudioPlayer = null;
        fallbackWebSpeech(cleanText, onStart, onEnd);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackWebSpeech(cleanText, onStart, onEnd);
        });
      }
      return;
    } catch {
      fallbackWebSpeech(cleanText, onStart, onEnd);
      return;
    }
  }

  // 2순위: 브라우저 표준 Web Speech API (로컬 폴백)
  fallbackWebSpeech(cleanText, onStart, onEnd);
}

function fallbackWebSpeech(cleanText: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
      if (koVoice) {
        utterance.voice = koVoice;
      }

      let finished = false;
      const finish = () => {
        if (!finished) {
          finished = true;
          activeUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = finish;
      utterance.onerror = finish;

      setTimeout(finish, 3500);

      activeUtterance = utterance;
      (window as any).__currentUtterance = utterance;

      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // fallback
    }
  }

  if (onEnd) onEnd();
}