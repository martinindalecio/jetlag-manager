"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTrip } from "@/lib/storage/tripStore";
import type { TripRecord } from "@/lib/storage/schema";
import { getCurrentStatus } from "@/lib/circadian";
import type { CurrentStatus } from "@/lib/circadian/currentStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanTimeline } from "@/components/PlanTimeline";
import { cityLabel, directionLabel, findCity, formatHours, formatZonedDateTime } from "@/lib/planDisplay";

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  const [ready, setReady] = useState(false);
  const [trip, setTrip] = useState<TripRecord | null>(null);
  const [status, setStatus] = useState<CurrentStatus | null>(null);

  useEffect(() => {
    if (!id) {
      setReady(true);
      return;
    }
    const record = getTrip(id);
    setTrip(record);
    setStatus(record ? getCurrentStatus(record.plan, new Date()) : null);
    setReady(true);
  }, [id]);

  if (!ready) return null;

  if (!trip || !status) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-slate-600">We couldn&apos;t find that trip. It may have been deleted.</p>
        <Link href="/" className="text-sm font-medium text-slate-900 underline">
          Back to your trips
        </Link>
      </main>
    );
  }

  const destCity = findCity(trip.destCityId);
  const destTz = destCity?.timeZone ?? "UTC";

  const statusLine = (() => {
    switch (status.state) {
      case "not_started":
        return status.nextRecommendation
          ? `Not started yet — starts ${formatZonedDateTime(status.nextRecommendation.startUTC, destTz)}`
          : "Not started yet.";
      case "in_progress":
        return "In progress";
      case "completed":
        return "Completed";
    }
  })();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-xs font-medium text-slate-500 underline">
          Back to your trips
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {cityLabel(trip.originCityId)} → {cityLabel(trip.destCityId)}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-slate-700">
          <p>
            You&apos;re {directionLabel(trip.plan.direction)} your body clock by{" "}
            {formatHours(trip.plan.requiredShift)} hour{trip.plan.requiredShift === 1 ? "" : "s"} over{" "}
            {trip.plan.nDaysActual} day{trip.plan.nDaysActual === 1 ? "" : "s"}.
          </p>
          {trip.plan.nDaysActual < trip.plan.nDaysPlanned && (
            <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
              A full adaptation would normally take {trip.plan.nDaysPlanned} days. This plan has been
              shortened to fit your trip length.
            </p>
          )}
          <p className="font-medium text-slate-900">{statusLine}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Your plan</h2>
        <PlanTimeline plan={trip.plan} destTz={destTz} activeRecommendations={status.activeRecommendations} />
      </div>
    </main>
  );
}
