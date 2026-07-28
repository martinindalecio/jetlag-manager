import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanTimeline } from "./PlanTimeline";
import { getCurrentStatus } from "@/lib/circadian";
import type { Plan, Recommendation } from "@/lib/circadian/types";

const sleep: Recommendation = {
  type: "sleep",
  startUTC: "2026-08-01T14:00:00.000Z",
  endUTC: "2026-08-01T22:00:00.000Z",
  dayIndex: 0,
  text: "Sleep during this window.",
};

const seekLight: Recommendation = {
  type: "seek_light",
  startUTC: "2026-08-01T22:00:00.000Z",
  endUTC: "2026-08-02T00:00:00.000Z",
  dayIndex: 0,
  text: "Seek bright light now.",
};

const avoidLight: Recommendation = {
  type: "avoid_light",
  startUTC: "2026-08-02T10:00:00.000Z",
  endUTC: "2026-08-02T12:00:00.000Z",
  dayIndex: 1,
  text: "Avoid bright light now.",
};

const plan: Plan = {
  direction: "delay",
  requiredShift: 3,
  maxDaily: 1.5,
  nDaysPlanned: 2,
  nDaysActual: 2,
  recommendations: [sleep, seekLight, avoidLight],
};

// Falls inside seekLight's window (22:00 - 00:00) and outside the other two.
const nowInsideSeekLight = new Date("2026-08-01T23:00:00.000Z");

describe("PlanTimeline", () => {
  it("groups recommendations by day and marks only the currently-active one as active", () => {
    const status = getCurrentStatus(plan, nowInsideSeekLight);
    expect(status.state).toBe("in_progress");
    expect(status.activeRecommendations).toEqual([seekLight]);

    render(<PlanTimeline plan={plan} destTz="Asia/Tokyo" activeRecommendations={status.activeRecommendations} />);

    expect(screen.getByText("Day 1")).toBeInTheDocument();
    expect(screen.getByText("Day 2")).toBeInTheDocument();

    // Exactly one card is marked active.
    expect(screen.getAllByText(/active now/i)).toHaveLength(1);

    const activeCard = screen.getByText(/seek bright light now/i).closest('[aria-current="true"]');
    expect(activeCard).toBeInTheDocument();

    expect(screen.getByText(/sleep during this window/i).closest("[aria-current]")).not.toBeInTheDocument();
    expect(screen.getByText(/avoid bright light now/i).closest("[aria-current]")).not.toBeInTheDocument();
  });

  it("marks nothing as active when now falls outside every recommendation window", () => {
    const status = getCurrentStatus(plan, new Date("2026-09-01T00:00:00.000Z"));
    expect(status.state).toBe("completed");

    render(<PlanTimeline plan={plan} destTz="Asia/Tokyo" activeRecommendations={status.activeRecommendations} />);

    expect(screen.queryByText(/active now/i)).not.toBeInTheDocument();
  });
});
