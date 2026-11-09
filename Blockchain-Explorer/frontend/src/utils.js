export const short = (h, a = 8, b = 6) =>
  h && h.length > a + b + 1 ? `${h.slice(0, a)}…${h.slice(-b)}` : h;

export const timeAgo = (ts) => {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};