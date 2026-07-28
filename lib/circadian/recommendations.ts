import type { ChronotypeProfile, Direction, Recommendation, Trip } from "./types";
import { tzOffsetMs, utcToZonedDateParts, zonedWallTimeToUtc } from "../timezones/zonedTime";
import { estimatePhase } from "./phase";
import { shiftAccumulated } from "./rate";
import { seekLightWindow, avoidLightWindow, type MinuteWindow } from "./lightWindows";
import { deriveSleepWindow } from "./sleepWindow";
import { mod1440, parseTimeToMinutes, minutesToHourMinute } from "./timeOfDay";

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  // Pure calendar-date arithmetic (no timezone involved) — safe to lean on
  // JS Date's own day-overflow normalization here.
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/**
 * Converts a minute-of-day window on a given destination-local reference
 * date into an absolute UTC start/end instant pair. If the window's end
 * time-of-day is numerically less than its start, the end is placed on the
 * following calendar date (midnight crossing).
 */
function windowToUtc(
  refDate: CalendarDate,
  window: MinuteWindow,
  destTz: string
): { startUTC: string; endUTC: string } {
  const start = minutesToHourMinute(window.startMin);
  const end = minutesToHourMinute(window.endMin);
  const endDate = window.endMin < window.startMin ? addCalendarDays(refDate, 1) : refDate;

  const startInstant = zonedWallTimeToUtc(
    { year: refDate.year, month: refDate.month, day: refDate.day, hour: start.hour, minute: start.minute },
    destTz
  );
  const endInstant = zonedWallTimeToUtc(
    { year: endDate.year, month: endDate.month, day: endDate.day, hour: end.hour, minute: end.minute },
    destTz
  );

  return { startUTC: startInstant.toISOString(), endUTC: endInstant.toISOString() };
}

const RECOMMENDATION_TEXT: Record<Recommendation["type"], string> = {
  seek_light: "Seek bright light",
  avoid_light: "Avoid light — wear sunglasses if unavoidable",
  sleep: "Sleep",
};

export function buildRecommendations(
  profile: ChronotypeProfile,
  trip: Trip,
  direction: Direction,
  requiredShiftHours: number,
  maxDaily: number,
  nDaysActual: number
): Recommendation[] {
  const arriveInstant = new Date(trip.arriveUTC);

  // Step 2: raw (non-normalized) origin->dest UTC-offset delta at arrival,
  // and the origin CBTmin read on the destination's clock.
  const rawDelta =
    tzOffsetMs(arriveInstant, trip.destTz) / 3.6e6 - tzOffsetMs(arriveInstant, trip.originTz) / 3.6e6;

  const { cbtmin } = estimatePhase(profile);
  const cbtminOriginMinutes = parseTimeToMinutes(cbtmin);
  const cbtminOriginInDestClock = mod1440(cbtminOriginMinutes + rawDelta * 60);

  // Habitual sleep duration, in hours.
  const workWakeMinutes = parseTimeToMinutes(profile.workWakeTime);
  const workBedMinutes = parseTimeToMinutes(profile.workBedtime);
  const sleepDurationHours = mod1440(workWakeMinutes - workBedMinutes) / 60;

  const arrivalLocalDate = utcToZonedDateParts(arriveInstant, trip.destTz);
  const arrivalCalendarDate: CalendarDate = {
    year: arrivalLocalDate.year,
    month: arrivalLocalDate.month,
    day: arrivalLocalDate.day,
  };

  const recommendations: Recommendation[] = [];

  for (let d = 0; d < nDaysActual; d++) {
    const shift = shiftAccumulated(d, maxDaily, requiredShiftHours);
    const cbtmin_d =
      direction === "delay"
        ? mod1440(cbtminOriginInDestClock + shift * 60)
        : mod1440(cbtminOriginInDestClock - shift * 60);

    const refDate = addCalendarDays(arrivalCalendarDate, d);

    const seek = seekLightWindow(cbtmin_d, direction);
    const avoid = avoidLightWindow(cbtmin_d, direction);
    const sleep = deriveSleepWindow(cbtmin_d, sleepDurationHours);

    const seekRange = windowToUtc(refDate, seek, trip.destTz);
    const avoidRange = windowToUtc(refDate, avoid, trip.destTz);
    const sleepRange = windowToUtc(
      refDate,
      { startMin: sleep.bedtimeMin, endMin: sleep.wakeMin },
      trip.destTz
    );

    recommendations.push(
      { type: "seek_light", dayIndex: d, text: RECOMMENDATION_TEXT.seek_light, ...seekRange },
      { type: "avoid_light", dayIndex: d, text: RECOMMENDATION_TEXT.avoid_light, ...avoidRange },
      { type: "sleep", dayIndex: d, text: RECOMMENDATION_TEXT.sleep, ...sleepRange }
    );
  }

  recommendations.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());

  return recommendations;
}
