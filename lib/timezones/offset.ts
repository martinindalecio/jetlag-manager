// DST-aware UTC offset helpers using only Intl.DateTimeFormat.
// No external dependencies — the runtime's own ICU data is the source of truth.

/**
 * Returns the UTC offset in hours (e.g. -4 for EDT, 9 for JST) that the given
 * IANA time zone has at the given instant. Positive = ahead of UTC.
 */
export function utcOffsetHours(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  });
  const parts = dtf.formatToParts(instant);
  const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  // offsetPart looks like "GMT-4", "GMT+9:30", "GMT+0"
  const match = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours + minutes / 60);
}

/**
 * Signed hour difference between two IANA time zones at a given instant
 * (destTz offset minus originTz offset). This is the raw, non-normalized
 * delta the circadian engine's planner consumes — it can exceed +/-12.
 */
export function rawTzDelta(
  instant: Date,
  originTz: string,
  destTz: string
): number {
  return utcOffsetHours(instant, destTz) - utcOffsetHours(instant, originTz);
}
