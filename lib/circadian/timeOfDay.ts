// Shared "HH:MM" / minute-of-day arithmetic used across the circadian engine.
// Pure functions only — no Date objects, no timezone awareness. All results
// are wrapped into a single 24h day (mod 1440 minutes / mod 24 hours).

/** Wraps a minute count into [0, 1440). Handles negative input correctly. */
export function mod1440(minutes: number): number {
  return ((minutes % 1440) + 1440) % 1440;
}

/** Parses "HH:MM" into minutes since midnight (0..1439). */
export function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((part) => Number(part));
  return h * 60 + m;
}

/** Formats a minute-of-day value (any integer) back into "HH:MM", mod 24h. */
export function minutesToTime(minutes: number): string {
  const m = mod1440(minutes);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/** Adds (or subtracts, if negative) a number of hours to an "HH:MM" string, mod 24h. */
export function addHoursToTime(hhmm: string, hours: number): string {
  return minutesToTime(parseTimeToMinutes(hhmm) + hours * 60);
}

/** Adds (or subtracts) a number of hours to a minute-of-day value, mod 1440. */
export function addHoursToMinutes(minutes: number, hours: number): number {
  return mod1440(minutes + hours * 60);
}

/** Splits a minute-of-day value (expected 0..1439) into hour/minute parts. */
export function minutesToHourMinute(minutes: number): { hour: number; minute: number } {
  const m = mod1440(minutes);
  return { hour: Math.floor(m / 60), minute: m % 60 };
}
