import { z } from "zod";
import type { ChronotypeProfile, Plan, Recommendation } from "@/lib/circadian/types";

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "expected HH:MM 24h time");
const iso8601 = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, "expected ISO 8601 UTC datetime");

export const ChronotypeProfileSchema = z.object({
  workBedtime: hhmm,
  workWakeTime: hhmm,
  freeBedtime: hhmm,
  freeWakeTime: hhmm,
}) satisfies z.ZodType<ChronotypeProfile>;

export const ProfileRecordSchema = ChronotypeProfileSchema.extend({
  id: z.string(),
  createdAt: iso8601,
  updatedAt: iso8601,
});

export const RecommendationSchema = z.object({
  type: z.enum(["seek_light", "avoid_light", "sleep"] as const),
  startUTC: iso8601,
  endUTC: iso8601,
  dayIndex: z.number(),
  text: z.string(),
}) satisfies z.ZodType<Recommendation>;

export const PlanSchema = z.object({
  direction: z.enum(["advance", "delay"] as const),
  requiredShift: z.number(),
  maxDaily: z.number(),
  nDaysPlanned: z.number(),
  nDaysActual: z.number(),
  recommendations: z.array(RecommendationSchema),
}) satisfies z.ZodType<Plan>;

export const TripRecordSchema = z.object({
  id: z.string(),
  label: z.string(),
  originCityId: z.string(),
  destCityId: z.string(),
  arriveUTC: iso8601,
  availableDays: z.number().optional(),
  createdAt: iso8601,
  plan: PlanSchema,
});

export type ProfileRecord = z.infer<typeof ProfileRecordSchema>;
export type TripRecord = z.infer<typeof TripRecordSchema>;
