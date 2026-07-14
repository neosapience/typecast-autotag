export function isValidCalendarDate(year?: number, month?: number, day?: number): boolean {
  if (month !== undefined && (month < 1 || month > 12)) return false;
  if (day === undefined) return true;
  if (month === undefined || day < 1) return false;

  const daysInMonth = new Date(Date.UTC(year ?? 2000, month, 0)).getUTCDate();
  return day <= daysInMonth;
}
