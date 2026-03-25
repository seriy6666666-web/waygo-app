export function formatDuration(sec: number, locale: 'ru' | 'en' = 'ru'): string {
  const min = Math.floor(sec / 60);
  if (min < 60) return locale === 'ru' ? `${min} мин` : `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return locale === 'ru' ? `${h}ч ${m}м` : `${h}h ${m}m`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} м`;
  return (meters / 1000).toFixed(1);
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}
