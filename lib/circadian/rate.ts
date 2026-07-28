export const MAX_DAILY_RATE_HOURS = 1.5; // MVP light-only baseline

export function computeDays(requiredShiftHours: number, maxDaily: number = MAX_DAILY_RATE_HOURS): number {
  return Math.ceil(requiredShiftHours / maxDaily);
}

/**
 * Accumulated phase shift (hours) achieved by the end of day index `d`
 * (0-based). Grows linearly at `maxDaily` hours/day and caps at
 * `requiredShift` once full realignment is reached.
 */
export function shiftAccumulated(d: number, maxDaily: number, requiredShift: number): number {
  return Math.min((d + 1) * maxDaily, requiredShift);
}
