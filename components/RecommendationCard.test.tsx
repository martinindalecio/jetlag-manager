import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecommendationCard } from "./RecommendationCard";
import type { Recommendation } from "@/lib/circadian/types";

const recommendation: Recommendation = {
  type: "seek_light",
  startUTC: "2026-08-01T22:00:00.000Z",
  endUTC: "2026-08-02T00:00:00.000Z",
  dayIndex: 0,
  text: "Get bright light exposure.",
};

describe("RecommendationCard", () => {
  it("renders the type label and destination-local time window", () => {
    render(<RecommendationCard recommendation={recommendation} destTz="Asia/Tokyo" active={false} />);

    expect(screen.getByText(/seek bright light/i)).toBeInTheDocument();
    // 22:00 UTC / 00:00 UTC next day, in Asia/Tokyo (UTC+9) -> 7:00 AM - 9:00 AM
    expect(screen.getByText(/7:00 AM.*9:00 AM/)).toBeInTheDocument();
  });

  it("does not mark an inactive recommendation as active", () => {
    render(<RecommendationCard recommendation={recommendation} destTz="Asia/Tokyo" active={false} />);

    expect(screen.queryByText(/active now/i)).not.toBeInTheDocument();
    expect(screen.getByText(/seek bright light/i).closest("[aria-current]")).not.toBeInTheDocument();
  });

  it("marks an active recommendation with aria-current and visible text", () => {
    render(<RecommendationCard recommendation={recommendation} destTz="Asia/Tokyo" active={true} />);

    expect(screen.getByText(/active now/i)).toBeInTheDocument();
    expect(screen.getByText(/seek bright light/i).closest('[aria-current="true"]')).toBeInTheDocument();
  });
});
