
export function logEvent(key: string, payload?: any) {
  const a = window.localStorage.getItem('mestre_da_beleza_analytics');
  const arr = a ? JSON.parse(a) : [];
  arr.push({ event: key, payload, timestamp: Date.now() });
  window.localStorage.setItem('mestre_da_beleza_analytics', JSON.stringify(arr));
}
export function getAnalytics() {
  try {
    const a = window.localStorage.getItem('mestre_da_beleza_analytics');
    if (a) return JSON.parse(a);
  } catch {}
  return [];
}
export function clearAnalytics() {
  window.localStorage.removeItem('mestre_da_beleza_analytics');
}
