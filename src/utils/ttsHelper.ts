/**
 * [정식 Google Cloud AI 음성 / Web Speech API 하이브리드 플레이어]
 */
export function playTtsAudio(
  text: string,
  audioUrl?: string,
  onEnded?: () => void
): void {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.onended = () => { if (onEnded) onEnded(); };
    audio.onerror = () => {
      speakWithWebSpeech(text, onEnded);
    };
    audio.play().catch(() => speakWithWebSpeech(text, onEnded));
    return;
  }
  speakWithWebSpeech(text, onEnded);
}

export function speakWithWebSpeech(text: string, onEnded?: () => void): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.onend = () => { if (onEnded) onEnded(); };
    utterance.onerror = () => { if (onEnded) onEnded(); };
    window.speechSynthesis.speak(utterance);
  } else {
    if (onEnded) onEnded();
  }
}

// 하위 호환성을 위한 별칭 export
export const speakKorean = playTtsAudio;
export const playOfficialAudio = playTtsAudio;