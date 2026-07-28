import { describe, expect, it } from "vitest";
import { chooseDirection, normalizeDelta, requiredShift } from "./direction";

describe("normalizeDelta", () => {
  it("keeps the boundary values distinct: +12 stays +12, -12 stays -12", () => {
    expect(normalizeDelta(12)).toBe(12);
    expect(normalizeDelta(-12)).toBe(-12);
    expect(normalizeDelta(12)).not.toBe(normalizeDelta(-12));
  });

  it("leaves values already within [-12, 12] unchanged", () => {
    expect(normalizeDelta(11)).toBe(11);
    expect(normalizeDelta(-11)).toBe(-11);
    expect(normalizeDelta(0)).toBe(0);
  });

  it("wraps values past +12 to the negative side", () => {
    expect(normalizeDelta(13)).toBe(-11);
    expect(normalizeDelta(23)).toBe(-1);
  });

  it("wraps values past -12 to the positive side", () => {
    expect(normalizeDelta(-13)).toBe(11);
    expect(normalizeDelta(-23)).toBe(1);
  });

  it("handles magnitudes beyond a single day", () => {
    expect(normalizeDelta(25)).toBe(1);
    expect(normalizeDelta(36)).toBe(12);
  });

  it("never produces NaN or a value outside [-12, 12]", () => {
    for (let d = -30; d <= 30; d++) {
      const n = normalizeDelta(d);
      expect(Number.isNaN(n)).toBe(false);
      expect(n).toBeGreaterThanOrEqual(-12);
      expect(n).toBeLessThanOrEqual(12);
    }
  });
});

describe("chooseDirection", () => {
  it("picks advance for a positive normalized delta", () => {
    expect(chooseDirection(5)).toBe("advance");
    expect(chooseDirection(11)).toBe("advance");
    expect(chooseDirection(12)).toBe("advance");
  });

  it("picks delay for a negative normalized delta", () => {
    expect(chooseDirection(-5)).toBe("delay");
    expect(chooseDirection(13)).toBe("delay"); // normalizes to -11
    expect(chooseDirection(-12)).toBe("delay");
  });
});

describe("requiredShift", () => {
  it("returns the absolute magnitude of the normalized delta", () => {
    expect(requiredShift(13)).toBe(11);
    expect(requiredShift(-3)).toBe(3);
    expect(requiredShift(5)).toBe(5);
    expect(requiredShift(12)).toBe(12);
    expect(requiredShift(-12)).toBe(12);
  });
});
