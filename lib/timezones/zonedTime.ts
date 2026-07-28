// Small UTC <-> zoned-time helpers used by the circadian engine.
// DST-safe, no external dependency: relies on Intl.DateTimeFormat only.

/**
 * Returns (wall-clock-in-timeZone) - (instant as UTC), in ms.
 * E.g. for a timeZone at UTC-5, this returns -5 * 3600 * 1000.
 */
export function tzOffsetMs(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(instant);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  const asUTC = Date.UTC(
    +map.year,
    +map.month - 1,
    +map.day,
    +map.hour,
    +map.minute,
    +map.second
  );
  return asUTC - instant.getTime();
}

/**
 * Converts a destination-local wall-clock time on a given calendar date
 * into the absolute UTC instant it represents, DST-safe.
 */
export function zonedWallTimeToUtc(
  wall: { year: number; month: number; day: number; hour: number; minute: number },
  timeZone: string
): Date {
  const guess = new Date(
    Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute)
  );
  const offset = tzOffsetMs(guess, timeZone);
  return new Date(guess.getTime() - offset);
}

/**
 * Converts a UTC instant into its wall-clock date/time parts in the given
 * time zone.
 */
export function utcToZonedDateParts(
  instant: Date,
  timeZone: string
): { year: number; month: number; day: number; hour: number; minute: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = dtf.formatToParts(instant);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return {
    year: +map.year,
    month: +map.month,
    day: +map.day,
    hour: +map.hour,
    minute: +map.minute,
  };
}
