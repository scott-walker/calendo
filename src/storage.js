const ANCHOR_KEY = 'calendo_anchor';

/**
 * Anchor — одна опорная точка: { date: "2026-04-06", phase: 0 }
 * От неё рассчитывается весь график.
 */
export function loadAnchor() {
  try {
    return JSON.parse(localStorage.getItem(ANCHOR_KEY));
  } catch {
    return null;
  }
}

export function saveAnchor(date, phase) {
  localStorage.setItem(ANCHOR_KEY, JSON.stringify({ date, phase }));
}
