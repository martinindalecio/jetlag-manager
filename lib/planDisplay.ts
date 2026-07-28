// Small display/formatting helpers shared by the home, trip-form, and
// trip-detail views. Kept separate from lib/data, lib/storage, lib/timezones,
// and lib/circadian so those directories stay untouched.

import { CITIES, type City } from "@/lib/data/cities";
import type { Direction } from "@/lib/circadian/types";
import { utcToZonedDateParts } from "@/lib/timezones/zonedTime";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function findCity(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

/** Falls back to the raw id if the city can't be resolved (shouldn't normally happen). */
export function cityLabel(id: string): string {
  return findCity(id)?.name ?? id;
}

export function directionLabel(direction: Direction): string {
  return direction === "advance" ? "advancing" : "delaying";
}

export function formatHours(hours: number): string {
  return Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
}

function formatHourMinute(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = minute.toString().padStart(2, "0");
  return `${hour12}:${mm} ${period}`;
}

/** Renders a UTC instant as destination-local wall-clock time, e.g. "7:05 AM". */
export function formatZonedTime(iso: string, timeZone: string): string {
  const parts = utcToZonedDateParts(new Date(iso), timeZone);
  return formatHourMinute(parts.hour, parts.minute);
}

/** Renders a UTC instant as destination-local date + time, e.g. "Jul 15, 7:05 AM". */
export function formatZonedDateTime(iso: string, timeZone: string): string {
  const parts = utcToZonedDateParts(new Date(iso), timeZone);
  return `${MONTHS[parts.month - 1]} ${parts.day}, ${formatHourMinute(parts.hour, parts.minute)}`;
}
