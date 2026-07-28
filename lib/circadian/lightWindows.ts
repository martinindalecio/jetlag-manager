import type { Direction } from "./types";
import { addHoursToMinutes, mod1440 } from "./timeOfDay";

export interface MinuteWindow {
  startMin: number;
  endMin: number;
}

/**
 * Light-seeking window for day-d, relative to that day's CBTmin
 * (`cbtmin_d`, minute-of-day, 0..1439).
 *   advance: [cbtmin_d, cbtmin_d + 4h]
 *   delay:   [cbtmin_d - 6h, cbtmin_d]
 * Each boundary is independently wrapped into [0, 1440) — callers detect a
 * midnight crossing by comparing endMin < startMin.
 */
export function seekLightWindow(cbtmin_d: number, direction: Direction): MinuteWindow {
  const cbtmin = mod1440(cbtmin_d);
  if (direction === "advance") {
    return { startMin: cbtmin, endMin: addHoursToMinutes(cbtmin, 4) };
  }
  return { startMin: addHoursToMinutes(cbtmin, -6), endMin: cbtmin };
}

/**
 * Light-avoiding window for day-d, relative to `cbtmin_d`.
 *   advance: [cbtmin_d - 6h, cbtmin_d]
 *   delay:   [cbtmin_d, cbtmin_d + 4h]
 */
export function avoidLightWindow(cbtmin_d: number, direction: Direction): MinuteWindow {
  const cbtmin = mod1440(cbtmin_d);
  if (direction === "advance") {
    return { startMin: addHoursToMinutes(cbtmin, -6), endMin: cbtmin };
  }
  return { startMin: cbtmin, endMin: addHoursToMinutes(cbtmin, 4) };
}
