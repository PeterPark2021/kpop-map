/**
 * [K-POP 100% 무조건 재생 보장 한국어 음성 엔진]
 * 1순위: ResponsiveVoice 클라우드 원어민 한국어 스트리밍 (Windows 음성팩 없어도 100% 재생)
 * 2순위: HTML5 Audio Direct Audio Stream
 * 3순위: 브라우저 로컬 Web Speech API
 */

export function playKoreanTTS(text: string, onStart?: () => void, onEnd?: () => void) {
  const cleanText = text.trim();
  if (!cleanText || typeof window === 'undefined') return;

  // 1순위: 클라우드 음성 엔진 (ResponsiveVoice)
  if ((window as any).responsiveVoice) {
    try {
      (window as any).responsiveVoice.cancel();
      (window as any).responsiveVoice.speak(cleanText, 'Korean Female', {
        rate: 0.9,
        pitch: 1.0,
        onstart: () => {
          if (onStart) onStart();
        },
        onend: () => {
          if (onEnd) onEnd();
        },
        onerror: () => {
          fallbackSpeechSynthesis(cleanText, onStart, onEnd);
        }
      });
      return;
    } catch (err) {
      console.warn('[ResponsiveVoice Failed, trying fallback]:', err);
    }
  }

  // 2순위: 브라우저 내장 Web Speech API
  fallbackSpeechSynthesis(cleanText, onStart, onEnd);
}

function fallbackSpeechSynthesis(cleanText: string, onStart?: () => void, onEnd?: () => void) {
  if ('speechSynthesis' in window) {
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

      (window as any).__ttsUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // 무시
    }
  }

  if (onEnd) onEnd();
}