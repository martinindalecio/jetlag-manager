import { describe, expect, it } from "vitest";
import { estimatePhase } from "./phase";
import type { ChronotypeProfile } from "./types";

const profile: ChronotypeProfile = {
  workBedtime: "23:00",
  workWakeTime: "07:00",
  freeBedtime: "00:30",
  freeWakeTime: "08:30",
};

describe("estimatePhase", () => {
  it("computes CBTmin as wake time minus 2h", () => {
    expect(estimatePhase(profile).cbtmin).toBe("05:00");
  });

  it("computes DLMO as CBTmin minus 7h", () => {
    expect(estimatePhase(profile).dlmo).toBe("22:00");
  });

  it("wraps correctly across midnight for an early wake time", () => {
    const earlyProfile: ChronotypeProfile = { ...profile, workWakeTime: "01:00" };
    // cbtmin = 01:00 - 2h = 23:00 (previous day)
    // dlmo = 23:00 - 7h = 16:00 (previous day)
    const { cbtmin, dlmo } = estimatePhase(earlyProfile);
    expect(cbtmin).toBe("23:00");
    expect(dlmo).toBe("16:00");
  });
});
