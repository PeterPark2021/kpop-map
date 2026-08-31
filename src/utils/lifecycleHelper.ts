import { TourEvent } from '../types/types';

/**
 * 🎯 상태 필드의 절대 우선순위 원칙:
 * 1. eventDate가 오늘(UTC)보다 과거 -> 'completed' (최종 권위)
 * 2. eventDate가 오늘(UTC)과 동일 -> 'inProgress'
 * 3. eventDate가 미래 -> 기존 status가 'ticketOpen'이면 유지, 아니면 'scheduled'
 */
export function computeLifecycleStatus(
  eventDateISO: string,
  currentStatus: TourEvent['status']
): TourEvent['status'] {
  const eventDate = new Date(eventDateISO);
  const today = new Date();

  const eventDateOnly = new Date(Date.UTC(
    eventDate.getUTCFullYear(),
    eventDate.getUTCMonth(),
    eventDate.getUTCDate()
  ));
  const todayOnly = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  ));

  if (eventDateOnly < todayOnly) {
    return 'completed';
  }
  if (eventDateOnly.getTime() === todayOnly.getTime()) {
    return 'inProgress';
  }
  return currentStatus === 'ticketOpen' ? 'ticketOpen' : 'scheduled';
}