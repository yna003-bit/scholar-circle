const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

export function isActiveNow(lastSeenAt: string | null | undefined) {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < ACTIVE_WINDOW_MS;
}

export function lastSeenLabel(lastSeenAt: string | null | undefined) {
  if (!lastSeenAt) return "Offline";
  if (isActiveNow(lastSeenAt)) return "Active now";

  const minutes = Math.floor((Date.now() - new Date(lastSeenAt).getTime()) / 60000);
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Active ${days}d ago`;
}