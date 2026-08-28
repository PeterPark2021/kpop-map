import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export interface ExtractedFactMultilingual {
  ko: { title: string; factSummary: string[] };
  en: { title: string; factSummary: string[] };
  ja: { title: string; factSummary: string[] };
  zh: { title: string; factSummary: string[] };
  sea: { title: string; factSummary: string[] };
}

export async function extractAndTranslateFacts(rawText: string, artistName: string): Promise<ExtractedFactMultilingual> {
  const prompt = `
당신은 K-pop 글로벌 데이터베이스를 위한 "저작권 안심 팩트 요약 AI"입니다.
다음 원문 기사/공지에서 저작권 문제가 될 수 있는 서술적 문장, 감상평, 미사여구는 모두 배제하고,
오직 "객관적 사실 관계(일정, 장소, 티켓 오픈 시간, 예매처, 좌석 등급, 주최사)"만 2~3개의 명확한 불릿 포인트로 추출하세요.

그 후, 이 사실 관계를 아래 5개 언어로 현지 팬 문화에 맞게 번역 및 로컬라이즈하세요:
1. ko (한국어)
2. en (영어 - 글로벌 캐주얼 톤)
3. ja (일본어 - 정중한 공손체 톤)
4. zh (중국어 번체 - 대만/홍콩 표준 용어)
5. sea (동남아 팬 타겟 - 영어 기반의 쉬운 글로벌 요약)

반드시 아래 JSON 형식으로만 응답하세요:
{
  "ko": { "title": "...", "factSummary": ["...", "..."] },
  "en": { "title": "...", "factSummary": ["...", "..."] },
  "ja": { "title": "...", "factSummary": ["...", "..."] },
  "zh": { "title": "...", "factSummary": ["...", "..."] },
  "sea": { "title": "...", "factSummary": ["...", "..."] }
}

[아티스트]: ${artistName}
[원문 내용]:
${rawText}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });

  const resultText = response.text || '{}';
  return JSON.parse(resultText) as ExtractedFactMultilingual;
}