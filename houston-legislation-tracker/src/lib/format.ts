const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Accepts "2026-09-20", "2026-09" or "2026" and returns a readable date. */
export function formatDate(value?: string): string {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!m) return y;
  const month = MONTHS[Number(m) - 1];
  if (!month) return value;
  return d ? `${month} ${Number(d)}, ${y}` : `${month} ${y}`;
}

/** Month + year only, e.g. "September 2026". */
export function formatMonthYear(value?: string): string {
  if (!value) return "";
  const [y, m] = value.split("-");
  if (!m) return y;
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** Turns a date into a value for <time dateTime="…"> */
export function isoAttr(value?: string): string | undefined {
  return value || undefined;
}

export function pluralize(n: number, one: string, many?: string) {
  return `${n} ${n === 1 ? one : many ?? one + "s"}`;
}
