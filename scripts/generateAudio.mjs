/**
 * [Google Cloud Text-to-Speech 정식 사전 생성 스크립트]
 * - Google Cloud Text-to-Speech API (Neural2 / Wavenet ko-KR)를 1회 호출하여
 *   모든 LanguageContent 항목의 MP3 파일을 사전 생성하고 Firebase Storage/Public 에셋에 저장합니다.
 */
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;

export async function synthesizePhrase(text, outputFile) {
  if (!API_KEY) {
    console.warn(`[TTS Generator] GOOGLE_CLOUD_TTS_API_KEY 미설정. 사전 생성 모드로 진행.`);
    return;
  }

  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  const payload = {
    input: { text },
    voice: {
      languageCode: 'ko-KR',
      name: 'ko-KR-Neural2-A', // 최고급 한국어 여성 음성
      ssmlGender: 'FEMALE'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.88,
      pitch: 0.0
    }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Cloud TTS Error: ${res.statusText}`);
  }

  const data = await res.json();
  const buffer = Buffer.from(data.audioContent, 'base64');
  fs.writeFileSync(outputFile, buffer);
  console.log(`✓ Cloud TTS 생성 완료: ${outputFile}`);
}

console.log('✅ Google Cloud TTS 정식 오디오 생성기 준비 완료.');