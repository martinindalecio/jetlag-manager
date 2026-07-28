export function clampDaysToTrip(nDays: number, availableDays?: number): number {
  if (availableDays === undefined) return nDays;
  return Math.min(nDays, Math.max(0, Math.floor(availableDays)));
}
