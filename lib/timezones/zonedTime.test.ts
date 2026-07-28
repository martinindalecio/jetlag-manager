import { describe, expect, it } from "vitest";
import { tzOffsetMs, utcToZonedDateParts, zonedWallTimeToUtc } from "./zonedTime";

describe("zonedTime", () => {
  it("converts a known EST wall-clock time to the correct UTC instant", () => {
    // 2026-01-15 09:00 in America/New_York is EST (UTC-5) -> 14:00 UTC.
    const utc = zonedWallTimeToUtc(
      { year: 2026, month: 1, day: 15, hour: 9, minute: 0 },
      "America/New_York"
    );
    expect(utc.toISOString()).toBe("2026-01-15T14:00:00.000Z");
  });

  it("round-trips UTC -> zoned parts -> UTC", () => {
    const original = new Date("2026-01-15T14:00:00Z");
    const parts = utcToZonedDateParts(original, "America/New_York");
    expect(parts).toEqual({ year: 2026, month: 1, day: 15, hour: 9, minute: 0 });

    const roundTripped = zonedWallTimeToUtc(parts, "America/New_York");
    expect(roundTripped.getTime()).toBe(original.getTime());
  });

  it("reports a -5h offset for America/New_York in EST", () => {
    const instant = new Date("2026-01-15T14:00:00Z");
    const offsetMs = tzOffsetMs(instant, "America/New_York");
    expect(offsetMs).toBe(-5 * 60 * 60 * 1000);
  });

  it("reports a -4h offset for America/New_York in EDT (summer)", () => {
    const instant = new Date("2026-07-15T14:00:00Z");
    const offsetMs = tzOffsetMs(instant, "America/New_York");
    expect(offsetMs).toBe(-4 * 60 * 60 * 1000);
  });

  it("handles a positive UTC offset (Asia/Tokyo, UTC+9, no DST)", () => {
    const utc = zonedWallTimeToUtc(
      { year: 2026, month: 7, day: 15, hour: 21, minute: 0 },
      "Asia/Tokyo"
    );
    expect(utc.toISOString()).toBe("2026-07-15T12:00:00.000Z");
  });
});
