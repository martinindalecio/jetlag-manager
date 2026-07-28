import { describe, expect, it } from "vitest";
import { planTrip, getCurrentStatus } from "../../lib/circadian";
import { normalizeDelta } from "../../lib/circadian/direction";
import { utcToZonedDateParts } from "../../lib/timezones/zonedTime";
import type { ChronotypeProfile, Trip } from "../../lib/circadian/types";

const profile: ChronotypeProfile = {
  workBedtime: "23:00",
  workWakeTime: "07:00",
  freeBedtime: "00:30",
  freeWakeTime: "08:30",
};
// cbtmin = 05:00, sleepDurationHours = 8

describe("Case A — NY -> Tokyo (long eastward trip, delay-around strategy)", () => {
  const trip: Trip = {
    originTz: "America/New_York",
    destTz: "Asia/Tokyo",
    arriveUTC: "2026-07-15T05:00:00Z", // NY = UTC-4 (EDT), Tokyo = UTC+9 -> rawDelta = 13
  };

  it("normalizes the raw 13h delta to -11 (delay)", () => {
    expect(normalizeDelta(13)).toBe(-11);
  });

  const plan = planTrip(profile, trip);

  it("chooses delay direction with an 11h required shift", () => {
    expect(plan.direction).toBe("delay");
    expect(plan.requiredShift).toBe(11);
  });

  it("plans 8 days (ceil(11/1.5))", () => {
    expect(plan.nDaysPlanned).toBe(8);
    expect(plan.nDaysActual).toBe(8); // unconstrained trip
  });

  it("produces 3 recommendations per day for 8 days = 24 total", () => {
    expect(plan.recommendations).toHaveLength(24);
  });

  it("converges: last day's sleep window wake time lands back near the 07:00 CBTmin-derived anchor", () => {
    const lastDaySleep = plan.recommendations.find((r) => r.dayIndex === 7 && r.type === "sleep");
    expect(lastDaySleep).toBeDefined();

    const wakeInstant = new Date(lastDaySleep!.endUTC);
    const wakeLocal = utcToZonedDateParts(wakeInstant, trip.destTz);

    // Expect convergence to 07:00 Tokyo local time (cbtmin 05:00 + 2h),
    // within a few minutes.
    const wakeMinutes = wakeLocal.hour * 60 + wakeLocal.minute;
    const expectedMinutes = 7 * 60;
    expect(Math.abs(wakeMinutes - expectedMinutes)).toBeLessThanOrEqual(5);
  });
});

describe("Case B — NY -> LA (short westward trip)", () => {
  const trip: Trip = {
    originTz: "America/New_York",
    destTz: "America/Los_Angeles",
    arriveUTC: "2026-07-15T05:00:00Z",
  };

  const plan = planTrip(profile, trip);

  it("computes rawDelta as -3 for this NY->LA summer trip", () => {
    // Derived indirectly: requiredShift + direction must be consistent with rawDelta = -3
    expect(plan.direction).toBe("delay");
    expect(plan.requiredShift).toBe(3);
  });

  it("plans 2 days (ceil(3/1.5))", () => {
    expect(plan.nDaysPlanned).toBe(2);
    expect(plan.nDaysActual).toBe(2);
  });
});

