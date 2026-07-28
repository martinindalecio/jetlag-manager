import { describe, expect, it } from "vitest";
import { CITIES } from "./cities";

describe("cities", () => {
  it("has at least 100 cities", () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(100);
  });

  it("all city ids are unique", () => {
    const ids = CITIES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all timezone strings are non-empty and contain a /", () => {
    CITIES.forEach((city) => {
      expect(city.timeZone).toBeTruthy();
      expect(city.timeZone).toContain("/");
    });
  });

  it("all timezone strings are valid IANA identifiers (Intl.DateTimeFormat does not throw)", () => {
    CITIES.forEach((city) => {
      expect(() => {
        new Intl.DateTimeFormat("en-US", { timeZone: city.timeZone });
      }).not.toThrow();
    });
  });
});
