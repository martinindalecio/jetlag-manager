import { describe, expect, it } from "vitest";
import { avoidLightWindow, seekLightWindow } from "./lightWindows";

// cbtmin_d = 05:00 = 300 minutes
const CBTMIN = 300;

describe("seekLightWindow", () => {
  it("advance: [cbtmin, cbtmin + 4h]", () => {
    expect(seekLightWindow(CBTMIN, "advance")).toEqual({ startMin: 300, endMin: 540 }); // 05:00 - 09:00
  });

  it("delay: [cbtmin - 6h, cbtmin]", () => {
    // 05:00 - 6h = 23:00 (previous day) -> 1380
    expect(seekLightWindow(CBTMIN, "delay")).toEqual({ startMin: 1380, endMin: 300 }); // 23:00 -> 05:00
  });
});

describe("avoidLightWindow", () => {
  it("advance: [cbtmin - 6h, cbtmin]", () => {
    expect(avoidLightWindow(CBTMIN, "advance")).toEqual({ startMin: 1380, endMin: 300 });
  });

  it("delay: [cbtmin, cbtmin + 4h]", () => {
    expect(avoidLightWindow(CBTMIN, "delay")).toEqual({ startMin: 300, endMin: 540 });
  });
});

describe("boundary wrap behavior", () => {
  it("wraps cleanly when cbtmin_d is near midnight", () => {
    const nearMidnight = 60; // 01:00
    const win = avoidLightWindow(nearMidnight, "advance"); // [01:00 - 6h, 01:00] = [19:00 prev, 01:00]
    expect(win).toEqual({ startMin: 19 * 60, endMin: 60 });
  });
});
