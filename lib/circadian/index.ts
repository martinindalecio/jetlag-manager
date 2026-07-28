import type { ChronotypeProfile, Plan, Trip } from "./types";
import { buildDailyPlan } from "./planner";

export function planTrip(profile: ChronotypeProfile, trip: Trip): Plan {
  return buildDailyPlan(profile, trip);
}

export * from "./types";
export { getCurrentStatus } from "./currentStatus";
