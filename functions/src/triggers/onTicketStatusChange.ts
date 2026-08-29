/**
 * [티켓 상태 변경 시 이메일 알림 트리거 및 중복 방지 로직]
 * 1. ticketStatus 변경 시 ('ticketOpen', 'presale', 'inProgress')
 * 2. notifiedStatuses 배열 확인 -> 이미 발송된 상태면 즉시 탈출 (중복 방지)
 * 3. 해당 아티스트 팔로우 + emailEnabled == true 인 사용자만 조회
 * 4. 각 사용자의 선호 언어로 이메일 전송 (mail 컬렉션 기록)
 * 5. event.notifiedStatuses 에 추가하여 2회차 발송 원천 차단
 */

export interface TicketStatusNotificationPayload {
  eventId: string;
  artistId: string;
  artistName: string;
  city: string;
  venueName: string;
  status: string;
  ticketUrl?: string;
}

export function buildNotificationEmailHtml(payload: TicketStatusNotificationPayload, lang: string, uid: string): { subject: string; html: string } {
  const subjects: Record<string, string> = {
    ko: `🔔 [티켓 오픈] ${payload.artistName} ${payload.city} 공연 티켓팅이 시작되었습니다!`,
    en: `🔔 [Ticket Alert] ${payload.artistName} in ${payload.city} tickets are now available!`,
    ja: `🔔 [チケット発売] ${payload.artistName} ${payload.city}公演のチケット受付が開始されました！`,
    zh: `🔔 [門票開賣] ${payload.artistName} ${payload.city}站 演唱會門票現已開賣！`,
    sea: `🔔 [Ticket Alert] ${payload.artistName} in ${payload.city} tickets are now open!`
  };

  const subject = subjects[lang] || subjects.en;
  const unsubscribeUrl = `https://kpop-map-prod.web.app/unsubscribe?uid=${uid}&token=safe_${uid.slice(0, 8)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background: #0b0e14; color: #f8fafc; padding: 30px; border-radius: 12px;">
      <h1 style="color: #ffd700; margin-top: 0;">K-POP TOUR PULSE</h1>
      <h2>${payload.artistName} - ${payload.city}</h2>
      <p style="font-size: 16px; color: #cbd5e1;">
        공연장: <strong>${payload.venueName}</strong><br/>
        상태: <strong style="color: #22c55e;">${payload.status === 'ticketOpen' ? '티켓 오픈 (ON SALE)' : payload.status}</strong>
      </p>
      ${payload.ticketUrl ? `<a href="${payload.ticketUrl}" style="display: inline-block; background: #eab308; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 16px 0;">예매처 바로가기 (Buy Tickets)</a>` : ''}
      <hr style="border: 1px solid #1e2433; margin: 24px 0;" />
      <footer style="font-size: 11px; color: #64748b;">
        본 메일은 K-POP Tour Pulse 관심 아티스트 알림에 동의하신 회원님께 발송되었습니다.<br/>
        더 이상 알림을 원하지 않으시면 <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">여기(수신거부)</a>를 클릭하세요.
      </footer>
    </div>
  `;

  return { subject, html };
}