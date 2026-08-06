import { useEffect, useMemo, useRef, useState } from "react";
import type { MatchEvent } from "../matchTypes";
import { MatchEventType } from "../matchTypes";
import {
  getLiveMomentIntensity,
  getMatchEventKey,
  getSameMinuteSequence,
  isKeyAttackSequence,
  type LiveMomentIntensity,
} from "../utils/matchLiveHelpers";
import { getEventTitle } from "../utils/matchReportHelpers";

interface MatchLiveCommentaryProps {
  events: MatchEvent[];
  onHoldPlaybackChange?: (holding: boolean) => void;
  onGoalMomentChange?: (scorerLabel: string | null) => void;
  onFeedPresentationChange?: (sequence: MatchEvent[], lineIndex: number) => void;
}

const LINE_DWELL_MS = 1600;
const GOAL_DWELL_MS = 2400;
const FADE_MS = 280;

const getBaseClasses = (
  intensity: LiveMomentIntensity,
  type: MatchEventType,
  isGoalFlash: boolean,
): string => {
  if (type === MatchEventType.Goal || isGoalFlash) {
    return "border-primary bg-primary/20 shadow-[0_0_18px_rgba(74,222,128,0.35)]";
  }

  if (intensity === "critical") {
    return "border-error/60 bg-error/10";
  }

  if (intensity === "notable") {
    return "border-primary/40 bg-primary/5";
  }

  return "border-outline-variant bg-surface-container-high";
};

const getTitleClasses = (
  intensity: LiveMomentIntensity,
  type: MatchEventType,
): string => {
  if (type === MatchEventType.Goal) {
    return "text-primary";
  }

  if (intensity === "critical") {
    return "text-primary";
  }

  if (intensity === "notable") {
    return "text-on-surface";
  }

  return "text-on-surface-variant";
};

const getDwellMs = (event: MatchEvent): number => {
  if (event.type === MatchEventType.Goal) {
    return GOAL_DWELL_MS;
  }

  return LINE_DWELL_MS;
};

export const MatchLiveCommentary = ({
  events,
  onHoldPlaybackChange,
  onGoalMomentChange,
  onFeedPresentationChange,
}: MatchLiveCommentaryProps) => {
  const sequence = useMemo(() => getSameMinuteSequence(events), [events]);
  const sequenceKey = sequence.map((event) => getMatchEventKey(event)).join("|");
  const shouldHold = isKeyAttackSequence(sequence);
  const [lineIndex, setLineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isGoalFlash, setIsGoalFlash] = useState(false);
  const holdNotifiedRef = useRef(false);
  const onHoldRef = useRef(onHoldPlaybackChange);
  const onGoalMomentRef = useRef(onGoalMomentChange);
  const onPresentationRef = useRef(onFeedPresentationChange);
  onHoldRef.current = onHoldPlaybackChange;
  onGoalMomentRef.current = onGoalMomentChange;
  onPresentationRef.current = onFeedPresentationChange;

  const notifyGoalMoment = (event: MatchEvent | null) => {
    if (event?.type === MatchEventType.Goal) {
      onGoalMomentRef.current?.(event.description);
      return;
    }

    onGoalMomentRef.current?.(null);
  };

  const showLine = (currentIndex: number) => {
    const event = sequence[currentIndex];
    setLineIndex(currentIndex);
    setIsVisible(true);
    setIsGoalFlash(event.type === MatchEventType.Goal);
    notifyGoalMoment(event);
    onPresentationRef.current?.(sequence, currentIndex);
  };

  useEffect(() => {
    setLineIndex(0);
    setIsVisible(true);
    setIsGoalFlash(false);
    holdNotifiedRef.current = false;
    notifyGoalMoment(null);

    if (sequence.length === 0) {
      onPresentationRef.current?.([], 0);
    }

    if (shouldHold) {
      holdNotifiedRef.current = true;
      onHoldRef.current?.(true);
    } else {
      onHoldRef.current?.(false);
    }

    return () => {
      if (holdNotifiedRef.current) {
        holdNotifiedRef.current = false;
        onHoldRef.current?.(false);
      }

      onGoalMomentRef.current?.(null);
    };
  }, [sequenceKey, shouldHold, sequence.length]);

  useEffect(() => {
    if (sequence.length === 0) {
      notifyGoalMoment(null);
      return;
    }

    // Legacy / non-key multi-line minutes: show the latest line only — do not pause.
    if (!shouldHold) {
      showLine(sequence.length - 1);
      return;
    }

    if (sequence.length === 1) {
      showLine(0);

      const only = sequence[0];
      const timer = window.setTimeout(() => {
        holdNotifiedRef.current = false;
        onHoldRef.current?.(false);
      }, getDwellMs(only));

      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    let fadeTimer: number | null = null;
    let dwellTimer: number | null = null;

    const playLine = (currentIndex: number) => {
      if (cancelled) {
        return;
      }

      showLine(currentIndex);

      dwellTimer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        const isLast = currentIndex >= sequence.length - 1;

        if (isLast) {
          setIsGoalFlash(false);
          holdNotifiedRef.current = false;
          onHoldRef.current?.(false);
          return;
        }

        setIsVisible(false);
        fadeTimer = window.setTimeout(() => {
          playLine(currentIndex + 1);
        }, FADE_MS);
      }, getDwellMs(sequence[currentIndex]));
    };

    playLine(0);

    return () => {
      cancelled = true;

      if (fadeTimer !== null) {
        window.clearTimeout(fadeTimer);
      }

      if (dwellTimer !== null) {
        window.clearTimeout(dwellTimer);
      }
    };
  }, [sequenceKey, sequence, shouldHold]);

  const active = sequence.length > 0
    ? sequence[Math.min(lineIndex, sequence.length - 1)]
    : null;
  const intensity = getLiveMomentIntensity(active);
  const showingGoal = active?.type === MatchEventType.Goal;

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-3 py-1.5">
        <h3 className="text-label-caps text-on-surface-variant">Live Feed</h3>
        {active ? (
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            {active.minute}&apos;
          </span>
        ) : null}
      </div>

      <div className="p-2">
        {active == null ? (
          <p className="py-2 text-center text-body-sm text-on-surface-variant">
            Waiting for the first events…
          </p>
        ) : (
          <div
            className={`rounded border px-3 py-2 transition-opacity duration-300 ${getBaseClasses(intensity, active.type, isGoalFlash)} ${
              isVisible ? "opacity-100" : "opacity-0"
            } ${showingGoal ? "animate-live-goal-pulse" : ""}`}
          >
            <div className="mb-0.5 flex items-center justify-between gap-2">
              <span className={`text-label-caps ${getTitleClasses(intensity, active.type)}`}>
                {showingGoal ? "GOAAAL!" : getEventTitle(active)}
              </span>
            </div>
            <p
              className={`line-clamp-3 text-body-sm text-on-surface ${
                showingGoal || intensity === "critical" ? "font-semibold" : ""
              }`}
            >
              {active.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
