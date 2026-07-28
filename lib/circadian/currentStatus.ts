import type { Plan, Recommendation } from "./types";

export interface CurrentStatus {
  state: "not_started" | "in_progress" | "completed";
  activeDayIndex: number | null;
  activeRecommendations: Recommendation[];
  nextRecommendation: Recommendation | null;
}

function byStartAsc(a: Recommendation, b: Recommendation): number {
  return new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime();
}

export function getCurrentStatus(plan: Plan, nowUTC: Date): CurrentStatus {
  const recs = plan.recommendations;

  if (recs.length === 0) {
    return { state: "not_started", activeDayIndex: null, activeRecommendations: [], nextRecommendation: null };
  }

  const now = nowUTC.getTime();
  const earliestStart = Math.min(...recs.map((r) => new Date(r.startUTC).getTime()));
  const latestEnd = Math.max(...recs.map((r) => new Date(r.endUTC).getTime()));

  if (now < earliestStart) {
    const next = recs.slice().sort(byStartAsc)[0];
    return { state: "not_started", activeDayIndex: null, activeRecommendations: [], nextRecommendation: next };
  }

  if (now >= latestEnd) {
    return { state: "completed", activeDayIndex: null, activeRecommendations: [], nextRecommendation: null };
  }

  const activeRecommendations = recs.filter((r) => {
    const start = new Date(r.startUTC).getTime();
    const end = new Date(r.endUTC).getTime();
    return start <= now && now < end;
  });

  const activeDayIndex = activeRecommendations.length > 0 ? activeRecommendations[0].dayIndex : null;

  const upcoming = recs.filter((r) => new Date(r.startUTC).getTime() > now).sort(byStartAsc);
  const nextRecommendation = upcoming.length > 0 ? upcoming[0] : null;

  return { state: "in_progress", activeDayIndex, activeRecommendations, nextRecommendation };
}
