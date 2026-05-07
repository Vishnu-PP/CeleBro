export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isSameMonthDay(date: Date, target: Date) {
  return date.getUTCMonth() === target.getUTCMonth() && date.getUTCDate() === target.getUTCDate();
}

export function daysUntilMonthDay(date: Date, from = new Date()) {
  const start = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  let next = new Date(Date.UTC(start.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  if (next < start) next = new Date(Date.UTC(start.getUTCFullYear() + 1, date.getUTCMonth(), date.getUTCDate()));
  return Math.ceil((next.getTime() - start.getTime()) / 86400000);
}
