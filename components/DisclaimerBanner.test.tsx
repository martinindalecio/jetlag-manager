import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DisclaimerBanner } from "./DisclaimerBanner";

describe("DisclaimerBanner", () => {
  it("calls onCheckedChange with the new value when the checkbox is toggled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<DisclaimerBanner checked={false} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("reflects the checked prop on the checkbox", () => {
    const { rerender } = render(<DisclaimerBanner checked={false} onCheckedChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(<DisclaimerBanner checked={true} onCheckedChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("discloses that this is not a medical device and has not been evaluated by the FDA", () => {
    render(<DisclaimerBanner checked={false} onCheckedChange={vi.fn()} />);
    const text = document.body.textContent ?? "";

    expect(text).toMatch(/not a medical device/i);
    expect(text).toMatch(/FDA/);
  });

  it("discloses that it does not diagnose, treat, or provide medical advice", () => {
    render(<DisclaimerBanner checked={false} onCheckedChange={vi.fn()} />);
    const text = document.body.textContent ?? "";

    expect(text).toMatch(/does not diagnose, treat, or provide medical advice/i);
  });

  it("discloses the 18+ / consult-a-doctor guidance for at-risk conditions", () => {
    render(<DisclaimerBanner checked={false} onCheckedChange={vi.fn()} />);
    const text = document.body.textContent ?? "";

    expect(text).toMatch(/18/);
    expect(text).toMatch(/sleep disorder/i);
    expect(text).toMatch(/bipolar disorder/i);
    expect(text).toMatch(/epilepsy/i);
    expect(text).toMatch(/doctor/i);
  });

  it("renders an acknowledgement checkbox with an associated label", () => {
    render(<DisclaimerBanner checked={false} onCheckedChange={vi.fn()} />);
    expect(screen.getByLabelText(/i understand and acknowledge this/i)).toBeInTheDocument();
  });
});
