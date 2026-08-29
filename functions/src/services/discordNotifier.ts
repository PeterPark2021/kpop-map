export interface DiscordEmbedPayload {
  artistName: string;
  cityName: string;
  venueName: string;
  status: string;
  eventDate: string;
  ticketUrl?: string;
  imageUrl?: string;
}

export async function sendDiscordWebhookNotification(
  webhookUrl: string,
  payload: DiscordEmbedPayload
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    return { success: false, error: 'INVALID_DISCORD_WEBHOOK_URL' };
  }

  const embed = {
    title: `🎫 [티켓 오픈] ${payload.artistName} - ${payload.cityName} 공연 예매 시작!`,
    description: `**${payload.artistName}**의 2026 글로벌 스타디움 투어 **${payload.cityName}** 일정 티켓팅이 오픈되었습니다!`,
    url: payload.ticketUrl || 'https://kpop-map-prod.web.app',
    color: 0xffd700, // K-POP Gold
    fields: [
      { name: '📍 도시 및 공연장', value: `${payload.cityName} (${payload.venueName})`, inline: true },
      { name: '📅 공연 일시', value: new Date(payload.eventDate).toLocaleDateString(), inline: true },
      { name: '⚡ 상태', value: payload.status === 'ticketOpen' ? '🟢 티켓 오픈 (ON SALE)' : payload.status, inline: false }
    ],
    thumbnail: {
      url: payload.imageUrl || 'https://kpop-map-prod.web.app/favicon.svg'
    },
    footer: {
      text: 'K-POP Tour Pulse 실시간 알림 봇 | https://kpop-map-prod.web.app'
    },
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'K-POP Tour Pulse Bot',
        avatar_url: 'https://kpop-map-prod.web.app/favicon.svg',
        embeds: [embed]
      })
    });

    if (!res.ok) {
      return { success: false, statusCode: res.status, error: res.statusText };
    }
    return { success: true, statusCode: res.status };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}