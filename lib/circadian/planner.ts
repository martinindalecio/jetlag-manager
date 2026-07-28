import type { ChronotypeProfile, Plan, Trip } from "./types";
import { tzOffsetMs } from "../timezones/zonedTime";
import { chooseDirection, requiredShift as computeRequiredShift } from "./direction";
import { computeDays, MAX_DAILY_RATE_HOURS } from "./rate";
import { clampDaysToTrip } from "./quickTurnaroundGuard";
import { buildRecommendations } from "./recommendations";

export function buildDailyPlan(profile: ChronotypeProfile, trip: Trip): Plan {
  const arriveInstant = new Date(trip.arriveUTC);

  // Raw (non-normalized) origin -> dest UTC-offset delta at arrival. This is
  // the same quantity direction.ts normalizes to pick advance vs delay.
  const rawDelta =
    tzOffsetMs(arriveInstant, trip.destTz) / 3.6e6 - tzOffsetMs(arriveInstant, trip.originTz) / 3.6e6;

  const direction = chooseDirection(rawDelta);
  const shift = computeRequiredShift(rawDelta);
  const maxDaily = MAX_DAILY_RATE_HOURS;

  const nDaysPlanned = computeDays(shift, maxDaily);
  const nDaysActual = clampDaysToTrip(nDaysPlanned, trip.availableDays);

  const recommendations = buildRecommendations(profile, trip, direction, shift, maxDaily, nDaysActual);

  return {
    direction,
    requiredShift: shift,
    maxDaily,
    nDaysPlanned,
    nDaysActual,
    recommendations,
  };
}
