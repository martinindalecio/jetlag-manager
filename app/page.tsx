"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/storage/profileStore";
import { listTrips } from "@/lib/storage/tripStore";
import type { TripRecord } from "@/lib/storage/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cityLabel, directionLabel, formatHours } from "@/lib/planDisplay";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [trips, setTrips] = useState<TripRecord[]>([]);

  useEffect(() => {
    if (!getProfile()) {
      router.replace("/onboarding");
      return;
    }
    setTrips(listTrips());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Jetlag Manager</h1>
        <p className="text-sm text-slate-600 sm:text-base">Your trips and adaptation plans.</p>
      </div>

      {trips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <p className="text-slate-600">You haven&apos;t planned any trips yet.</p>
            <Link href="/trips/new">
              <Button size="lg">Plan a trip</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Your trips</h2>
            <Link href="/trips/new">
              <Button>New trip</Button>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="block">
                <Card className="transition-colors hover:border-slate-400">
                  <CardHeader>
                    <CardTitle>
                      {cityLabel(trip.originCityId)} → {cityLabel(trip.destCityId)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">
                    <p>
                      {directionLabel(trip.plan.direction)} your body clock by{" "}
                      {formatHours(trip.plan.requiredShift)} hour{trip.plan.requiredShift === 1 ? "" : "s"} over{" "}
                      {trip.plan.nDaysActual} day{trip.plan.nDaysActual === 1 ? "" : "s"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
