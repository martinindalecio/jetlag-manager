import { mod1440 } from "./timeOfDay";

export interface SleepWindow {
  bedtimeMin: number;
  wakeMin: number;
}

/**
 * Sleep window for day-d, relative to that day's CBTmin (`cbtmin_d`,
 * minute-of-day) and the habitual sleep duration.
 *   wake_d    = cbtmin_d + 2h
 *   bedtime_d = wake_d - sleepDurationHours
 */
export function deriveSleepWindow(cbtmin_d: number, sleepDurationHours: number): SleepWindow {
  const wakeMin = mod1440(cbtmin_d + 2 * 60);
  const bedtimeMin = mod1440(wakeMin - sleepDurationHours * 60);
  return { bedtimeMin, wakeMin };
}
