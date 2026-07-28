import { describe, expect, it } from "vitest";
import { clampDaysToTrip } from "./quickTurnaroundGuard";

describe("clampDaysToTrip", () => {
  it("returns nDays unchanged when availableDays is undefined", () => {
    expect(clampDaysToTrip(8, undefined)).toBe(8);
  });

  it("clamps down to availableDays when it's the limiting factor", () => {
    expect(clampDaysToTrip(4, 2)).toBe(2);
  });

  it("does not clamp above nDays when availableDays is more generous", () => {
    expect(clampDaysToTrip(4, 10)).toBe(4);
  });

  it("floors a fractional availableDays", () => {
    expect(clampDaysToTrip(4, 2.9)).toBe(2);
  });

  it("never returns a negative number", () => {
    expect(clampDaysToTrip(4, -3)).toBe(0);
  });
});
