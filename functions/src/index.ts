import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateNewsSource, RawNewsInput } from './services/copyrightFilter';
import { extractAndTranslateFacts } from './services/geminiFactService';

admin.initializeApp();
const db = admin.firestore();

/**
 * [Cloud Function: ingestTourNews]
 * 뉴스/공지 원문을 받아 저작권 필터링 ➔ Gemini 팩트 추출 ➔ 5개 국어 Firestore 일괄 저장
 */
export const ingestTourNews = functions.https.onCall(async (data: { artistId: string; tourId: string; newsInput: RawNewsInput }, context) => {
  const { artistId, tourId, newsInput } = data;

  // 1. 저작권 및 출처 유효성 검증
  const { isValid, isOfficial } = validateNewsSource(newsInput);
  if (!isValid) {
    throw new functions.https.HttpsError('invalid-argument', '유효하지 않은 뉴스 출처 URL입니다.');
  }

  // 2. Gemini 2.0 AI를 통한 사실관계 추출 및 5개 국어 동시 요약
  const multilingualFacts = await extractAndTranslateFacts(newsInput.rawContent, artistId);

  // 3. Firestore newsFacts 컬렉션에 각 언어별 도큐먼트 저장 (Batch Write)
  const batch = db.batch();
  const baseNewsId = `fact-${Date.now()}`;
  const languages: ('ko' | 'en' | 'ja' | 'zh' | 'sea')[] = ['ko', 'en', 'ja', 'zh', 'sea'];

  languages.forEach((lang) => {
    const langData = multilingualFacts[lang];
    if (langData) {
      const docRef = db.collection('newsFacts').doc(`${baseNewsId}-${lang}`);
      batch.set(docRef, {
        newsId: `${baseNewsId}-${lang}`,
        baseNewsId,
        artistId,
        tourId,
        language: lang === 'sea' ? 'en' : lang, // SEA는 en 호환
        title: langData.title,
        factSummary: langData.factSummary,
        sourceName: newsInput.sourceName,
        sourceUrl: newsInput.sourceUrl,
        isOfficial,
        publishedAt: newsInput.publishedAt || new Date().toISOString()
      });
    }
  });

  await batch.commit();
  return { success: true, baseNewsId, count: languages.length };
});