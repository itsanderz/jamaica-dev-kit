/**
 * Jamaica public holidays and business day utilities.
 *
 * Covers all gazetted public holidays including moveable feasts
 * (Easter-dependent) and fixed observances.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Holiday {
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Holiday name */
  name: string;
  /** Whether this is a moveable feast (Easter-dependent) */
  moveable: boolean;
  /** Additional notes */
  note?: string;
}

// ---------------------------------------------------------------------------
// Easter calculation (Anonymous Gregorian algorithm / Computus)
// ---------------------------------------------------------------------------

function computeEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get the Nth occurrence of a weekday in a given month.
 * weekday: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month - 1, 1);
  let day = 1 + ((weekday - first.getDay() + 7) % 7);
  day += (n - 1) * 7;
  return new Date(year, month - 1, day);
}

// ---------------------------------------------------------------------------
// Holiday definitions
// ---------------------------------------------------------------------------

function getFixedHolidays(year: number): Holiday[] {
  return [
    { date: `${year}-01-01`, name: "New Year's Day", moveable: false },
    { date: `${year}-05-23`, name: 'Labour Day', moveable: false },
    { date: `${year}-08-01`, name: 'Emancipation Day', moveable: false },
    { date: `${year}-08-06`, name: 'Independence Day', moveable: false },
    { date: `${year}-12-25`, name: 'Christmas Day', moveable: false },
    { date: `${year}-12-26`, name: 'Boxing Day', moveable: false },
  ];
}

function getMoveableHolidays(year: number): Holiday[] {
  const easter = computeEasterSunday(year);
  const ashWednesday = addDays(easter, -46);
  const goodFriday = addDays(easter, -2);
  const easterMonday = addDays(easter, 1);

  // National Heroes Day: 3rd Monday of October
  const heroesDay = nthWeekday(year, 10, 1, 3);

  return [
    { date: formatDate(ashWednesday), name: 'Ash Wednesday', moveable: true },
    { date: formatDate(goodFriday), name: 'Good Friday', moveable: true },
    { date: formatDate(easterMonday), name: 'Easter Monday', moveable: true },
    {
      date: formatDate(heroesDay),
      name: 'National Heroes Day',
      moveable: true,
      note: 'Third Monday of October',
    },
  ];
}

// ---------------------------------------------------------------------------
// Sunday substitution rule
// ---------------------------------------------------------------------------

/**
 * Apply Jamaica's Sunday-shift rule: when a fixed holiday falls on Sunday,
 * the following Monday is observed. If a substitute displaces another
 * holiday (e.g. Christmas Sun→Mon pushes Boxing Day Mon→Tue), the
 * displaced holiday shifts to the next available weekday.
 */
function applySundaySubstitution(holidays: Holiday[]): Holiday[] {
  const sorted = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  const observedDates = new Set<string>();
  const result: Holiday[] = [];

  for (const h of sorted) {
    const d = parseDate(h.date);
    let targetDate = h.date;

    if (d.getDay() === 0) {
      // Sunday — must shift to next available weekday
      let substitute = addDays(d, 1);
      while (observedDates.has(formatDate(substitute))) {
        substitute = addDays(substitute, 1);
      }
      targetDate = formatDate(substitute);
      result.push({
        date: targetDate,
        name: h.name,
        moveable: h.moveable,
        note: `Observed (substitute for ${h.date})`,
      });
    } else if (observedDates.has(h.date)) {
      // Date already taken by a prior substitute — shift forward
      let substitute = addDays(d, 1);
      while (observedDates.has(formatDate(substitute))) {
        substitute = addDays(substitute, 1);
      }
      targetDate = formatDate(substitute);
      result.push({
        date: targetDate,
        name: h.name,
        moveable: h.moveable,
        note: `Observed (shifted due to conflict on ${h.date})`,
      });
    } else {
      result.push(h);
    }

    observedDates.add(targetDate);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get all public holidays for a given year, sorted by date.
 * Fixed holidays that fall on Sunday are shifted to Monday (Jamaica law).
 */
export function getHolidays(year: number): Holiday[] {
  const fixed = applySundaySubstitution(getFixedHolidays(year));
  const moveable = getMoveableHolidays(year);
  const all = [...fixed, ...moveable];
  return all.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Check if a date is a Jamaican public holiday.
 */
export function isPublicHoliday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const dateStr = formatDate(d);
  const holidays = getHolidays(d.getFullYear());
  return holidays.some((h) => h.date === dateStr);
}

/**
 * Get the next upcoming public holiday from a given date.
 */
export function getNextHoliday(from?: Date | string): Holiday | null {
  const d = from ? (typeof from === 'string' ? parseDate(from) : from) : new Date();
  const dateStr = formatDate(d);
  const year = d.getFullYear();

  // Check current year
  const thisYear = getHolidays(year);
  const upcoming = thisYear.find((h) => h.date > dateStr);
  if (upcoming) return upcoming;

  // Check next year
  const nextYear = getHolidays(year + 1);
  return nextYear[0] ?? null;
}

/**
 * Check if a date is a business day (not a weekend and not a public holiday).
 */
export function isBusinessDay(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const day = d.getDay();
  if (day === 0 || day === 6) return false; // Weekend
  return !isPublicHoliday(d);
}

/**
 * Count working days (business days) between two dates (inclusive of start, exclusive of end).
 */
export function getWorkingDays(from: Date | string, to: Date | string): number {
  const start = typeof from === 'string' ? parseDate(from) : new Date(from);
  const end = typeof to === 'string' ? parseDate(to) : new Date(to);

  let count = 0;
  const current = new Date(start);
  while (current < end) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Get the date of Easter Sunday for a given year.
 * Useful for calculating other moveable feasts.
 */
export function getEasterSunday(year: number): string {
  return formatDate(computeEasterSunday(year));
}
