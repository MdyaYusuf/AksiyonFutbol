import { useEffect, useState } from "react";
import type { LiveMomentIntensity, PitchBallPosition } from "../utils/matchLiveHelpers";

interface MatchLivePitchProps {
  homeClubName: string;
  awayClubName: string;
  ball: PitchBallPosition;
  momentIntensity?: LiveMomentIntensity;
  flashToken?: string | null;
}

export const MatchLivePitch = ({
  homeClubName,
  awayClubName,
  ball,
  momentIntensity = "normal",
  flashToken = null,
}: MatchLivePitchProps) => {
  const isCritical = momentIntensity === "critical";
  const isNotable = momentIntensity === "notable";
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!flashToken || momentIntensity !== "critical") {
      return;
    }

    setIsFlashing(true);
    const timer = window.setTimeout(() => setIsFlashing(false), 1600);
    return () => window.clearTimeout(timer);
  }, [flashToken, momentIntensity]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-[#0c1a11] transition-[border-color,box-shadow] duration-300 ${
        isCritical
          ? "border-primary shadow-[0_0_20px_rgba(74,222,128,0.3)]"
          : isNotable
            ? "border-primary/50"
            : "border-outline-variant"
      }`}
    >
      {isFlashing ? (
        <div className="pointer-events-none absolute inset-0 z-10 animate-live-pitch-flash bg-primary" />
      ) : null}

      <div className="flex items-center justify-between px-3 py-1 text-label-caps text-on-surface-variant">
        <span className="truncate text-primary">{homeClubName}</span>
        <span className="truncate text-right">{awayClubName}</span>
      </div>

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
          r={isCritical ? 2.8 : 2.2}
          className="fill-primary"
          style={{
            transition: "cx 0.45s ease, cy 0.45s ease, r 0.3s ease",
          }}
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur={isCritical ? "0.7s" : "1.4s"}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};
