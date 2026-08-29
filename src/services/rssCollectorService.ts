import { RssFeedSource, TourNewsFact, RssSyncResult } from '../types/types';
import { officialRssSources } from '../data/rssSourcesCatalog';

const GLOBAL_CITIES = ['서울', 'Seoul', '도쿄', 'Tokyo', '로스앤젤레스', 'Los Angeles', 'LA', '뉴욕', 'New York', '런던', 'London', '파리', 'Paris', '방콕', 'Bangkok', '싱가포르', 'Singapore', '오사카', 'Osaka', '인천', 'Incheon', '시카고', 'Chicago', '자카르타', 'Jakarta', '베를린', 'Berlin', '시드니', 'Sydney', '후쿠오카', 'Fukuoka', '애틀랜타', 'Atlanta', '마드리드', 'Madrid'];
const VENUES = ['고척스카이돔', 'Gocheok Sky Dome', '잠실종합운동장', 'Olympic Stadium', '도쿄 돔', 'Tokyo Dome', '크립토닷컴 아레나', 'Crypto.com Arena', '아코르 아레나', 'Accor Arena', '메트라이프 스타디움', 'MetLife Stadium', '웸블리 스타디움', 'Wembley Stadium', 'KSPO DOME', '다저 스타디움', '스타드 드 프랑스', '국립경기장', '인천아시아드주경기장', '교세라 돔', '올스테이트 아레나', '알리안츠 스타디움', '페이페이 돔'];

class RssCollectorService {
  public getSources(): RssFeedSource[] {
    return officialRssSources;
  }

  // 지능형 팩트 추출 및 신뢰도 점수 산출
  public extractTourFact(
    title: string,
    content: string,
    source: RssFeedSource,
    artistId: string
  ): { fact: Partial<TourNewsFact>; confidence: number } {
    const fullText = `${title} ${content}`;
    
    // 1. 도시 검출
    const matchedCities = GLOBAL_CITIES.filter(c => fullText.includes(c));
    const city = matchedCities.length > 0 ? matchedCities[0] : '글로벌';

    // 2. 공연장 검출
    const matchedVenues = VENUES.filter(v => fullText.includes(v));
    const venue = matchedVenues.length > 0 ? matchedVenues[0] : undefined;

    // 3. 팩트 요약문 생성
    const facts: string[] = [];
    if (city !== '글로벌') facts.push(`투어 개최 도시: ${city}`);
    if (venue) facts.push(`공연장: ${venue}`);
    if (fullText.includes('티켓') || fullText.includes('Ticket') || fullText.includes('Open')) {
      facts.push('티켓 오픈 및 예매 정보 포함');
    }

    // 4. 신뢰도 점수(0.0 ~ 1.0) 계산
    let confidence = source.reliabilityWeight * 0.4;
    if (matchedCities.length > 0) confidence += 0.3;
    if (matchedVenues.length > 0) confidence += 0.2;
    if (source.isOfficial) confidence += 0.1;
    confidence = Math.min(1.0, Math.round(confidence * 100) / 100);

    const factSummary: Partial<TourNewsFact> = {
      newsId: `rss_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      artistId,
      title,
      summary: content.slice(0, 150) + '...',
      factSummary: facts.length > 0 ? facts : ['월드투어 및 공연 일정 보도'],
      sourceName: source.name,
      sourceUrl: source.siteUrl,
      isOfficial: source.isOfficial,
      publishedAt: new Date().toISOString(),
      language: 'ko',
      verificationConfidence: confidence,
      reviewStatus: confidence >= 0.85 && source.isOfficial ? 'approved' : 'pending'
    };

    return { fact: factSummary, confidence };
  }

  // 실시간 RSS 수집 및 파이프라인 시뮬레이션
  public async executeRssSync(): Promise<RssSyncResult> {
    const sources = this.getSources().filter(s => s.status === 'active');
    
    // 시뮬레이션 수집 데이터
    const sampleItems = [
      { title: '[공식] G-DRAGON 2026 월드투어 서울 고척스카이돔 3월 28일 티켓 오픈 확정', snippet: '갤럭시코퍼레이션은 지드래곤의 단독 월드투어 서울 고척스카이돔 공연 티켓 예매를 시작한다고 밝혔다.', source: sources[0], artistId: 'bigbang-gd' },
      { title: 'BTS 2026 완전체 월드투어 뉴욕 메트라이프 스타디움 일정 발표', snippet: '방탄소년단이 2026년 여름 뉴욕 메트라이프 스타디움에서 8만 관객과 만난다.', source: sources[1], artistId: 'bts' },
      { title: 'BLACKPINK 파리 스타드 드 프랑스 스타디움 투어 추가 확정', snippet: '블랙핑크가 프랑스 파리 스타드 드 프랑스에서 대규모 스타디움 공연을 개최한다.', source: sources[2], artistId: 'blackpink' }
    ];

    let autoApproved = 0;
    let pendingReview = 0;

    for (const item of sampleItems) {
      const { fact } = this.extractTourFact(item.title, item.snippet, item.source, item.artistId);
      if (fact.reviewStatus === 'approved') autoApproved++;
      else pendingReview++;
    }

    return {
      totalFeedsChecked: sources.length,
      totalArticlesFound: sampleItems.length,
      newFactsExtracted: sampleItems.length,
      autoApprovedCount: autoApproved,
      pendingReviewCount: pendingReview,
      duplicatesSkipped: 0,
      timestamp: new Date().toISOString()
    };
  }
}

export const rssCollectorService = new RssCollectorService();