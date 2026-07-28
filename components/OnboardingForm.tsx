"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChronotypeProfileSchema } from "@/lib/storage/schema";
import { saveProfile } from "@/lib/storage/profileStore";
import type { ChronotypeProfile } from "@/lib/circadian/types";

type FieldName = keyof ChronotypeProfile;

const FIELD_ORDER: FieldName[] = ["workBedtime", "workWakeTime", "freeBedtime", "freeWakeTime"];

const FIELD_LABELS: Record<FieldName, string> = {
  workBedtime: "Work-day bedtime",
  workWakeTime: "Work-day wake time",
  freeBedtime: "Free-day bedtime",
  freeWakeTime: "Free-day wake time",
};

const FREE_DAY_HELP_TEXT = "On a day with no obligations, e.g. a Saturday";

const initialFields: ChronotypeProfile = {
  workBedtime: "",
  workWakeTime: "",
  freeBedtime: "",
  freeWakeTime: "",
};

export function OnboardingForm() {
  const router = useRouter();
  const [fields, setFields] = useState<ChronotypeProfile>(initialFields);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const allFieldsFilled = FIELD_ORDER.every((field) => fields[field] !== "");
  const canSubmit = disclaimerChecked && allFieldsFilled;

  function handleFieldChange(field: FieldName, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const result = ChronotypeProfileSchema.safeParse(fields);

    if (!result.success) {
      const fieldErrors: Partial<Record<FieldName, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldName | undefined;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setFormError("Please fix the highlighted fields before continuing.");
      return;
    }

    saveProfile(result.data);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <DisclaimerBanner checked={disclaimerChecked} onCheckedChange={setDisclaimerChecked} />

      <Card>
        <CardHeader>
          <CardTitle>Your typical sleep schedule</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {FIELD_ORDER.map((field) => (
            <TimeField
              key={field}
              id={field}
              label={FIELD_LABELS[field]}
              helpText={field === "freeBedtime" || field === "freeWakeTime" ? FREE_DAY_HELP_TEXT : undefined}
              value={fields[field]}
              onChange={(value) => handleFieldChange(field, value)}
              error={errors[field]}
            />
          ))}
        </CardContent>
      </Card>

      {formError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={!canSubmit}>
        Save and continue
      </Button>
    </form>
  );
}

interface TimeFieldProps {
  id: FieldName;
  label: string;
  helpText?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function TimeField({ id, label, helpText, value, onChange, error }: TimeFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
      <Input
        id={id}
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
