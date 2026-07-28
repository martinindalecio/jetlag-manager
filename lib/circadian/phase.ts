import type { ChronotypeProfile } from "./types";
import { addHoursToTime } from "./timeOfDay";

/**
 * Estimates the two key circadian phase markers from a chronotype profile.
 *   CBTmin ≈ habitual work-day wake time − 2h
 *   DLMO   ≈ CBTmin − 7h
 */
export function estimatePhase(profile: ChronotypeProfile): { cbtmin: string; dlmo: string } {
  const cbtmin = addHoursToTime(profile.workWakeTime, -2);
  const dlmo = addHoursToTime(cbtmin, -7);
  return { cbtmin, dlmo };
}
