export type Direction = "advance" | "delay";

export interface ChronotypeProfile {
  workBedtime: string; // "HH:MM" 24h wall-clock, habitual work-day bedtime
  workWakeTime: string; // "HH:MM" habitual work-day wake time — THIS is the CBTmin anchor
  freeBedtime: string; // "HH:MM" free-day bedtime (captured for completeness/future use, not used in MVP math)
  freeWakeTime: string; // "HH:MM" free-day wake time (same — captured, not used in MVP math)
}

export interface Trip {
  originTz: string; // IANA tz name, e.g. "America/New_York"
  destTz: string; // IANA tz name, e.g. "Asia/Tokyo"
  arriveUTC: string; // ISO 8601 UTC instant of arrival at destination
  availableDays?: number; // days on the ground at destination before a hard cutoff (e.g. return flight); undefined = unconstrained
}

export type RecommendationType = "seek_light" | "avoid_light" | "sleep";

export interface Recommendation {
  type: RecommendationType;
  startUTC: string; // ISO 8601
  endUTC: string; // ISO 8601
  dayIndex: number; // 0-based day of the post-arrival adaptation plan
  text: string; // short human-readable description
}

export interface Plan {
  direction: Direction;
  requiredShift: number; // hours, 0..12
  maxDaily: number; // hours/day, 1.5 for MVP
  nDaysPlanned: number; // ceil(requiredShift / maxDaily), before clamping to trip length
  nDaysActual: number; // after clamping to Trip.availableDays (if provided)
  recommendations: Recommendation[];
}
