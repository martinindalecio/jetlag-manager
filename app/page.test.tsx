import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/lib/storage/profileStore", () => ({
  getProfile: vi.fn(),
}));

vi.mock("@/lib/storage/tripStore", () => ({
  listTrips: vi.fn(() => []),
}));

import Home from "./page";
import { getProfile } from "@/lib/storage/profileStore";
import { listTrips } from "@/lib/storage/tripStore";

beforeEach(() => {
  replaceMock.mockClear();
  vi.mocked(getProfile).mockReset();
  vi.mocked(listTrips).mockReset().mockReturnValue([]);
});

describe("Home page", () => {
  it("redirects to /onboarding when no profile exists, without rendering the trip list", () => {
    vi.mocked(getProfile).mockReturnValue(null);

    render(<Home />);

    expect(replaceMock).toHaveBeenCalledWith("/onboarding");
    expect(screen.queryByText(/plan a trip/i)).not.toBeInTheDocument();
  });

  it("renders the empty state with a 'Plan a trip' CTA when a profile exists and there are no trips", async () => {
    vi.mocked(getProfile).mockReturnValue({
      workBedtime: "23:00",
      workWakeTime: "07:00",
      freeBedtime: "00:30",
      freeWakeTime: "08:30",
      id: "profile-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    render(<Home />);

    expect(await screen.findByRole("link", { name: /plan a trip/i })).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