describe("Case C — NY -> London, short trip clamped by availableDays", () => {
  const trip: Trip = {
    originTz: "America/New_York",
    destTz: "Europe/London",
    arriveUTC: "2026-07-15T05:00:00Z", // NY = UTC-4, London = UTC+1 (BST) -> rawDelta = 5
    availableDays: 2,
  };

  const plan = planTrip(profile, trip);

  it("chooses advance direction with a 5h required shift", () => {
    expect(plan.direction).toBe("advance");
    expect(plan.requiredShift).toBe(5);
  });

  it("naive plan would be 4 days, but clamps to 2 due to availableDays", () => {
    expect(plan.nDaysPlanned).toBe(4);
    expect(plan.nDaysActual).toBe(2);
  });

  it("produces exactly 6 recommendations (3/day x 2 days)", () => {
    expect(plan.recommendations).toHaveLength(6);
  });

  it("only generates dayIndex 0 or 1 — no out-of-bounds days", () => {
    for (const r of plan.recommendations) {
      expect([0, 1]).toContain(r.dayIndex);
    }
  });

  it("every recommendation has a valid, chronologically-ordered start/end instant", () => {
    for (const r of plan.recommendations) {
      const start = new Date(r.startUTC).getTime();
      const end = new Date(r.endUTC).getTime();
      expect(Number.isNaN(start)).toBe(false);
      expect(Number.isNaN(end)).toBe(false);
      expect(start).toBeLessThan(end);
    }
    // Array itself sorted by startUTC ascending
    for (let i = 1; i < plan.recommendations.length; i++) {
      const prev = new Date(plan.recommendations[i - 1].startUTC).getTime();
      const cur = new Date(plan.recommendations[i].startUTC).getTime();
      expect(prev).toBeLessThanOrEqual(cur);
    }
  });
});

describe("normalizeDelta boundary checks", () => {
  it("does not collapse +12 and -12 to the same value, and neither crashes/NaNs", () => {
    expect(normalizeDelta(12)).toBe(12);
    expect(normalizeDelta(-12)).toBe(-12);
    expect(normalizeDelta(12)).not.toBe(normalizeDelta(-12));
  });

  it("delta=11 stays positive (advance, cost 11) rather than wrapping to delay (cost 13)", () => {
    expect(normalizeDelta(11)).toBe(11);
  });
});

describe("getCurrentStatus — offline resolution against Case A's plan", () => {
  const trip: Trip = {
    originTz: "America/New_York",
    destTz: "Asia/Tokyo",
    arriveUTC: "2026-07-15T05:00:00Z",
  };
  const plan = planTrip(profile, trip);

  it("resolves in_progress when now falls inside day 3's avoid_light window", () => {
    const day3Avoid = plan.recommendations.find((r) => r.dayIndex === 3 && r.type === "avoid_light");
    expect(day3Avoid).toBeDefined();

    const start = new Date(day3Avoid!.startUTC);
    const midpoint = new Date(
      (start.getTime() + new Date(day3Avoid!.endUTC).getTime()) / 2
    );

    const status = getCurrentStatus(plan, midpoint);
    expect(status.state).toBe("in_progress");
    expect(status.activeRecommendations.some((r) => r.type === "avoid_light" && r.dayIndex === 3)).toBe(
      true
    );
    // Note: because daily shift (1.5h) is smaller than window width (4-10h),
    // adjacent days' light windows can genuinely overlap in UTC time — day 2's
    // avoid_light window (13:30-17:30 UTC) and day 3's (15:00-19:00 UTC) both
    // cover this midpoint. activeDayIndex reflects whichever active
    // recommendation starts earliest; both day indices are legitimately
    // "active" here.
    expect(status.activeDayIndex).not.toBeNull();
    expect(status.activeRecommendations.map((r) => r.dayIndex)).toContain(3);
  });

  it("resolves not_started a full day before the first recommendation", () => {
    const firstStart = new Date(plan.recommendations[0].startUTC);
    const before = new Date(firstStart.getTime() - 24 * 60 * 60 * 1000);
    expect(() => getCurrentStatus(plan, before)).not.toThrow();
    const status = getCurrentStatus(plan, before);
    expect(status.state).toBe("not_started");
    expect(status.nextRecommendation).not.toBeNull();
  });

  it("resolves completed a full day after the last recommendation ends", () => {
    const sorted = plan.recommendations.slice().sort((a, b) => new Date(a.endUTC).getTime() - new Date(b.endUTC).getTime());
    const lastEnd = new Date(sorted[sorted.length - 1].endUTC);
    const after = new Date(lastEnd.getTime() + 24 * 60 * 60 * 1000);
    expect(() => getCurrentStatus(plan, after)).not.toThrow();
    const status = getCurrentStatus(plan, after);
    expect(status.state).toBe("completed");
    expect(status.activeRecommendations).toHaveLength(0);
    expect(status.nextRecommendation).toBeNull();
  });
});
