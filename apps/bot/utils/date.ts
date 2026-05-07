export function datePartsInTimezone(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

export function dateKey(timezone: string, date = new Date()) {
  const parts = datePartsInTimezone(date, timezone);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function isMonthDayToday(date: Date, timezone: string, now = new Date()) {
  const today = datePartsInTimezone(now, timezone);
  const target = datePartsInTimezone(date, timezone);
  return today.month === target.month && today.day === target.day;
}

export function yearsSince(date: Date, timezone: string, now = new Date()) {
  return datePartsInTimezone(now, timezone).year - datePartsInTimezone(date, timezone).year;
}

export function daysUntilMonthDay(date: Date, timezone: string, now = new Date()) {
  const today = datePartsInTimezone(now, timezone);
  const target = datePartsInTimezone(date, timezone);
  const start = Date.UTC(today.year, today.month - 1, today.day);
  let next = Date.UTC(today.year, target.month - 1, target.day);
  if (next < start) next = Date.UTC(today.year + 1, target.month - 1, target.day);
  return Math.ceil((next - start) / 86400000);
}
