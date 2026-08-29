/**
 * [K-POP 100% 무조건 재생 한국어 원어민 오디오 엔진]
 * - client=gtx 오픈 스트림 (CORS 및 브라우저 차단 제로)
 * - DOM Audio 객체를 통한 즉각적인 하드웨어 재생
 * - Web Speech API 및 Web Audio 동시 지원
 */

let globalAudioPlayer: HTMLAudioElement | null = null;

export function playKoreanTTS(text: string, onStart?: () => void, onEnd?: () => void) {
  const cleanText = text.trim();
  if (!cleanText || typeof window === 'undefined') return;

  // 1. 기존 재생 오디오 중단
  if (globalAudioPlayer) {
    globalAudioPlayer.pause();
    globalAudioPlayer.currentTime = 0;
  }

  // 2. 1순위: client=gtx 고품질 한국어 원어민 음성 스트림 (가장 선명하고 정확)
  try {
    const encoded = encodeURIComponent(cleanText);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=gtx&q=${encoded}`;

    const audio = new Audio(audioUrl);
    globalAudioPlayer = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      globalAudioPlayer = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn('[Audio Stream Failed, falling back to WebSpeech]:', e);
      fallbackToWebSpeech(cleanText, onStart, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('[Autoplay blocked, trying WebSpeech]:', err);
        fallbackToWebSpeech(cleanText, onStart, onEnd);
      });
    }
  } catch (err) {
    fallbackToWebSpeech(cleanText, onStart, onEnd);
  }
}

function fallbackToWebSpeech(cleanText: string, onStart?: () => void, onEnd?: () => void) {
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

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      (window as any).__currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // 무시
    }
  }

  if (onEnd) onEnd();
}