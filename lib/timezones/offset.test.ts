import { describe, expect, it } from "vitest";
import { utcOffsetHours, rawTzDelta } from "./offset";

describe("offset", () => {
  it("utcOffsetHours reports -4 for America/New_York in EDT (summer)", () => {
    const instant = new Date("2026-07-15T12:00:00Z");
    const offset = utcOffsetHours(instant, "America/New_York");
    expect(offset).toBe(-4);
  });

  it("utcOffsetHours reports 9 for Asia/Tokyo (no DST)", () => {
    const instant = new Date("2026-07-15T12:00:00Z");
    const offset = utcOffsetHours(instant, "Asia/Tokyo");
    expect(offset).toBe(9);
  });

  it("utcOffsetHours reports -5 for America/New_York in EST (winter)", () => {
    const instant = new Date("2026-01-15T12:00:00Z");
    const offset = utcOffsetHours(instant, "America/New_York");
    expect(offset).toBe(-5);
  });

  it("rawTzDelta computes the difference between two time zones", () => {
    const instant = new Date("2026-07-15T12:00:00Z");
    const delta = rawTzDelta(instant, "America/New_York", "Asia/Tokyo");
    // Tokyo is UTC+9, New York is UTC-4 in summer -> 9 - (-4) = 13
    expect(delta).toBe(13);
  });
});
