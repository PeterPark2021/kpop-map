/**
 * [K-POP 한국어 듀얼 엔진 TTS 재생 유틸]
 * 1차: 브라우저 Web Speech API (한국어 보이스 자동 탐색)
 * 2차: 한국어 네이티브 오디오 스트림 자동 폴백 (Windows 한글 음성팩 미설치 환경 대응)
 */

let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeAudio: HTMLAudioElement | null = null;

export function playKoreanTTS(text: string, onStart?: () => void, onEnd?: () => void) {
  const cleanText = text.trim();
  if (!cleanText) return;

  // 기존 재생 중인 오디오 정리
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  // 1차 시도: Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      const voices = window.speechSynthesis.getVoices();
      const hasKoreanVoice = voices.some(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));

      // 브라우저에 한국어 보이스가 탑재되어 있는 경우
      if (hasKoreanVoice || voices.length === 0) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.85; // 학습용 또박또박한 속도
        utterance.pitch = 1.0;

        const koVoice = voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
        if (koVoice) {
          utterance.voice = koVoice;
        }

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          activeUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          // Web Speech 실패 시 2차 폴백 실행
          fallbackToAudioStream(cleanText, onStart, onEnd);
        };

        activeUtterance = utterance;
        (window as any).__activeUtterance = utterance; // V8 가비지 컬렉션 방지

        window.speechSynthesis.speak(utterance);
        return;
      }
    } catch (err) {
      console.warn('[TTS] Web Speech API init failed, using audio fallback:', err);
    }
  }

  // 2차 폴백: 한국어 원어민 오디오 스트림 재생
  fallbackToAudioStream(cleanText, onStart, onEnd);
}

function fallbackToAudioStream(text: string, onStart?: () => void, onEnd?: () => void) {
  try {
    if (onStart) onStart();
    const encoded = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${encoded}`;

    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      activeAudio = null;
      if (onEnd) onEnd();
      console.warn('[TTS] Audio stream playback error');
    };

    audio.play().catch(e => {
      console.warn('[TTS] Autoplay blocked:', e);
      if (onEnd) onEnd();
    });
  } catch {
    if (onEnd) onEnd();
  }
}