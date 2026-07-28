import { TripRecordSchema, type TripRecord } from "./schema";
import type { Plan } from "@/lib/circadian/types";

const KEY = "jetlag:trips";

export function listTrips(): TripRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsedArray = JSON.parse(raw);
    if (!Array.isArray(parsedArray)) return [];
    // Drop any individually-corrupted entries rather than failing the whole list
    return parsedArray
      .map((item) => TripRecordSchema.safeParse(item))
      .filter((r): r is { success: true; data: TripRecord } => r.success)
      .map((r) => r.data);
  } catch {
    return [];
  }
}

export function getTrip(id: string): TripRecord | null {
  return listTrips().find((t) => t.id === id) ?? null;
}

export function saveTrip(
  input: {
    label: string;
    originCityId: string;
    destCityId: string;
    arriveUTC: string;
    availableDays?: number;
  },
  plan: Plan
): TripRecord {
  const record: TripRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    plan,
  };
  TripRecordSchema.parse(record); // throws on malformed input — programmer error, not storage corruption
  if (typeof window !== "undefined") {
    const all = listTrips();
    all.push(record);
    window.localStorage.setItem(KEY, JSON.stringify(all));
  }
  return record;
}

export function deleteTrip(id: string): void {
  if (typeof window === "undefined") return;
  const remaining = listTrips().filter((t) => t.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(remaining));
}
