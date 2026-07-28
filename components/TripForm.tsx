"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CITIES } from "@/lib/data/cities";
import { getProfile } from "@/lib/storage/profileStore";
import { saveTrip } from "@/lib/storage/tripStore";
import { planTrip, type Trip } from "@/lib/circadian";
import { zonedWallTimeToUtc } from "@/lib/timezones/zonedTime";

const SORTED_CITIES = [...CITIES].sort(
  (a, b) => a.name.localeCompare(b.name) || a.country.localeCompare(b.country),
);

const selectClassName =
  "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

type FieldKey = "origin" | "dest" | "date" | "time" | "availableDays";

export function TripForm() {
  const router = useRouter();

  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [availableDaysInput, setAvailableDaysInput] = useState("");

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function clearErrors(...keys: FieldKey[]) {
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors: Partial<Record<FieldKey, string>> = {};

    if (!originId) fieldErrors.origin = "Choose an origin city.";
    if (!destId) fieldErrors.dest = "Choose a destination city.";
    if (originId && destId && originId === destId) {
      fieldErrors.dest = "Origin and destination must be different cities.";
    }
    if (!arrivalDate) fieldErrors.date = "Choose an arrival date.";
    if (!arrivalTime) fieldErrors.time = "Choose an arrival time.";

    let availableDays: number | undefined;
    if (availableDaysInput.trim() !== "") {
      const parsed = Number(availableDaysInput);
      if (!Number.isInteger(parsed) || parsed < 1) {
        fieldErrors.availableDays = "Enter a whole number of 1 or more, or leave this blank.";
      } else {
        availableDays = parsed;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setFormError("Please fix the highlighted fields before continuing.");
      return;
    }

    const profile = getProfile();
    if (!profile) {
      router.replace("/onboarding");
      return;
    }

    const originCity = CITIES.find((c) => c.id === originId);
    const destCity = CITIES.find((c) => c.id === destId);
    if (!originCity || !destCity) {
      setFormError("Something went wrong resolving the selected cities. Please try again.");
      return;
    }

    const [year, month, day] = arrivalDate.split("-").map(Number);
    const [hour, minute] = arrivalTime.split(":").map(Number);

    const arriveUTC = zonedWallTimeToUtc({ year, month, day, hour, minute }, destCity.timeZone).toISOString();

    const trip: Trip = {
      originTz: originCity.timeZone,
      destTz: destCity.timeZone,
      arriveUTC,
      ...(availableDays !== undefined ? { availableDays } : {}),
    };

    const plan = planTrip(profile, trip);

    const record = saveTrip(
      {
        label: `${originCity.name} → ${destCity.name}`,
        originCityId: originCity.id,
        destCityId: destCity.id,
        arriveUTC,
        ...(availableDays !== undefined ? { availableDays } : {}),
      },
      plan,
    );

    router.push(`/trips/${record.id}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Where and when</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="originCity">Origin city</Label>
            <select
              id="originCity"
              className={selectClassName}
              value={originId}
              onChange={(event) => {
                setOriginId(event.target.value);
                clearErrors("origin", "dest");
              }}
              aria-invalid={errors.origin ? true : undefined}
              aria-describedby={errors.origin ? "originCity-error" : undefined}
            >
              <option value="" disabled>
                Select a city
              </option>
              {SORTED_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
            {errors.origin && (
              <p id="originCity-error" role="alert" className="text-xs font-medium text-red-600">
                {errors.origin}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destCity">Destination city</Label>
            <select
              id="destCity"
              className={selectClassName}
              value={destId}
              onChange={(event) => {
                setDestId(event.target.value);
                clearErrors("dest", "origin");
              }}
              aria-invalid={errors.dest ? true : undefined}
              aria-describedby={errors.dest ? "destCity-error" : undefined}
            >
              <option value="" disabled>
                Select a city
              </option>
              {SORTED_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
            {errors.dest && (
              <p id="destCity-error" role="alert" className="text-xs font-medium text-red-600">
                {errors.dest}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="arrivalDate">Arrival date (destination local time)</Label>
            <p className="text-xs text-slate-500">
              The calendar date you land, as it will read on a clock in your destination city — not
              where you&apos;re flying from.
            </p>
            <Input
              id="arrivalDate"
              type="date"
              value={arrivalDate}
              onChange={(event) => {
                setArrivalDate(event.target.value);
                clearErrors("date");
              }}
              aria-invalid={errors.date ? true : undefined}
              aria-describedby={errors.date ? "arrivalDate-error" : undefined}
            />
            {errors.date && (
              <p id="arrivalDate-error" role="alert" className="text-xs font-medium text-red-600">
                {errors.date}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="arrivalTime">Arrival time (destination local time)</Label>
            <p className="text-xs text-slate-500">
              The clock time you land, local to your destination — same rule as the date above.
            </p>
            <Input
              id="arrivalTime"
              type="time"
              value={arrivalTime}
              onChange={(event) => {
                setArrivalTime(event.target.value);
                clearErrors("time");
              }}
              aria-invalid={errors.time ? true : undefined}
              aria-describedby={errors.time ? "arrivalTime-error" : undefined}
            />
            {errors.time && (
              <p id="arrivalTime-error" role="alert" className="text-xs font-medium text-red-600">
                {errors.time}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="availableDays">Days on the ground before you fly back (optional)</Label>
            <p className="text-xs text-slate-500">
              Short trips can&apos;t complete a full adaptation — if you enter a number, the plan
              will be shortened to fit your stay. Leave blank for no limit.
            </p>
            <Input
              id="availableDays"
              type="number"
              min={1}
              step={1}
              value={availableDaysInput}
              onChange={(event) => {
                setAvailableDaysInput(event.target.value);
                clearErrors("availableDays");
              }}
              aria-invalid={errors.availableDays ? true : undefined}
              aria-describedby={errors.availableDays ? "availableDays-error" : undefined}
            />
            {errors.availableDays && (
              <p id="availableDays-error" role="alert" className="text-xs font-medium text-red-600">
                {errors.availableDays}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {formError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit">Create plan</Button>
    </form>
  );
}
