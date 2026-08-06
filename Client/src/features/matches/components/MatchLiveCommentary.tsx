import { useEffect, useState } from "react";
import type { MatchEvent } from "../matchTypes";
import { MatchEventType } from "../matchTypes";
import {
  getLatestLiveEvents,
  getLiveMomentIntensity,
  type LiveMomentIntensity,
} from "../utils/matchLiveHelpers";
import { getEventTitle } from "../utils/matchReportHelpers";

interface MatchLiveCommentaryProps {
  events: MatchEvent[];
}

const getBaseClasses = (intensity: LiveMomentIntensity, type: MatchEventType): string => {
  if (intensity === "critical") {
    if (type === MatchEventType.Goal) {
      return "border-primary bg-primary/15";
    }

    return "border-error/60 bg-error/10";
  }

  if (intensity === "notable") {
    return "border-primary/40 bg-primary/5";
  }

  return "border-outline-variant bg-surface-container-high";
};

const getTitleClasses = (intensity: LiveMomentIntensity): string => {
  if (intensity === "critical") {
    return "text-primary";
  }

  if (intensity === "notable") {
    return "text-on-surface";
  }

  return "text-on-surface-variant";
};

const getEventKey = (event: MatchEvent): string => {
  return `${event.type}-${event.minute}-${event.description}`;
};

export const MatchLiveCommentary = ({ events }: MatchLiveCommentaryProps) => {
  const latest = getLatestLiveEvents(events, 1);
  const headline = latest.length > 0 ? latest[0] : null;
  const intensity = getLiveMomentIntensity(headline);
  const headlineKey = headline ? getEventKey(headline) : null;
  const [flashKey, setFlashKey] = useState<string | null>(null);

  useEffect(() => {
    if (!headlineKey || intensity !== "critical") {
      return;
    }

    setFlashKey(headlineKey);

    const timer = window.setTimeout(() => {
      setFlashKey((current) => (current === headlineKey ? null : current));
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [headlineKey, intensity]);

  const isFlashing = headlineKey != null && flashKey === headlineKey;
  const flashClass =
    isFlashing && headline.type === MatchEventType.Goal
      ? "animate-live-goal-flash"
      : isFlashing
        ? "animate-live-critical-flash"
        : "";

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-3 py-1.5">
        <h3 className="text-label-caps text-on-surface-variant">Live Feed</h3>
        {headline ? (
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            {headline.minute}&apos;
          </span>
        ) : null}
      </div>

      <div className="p-2">
        {headline == null ? (
          <p className="py-2 text-center text-body-sm text-on-surface-variant">
            Waiting for the first events…
          </p>
        ) : (
          <div
            key={getEventKey(headline)}
            className={`rounded border px-3 py-2 ${getBaseClasses(intensity, headline.type)} ${flashClass}`}
          >
            <div className="mb-0.5 flex items-center justify-between gap-2">
              <span className={`text-label-caps ${getTitleClasses(intensity)}`}>
                {getEventTitle(headline)}
                {headline.type === MatchEventType.Goal && intensity === "critical"
                  ? "!"
                  : ""}
              </span>
            </div>
            <p
              className={`line-clamp-2 text-body-sm text-on-surface ${
                intensity === "critical" ? "font-semibold" : ""
              }`}
            >
              {headline.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
