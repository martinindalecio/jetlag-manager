"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DisclaimerBannerProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function DisclaimerBanner({ checked, onCheckedChange }: DisclaimerBannerProps) {
  return (
    <div
      role="note"
      aria-labelledby="disclaimer-heading"
      className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 sm:p-5"
    >
      <h2 id="disclaimer-heading" className="flex items-center gap-2 text-base font-semibold text-amber-900">
        <span aria-hidden="true">⚠️</span>
        Before you continue: this is not medical advice
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900">
        <li>
          Jetlag Manager is <strong>not a medical device</strong> and has not been evaluated or
          approved by the FDA or any other regulatory body.
        </li>
        <li>
          It does not diagnose, treat, or provide medical advice of any kind. It is an
          educational and scheduling tool that applies published circadian-science research to
          suggest light-exposure and sleep timing around travel — nothing more.
        </li>
        <li>
          It is intended for use by <strong>adults aged 18 and older</strong>. If you have a
          sleep disorder, a circadian rhythm disorder, bipolar disorder, epilepsy, or any other
          condition where shifting your light exposure or sleep timing could be risky, talk to a
          doctor before using this app.
        </li>
      </ul>
      <div className="mt-4 flex items-start gap-2 border-t border-amber-200 pt-4">
        <Checkbox
          id="disclaimer-acknowledge"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="mt-0.5"
        />
        <Label htmlFor="disclaimer-acknowledge" className="cursor-pointer font-normal text-amber-900">
          I understand and acknowledge this.
        </Label>
      </div>
    </div>
  );
}
