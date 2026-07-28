import { describe, expect, it } from "vitest";
import { computeDays, MAX_DAILY_RATE_HOURS, shiftAccumulated } from "./rate";

describe("computeDays", () => {
  it("uses the default max daily rate of 1.5h/day", () => {
    expect(MAX_DAILY_RATE_HOURS).toBe(1.5);
    expect(computeDays(11)).toBe(8); // ceil(11/1.5) = 7.33 -> 8
    expect(computeDays(3)).toBe(2); // ceil(3/1.5) = 2
    expect(computeDays(5)).toBe(4); // ceil(5/1.5) = 3.33 -> 4
  });

  it("respects a custom max daily rate", () => {
    expect(computeDays(6, 2)).toBe(3);
  });

  it("returns 0 for zero required shift", () => {
    expect(computeDays(0)).toBe(0);
  });
});

describe("shiftAccumulated", () => {
  it("grows linearly at maxDaily per day", () => {
    expect(shiftAccumulated(0, 1.5, 11)).toBe(1.5);
    expect(shiftAccumulated(1, 1.5, 11)).toBe(3);
    expect(shiftAccumulated(6, 1.5, 11)).toBe(10.5);
  });

  it("caps at requiredShift once reached", () => {
    expect(shiftAccumulated(7, 1.5, 11)).toBe(11); // 8*1.5=12, capped to 11
    expect(shiftAccumulated(20, 1.5, 11)).toBe(11);
  });
});
