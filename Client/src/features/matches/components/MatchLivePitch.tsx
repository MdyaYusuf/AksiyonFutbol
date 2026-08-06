import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { PitchBallPosition } from "../utils/matchLiveHelpers";

interface MatchLivePitchProps {
  homeClubName: string;
  awayClubName: string;
  ball: PitchBallPosition;
  goalCelebration?: {
    scorerLabel: string;
  } | null;
}

export const MatchLivePitch = ({
  homeClubName,
  awayClubName,
  ball,
  goalCelebration = null,
}: MatchLivePitchProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-outline-variant bg-[#0c1a11]">
      <div className="flex items-center justify-between px-3 py-1 text-label-caps text-on-surface-variant">
        <span className="truncate text-primary">{homeClubName}</span>
        <span className="truncate text-right">{awayClubName}</span>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 100 64"
          className="h-auto w-full"
          role="img"
          aria-label="Match pitch"
        >
          <rect x="0" y="0" width="100" height="64" fill="#102618" />
          <rect
            x="2"
            y="2"
            width="96"
            height="60"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.6"
          />
          <line
            x1="50"
            y1="2"
            x2="50"
            y2="62"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="32"
            r="8"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
          />
          <circle cx="50" cy="32" r="0.8" fill="rgba(255,255,255,0.35)" />

          <rect
            x="2"
            y="20"
            width="12"
            height="24"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
          />
          <rect
            x="2"
            y="25"
            width="5"
            height="14"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
          />

          <rect
            x="86"
            y="20"
            width="12"
            height="24"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
          />
          <rect
            x="93"
            y="25"
            width="5"
            height="14"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
          />

          <circle
            cx={ball.x}
            cy={ball.y}
            r={goalCelebration ? 2.8 : 2.2}
            className="fill-primary"
            style={{
              transition: "cx 0.45s ease, cy 0.45s ease, r 0.25s ease",
            }}
          />
        </svg>

        {goalCelebration ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0c1a11]/55 animate-live-goal-banner">
            <div className="flex items-center gap-2 text-primary">
              <MaterialIcon name="sports_soccer" className="text-3xl" filled />
              <span className="text-headline-md font-extrabold tracking-[0.12em] md:text-4xl">
                GOAAAL!
              </span>
              <MaterialIcon name="sports_soccer" className="text-3xl" filled />
            </div>
            <p className="mt-1 max-w-[90%] truncate text-center text-body-sm font-semibold text-on-surface">
              {goalCelebration.scorerLabel}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
