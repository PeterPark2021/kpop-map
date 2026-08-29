export function playTtsAudio(text: string, audioUrl?: string, onEnded?: () => void): void {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.onended = () => { if (onEnded) onEnded(); };
    audio.onerror = () => { speakKorean(text, onEnded); };
    audio.play().catch(() => { speakKorean(text, onEnded); });
    return;
  }
  speakKorean(text, onEnded);
}
export function speakKorean(text: string, onEnded?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnded) onEnded();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.9;
  utterance.onend = () => { if (onEnded) onEnded(); };
  utterance.onerror = () => { if (onEnded) onEnded(); };
  window.speechSynthesis.speak(utterance);
}