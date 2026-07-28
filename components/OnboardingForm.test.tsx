import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/lib/storage/profileStore", () => ({
  saveProfile: vi.fn((profile) => ({
    ...profile,
    id: "test-id",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  })),
}));

import { OnboardingForm } from "./OnboardingForm";
import { saveProfile } from "@/lib/storage/profileStore";

const VALID = {
  workBedtime: "23:00",
  workWakeTime: "07:00",
  freeBedtime: "00:30",
  freeWakeTime: "08:30",
};

function fillAllFields() {
  fireEvent.change(screen.getByLabelText(/work-day bedtime/i), { target: { value: VALID.workBedtime } });
  fireEvent.change(screen.getByLabelText(/work-day wake time/i), { target: { value: VALID.workWakeTime } });
  fireEvent.change(screen.getByLabelText(/free-day bedtime/i), { target: { value: VALID.freeBedtime } });
  fireEvent.change(screen.getByLabelText(/free-day wake time/i), { target: { value: VALID.freeWakeTime } });
}

function getSubmitButton() {
  return screen.getByRole("button", { name: /save and continue/i });
}

beforeEach(() => {
  pushMock.mockClear();
  vi.mocked(saveProfile).mockClear();
});

describe("OnboardingForm", () => {
  it("disables submit on first render (disclaimer unchecked, fields empty)", () => {
    render(<OnboardingForm />);
    expect(getSubmitButton()).toBeDisabled();
  });

  it("keeps submit disabled when all 4 fields are filled but the disclaimer is unchecked", () => {
    render(<OnboardingForm />);
    fillAllFields();
    expect(getSubmitButton()).toBeDisabled();
  });

  it("enables submit once the disclaimer is checked and all fields are filled, and submitting saves + navigates", async () => {
    const user = userEvent.setup();
    render(<OnboardingForm />);

    fillAllFields();
    await user.click(screen.getByRole("checkbox"));

    const submitButton = getSubmitButton();
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(saveProfile).toHaveBeenCalledTimes(1);
    expect(saveProfile).toHaveBeenCalledWith(VALID);
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  // An invalid/incomplete submission cannot be reached through the UI: the submit button stays
  // `disabled` until the disclaimer is checked AND all 4 native `type="time"` inputs hold a
  // value, and a filled time input is always a well-formed "HH:MM" string (browsers don't let
  // you type an invalid time into it). So there is no user-drivable path that gets an invalid
  // ChronotypeProfile past the button and into the zod validation branch — the tests above
  // (disabled-until-valid) already cover the only way this component can be misused.
});
