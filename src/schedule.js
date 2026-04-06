import { loadAnchor } from './storage.js';

export const PHASES = [
  { id: 0, name: 'День',        icon: 'sun',  class: 'phase-day'   },
  { id: 1, name: 'Ночь',        icon: 'moon', class: 'phase-night' },
  { id: 2, name: 'После ночи',  icon: null, label: 'с ночи',  class: 'phase-rest'  },
  { id: 3, name: 'Отдых',       icon: null, label: 'отдых',   class: 'phase-off'   },
];

const CYCLE = PHASES.length;

/**
 * Количество дней между двумя датами (dateKey формат "YYYY-MM-DD").
 */
function daysBetween(a, b) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / 86400000);
}

/**
 * Возвращает фазу для указанной даты (dateKey), или null если anchor не задан.
 */
export function getPhase(dateKey) {
  const anchor = loadAnchor();
  if (!anchor) return null;

  const diff = daysBetween(anchor.date, dateKey);
  // Правильный modulo для отрицательных чисел
  const phase = ((anchor.phase + diff) % CYCLE + CYCLE) % CYCLE;
  return PHASES[phase];
}
