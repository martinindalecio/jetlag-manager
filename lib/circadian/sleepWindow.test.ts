import { describe, expect, it } from "vitest";
import { deriveSleepWindow } from "./sleepWindow";

describe("deriveSleepWindow", () => {
  it("computes wake as cbtmin + 2h and bedtime as wake - sleepDuration", () => {
    const cbtmin = 300; // 05:00
    const sleepDurationHours = 8;
    // wake = 05:00 + 2h = 07:00 = 420
    // bedtime = 07:00 - 8h = 23:00 (previous day) = 1380
    expect(deriveSleepWindow(cbtmin, sleepDurationHours)).toEqual({ bedtimeMin: 1380, wakeMin: 420 });
  });

  it("wraps correctly when wake time is early in the day", () => {
    const cbtmin = 0; // 00:00
    const sleepDurationHours = 8;
    // wake = 00:00 + 2h = 02:00 = 120
    // bedtime = 02:00 - 8h = 18:00 (previous day) = 1080
    expect(deriveSleepWindow(cbtmin, sleepDurationHours)).toEqual({ bedtimeMin: 1080, wakeMin: 120 });
  });
});
