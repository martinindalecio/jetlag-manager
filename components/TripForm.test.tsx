import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
}));

const fixtureProfile = {
  workBedtime: "23:00",
  workWakeTime: "07:00",
  freeBedtime: "00:30",
  freeWakeTime: "08:30",
  id: "profile-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

vi.mock("@/lib/storage/profileStore", () => ({
  getProfile: vi.fn(() => fixtureProfile),
}));

const savedRecord = {
  id: "trip-123",
  label: "New York → Tokyo",
  originCityId: "nyc",
  destCityId: "tokyo",
  arriveUTC: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  plan: {
    direction: "delay",
    requiredShift: 3,
    maxDaily: 1.5,
    nDaysPlanned: 2,
    nDaysActual: 2,
    recommendations: [],
  },
};

vi.mock("@/lib/storage/tripStore", () => ({
  saveTrip: vi.fn(() => savedRecord),
}));

import { TripForm } from "./TripForm";
import { getProfile } from "@/lib/storage/profileStore";
import { saveTrip } from "@/lib/storage/tripStore";
import { utcToZonedDateParts } from "@/lib/timezones/zonedTime";

function getSubmitButton() {
  return screen.getByRole("button", { name: /create plan/i });
}

beforeEach(() => {
  pushMock.mockClear();
  replaceMock.mockClear();
  vi.mocked(getProfile).mockClear();
  vi.mocked(saveTrip).mockClear();
});

describe("TripForm", () => {
  it("blocks submit and shows an inline error when origin and destination are the same city", async () => {
    const user = userEvent.setup();
    render(<TripForm />);

    await user.selectOptions(screen.getByLabelText(/origin city/i), "nyc");
    await user.selectOptions(screen.getByLabelText(/destination city/i), "nyc");
    await user.type(screen.getByLabelText(/arrival date/i), "2026-08-01");
    await user.type(screen.getByLabelText(/arrival time/i), "09:00");

    await user.click(getSubmitButton());

    expect(await screen.findByText(/must be different cities/i)).toBeInTheDocument();
    expect(saveTrip).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("submits a valid trip: builds a correctly-shaped arriveUTC and redirects to the new trip", async () => {
    const user = userEvent.setup();
    render(<TripForm />);

    await user.selectOptions(screen.getByLabelText(/origin city/i), "nyc");
    await user.selectOptions(screen.getByLabelText(/destination city/i), "tokyo");
    await user.type(screen.getByLabelText(/arrival date/i), "2026-08-01");
    await user.type(screen.getByLabelText(/arrival time/i), "09:15");

    await user.click(getSubmitButton());

    expect(saveTrip).toHaveBeenCalledTimes(1);
    const [input, plan] = vi.mocked(saveTrip).mock.calls[0];

    expect(input.originCityId).toBe("nyc");
    expect(input.destCityId).toBe("tokyo");
    expect(input.label).toBe("New York → Tokyo");
    expect(input.availableDays).toBeUndefined();
    expect(plan).toBeDefined();

    // The real correctness risk: arriveUTC must round-trip, in the destination
    // time zone (Asia/Tokyo), back to the date/time entered above.
    const roundTripped = utcToZonedDateParts(new Date(input.arriveUTC), "Asia/Tokyo");
    expect(roundTripped).toEqual({ year: 2026, month: 8, day: 1, hour: 9, minute: 15 });

    expect(pushMock).toHaveBeenCalledWith("/trips/trip-123");
  });

  it("shows an inline error for a non-positive availableDays value and does not submit", async () => {
    const user = userEvent.setup();
    render(<TripForm />);

    await user.selectOptions(screen.getByLabelText(/origin city/i), "nyc");
    await user.selectOptions(screen.getByLabelText(/destination city/i), "tokyo");
    await user.type(screen.getByLabelText(/arrival date/i), "2026-08-01");
    await user.type(screen.getByLabelText(/arrival time/i), "09:15");
    await user.type(screen.getByLabelText(/days on the ground/i), "0");

    await user.click(getSubmitButton());

    expect(await screen.findByText(/whole number of 1 or more/i)).toBeInTheDocument();
    expect(saveTrip).not.toHaveBeenCalled();
  });

  it("redirects to onboarding instead of crashing if no profile exists at submit time", async () => {
    vi.mocked(getProfile).mockReturnValueOnce(null as unknown as ReturnType<typeof getProfile>);
    const user = userEvent.setup();
    render(<TripForm />);

    await user.selectOptions(screen.getByLabelText(/origin city/i), "nyc");
    await user.selectOptions(screen.getByLabelText(/destination city/i), "tokyo");
    await user.type(screen.getByLabelText(/arrival date/i), "2026-08-01");
    await user.type(screen.getByLabelText(/arrival time/i), "09:15");

    await user.click(getSubmitButton());

    expect(replaceMock).toHaveBeenCalledWith("/onboarding");
    expect(saveTrip).not.toHaveBeenCalled();
  });
});
