// Кэш загруженных праздников по годам
const cache = {};

// Российские государственные праздники (фиксированные даты)
// Используется как fallback если API недоступен
const FIXED_HOLIDAYS_RU = {
  '01-01': 'Новогодние каникулы',
  '01-02': 'Новогодние каникулы',
  '01-03': 'Новогодние каникулы',
  '01-04': 'Новогодние каникулы',
  '01-05': 'Новогодние каникулы',
  '01-06': 'Новогодние каникулы',
  '01-07': 'Рождество Христово',
  '01-08': 'Новогодние каникулы',
  '02-23': 'День защитника Отечества',
  '03-08': 'Международный женский день',
  '05-01': 'Праздник Весны и Труда',
  '05-09': 'День Победы',
  '06-12': 'День России',
  '11-04': 'День народного единства',
};

function fallbackHolidays(year) {
  const result = {};
  for (const [mmdd, name] of Object.entries(FIXED_HOLIDAYS_RU)) {
    result[`${year}-${mmdd}`] = name;
  }
  return result;
}

/**
 * Загружает праздники для указанного года.
 * Сначала пробует API, при ошибке использует встроенный список.
 */
export async function fetchHolidays(year) {
  if (cache[year]) return cache[year];

  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/RU`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const holidays = {};
    for (const h of data) {
      holidays[h.date] = h.localName;
    }
    cache[year] = holidays;
  } catch {
    cache[year] = fallbackHolidays(year);
  }

  return cache[year];
}

/**
 * Проверяет, является ли дата праздником.
 */
export function isHoliday(holidays, dateKey) {
  return holidays[dateKey] || null;
}
