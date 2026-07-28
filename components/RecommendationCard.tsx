import { cn } from "@/lib/utils";
import { formatZonedTime } from "@/lib/planDisplay";
import type { Recommendation, RecommendationType } from "@/lib/circadian/types";

const TYPE_LABELS: Record<RecommendationType, string> = {
  seek_light: "☀️ Seek bright light",
  avoid_light: "🌑 Avoid light",
  sleep: "😴 Sleep window",
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  destTz: string;
  active: boolean;
}

export function RecommendationCard({ recommendation, destTz, active }: RecommendationCardProps) {
  return (
    <div
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-lg border p-4",
        active ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-900">{TYPE_LABELS[recommendation.type]}</span>
        {active && (
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950">
            Active now
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {formatZonedTime(recommendation.startUTC, destTz)} – {formatZonedTime(recommendation.endUTC, destTz)}
      </p>
      <p className="mt-1 text-sm text-slate-700">{recommendation.text}</p>
    </div>
  );
}
