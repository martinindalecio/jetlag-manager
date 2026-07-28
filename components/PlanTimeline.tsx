import { RecommendationCard } from "@/components/RecommendationCard";
import type { Plan, Recommendation } from "@/lib/circadian/types";

interface PlanTimelineProps {
  plan: Plan;
  destTz: string;
  activeRecommendations: Recommendation[];
}

export function PlanTimeline({ plan, destTz, activeRecommendations }: PlanTimelineProps) {
  const days = groupByDay(plan.recommendations);

  return (
    <div className="flex flex-col gap-6">
      {days.map(([dayIndex, recs]) => (
        <div key={dayIndex} className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Day {dayIndex + 1}
          </h3>
          <div className="flex flex-col gap-3">
            {recs.map((rec) => (
              <RecommendationCard
                key={`${rec.dayIndex}-${rec.type}-${rec.startUTC}`}
                recommendation={rec}
                destTz={destTz}
                active={activeRecommendations.some((r) => r === rec)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDay(recs: Recommendation[]): [number, Recommendation[]][] {
  const map = new Map<number, Recommendation[]>();
  for (const rec of recs) {
    const list = map.get(rec.dayIndex) ?? [];
    list.push(rec);
    map.set(rec.dayIndex, list);
  }
  const byStartAsc = (a: Recommendation, b: Recommendation) =>
    new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime();
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([dayIndex, dayRecs]) => [dayIndex, dayRecs.slice().sort(byStartAsc)]);
}
