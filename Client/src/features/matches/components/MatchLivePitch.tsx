import type { PitchBallPosition } from "../utils/matchLiveHelpers";

interface MatchLivePitchProps {
  homeClubName: string;
  awayClubName: string;
  ball: PitchBallPosition;
}

export const MatchLivePitch = ({
  homeClubName,
  awayClubName,
  ball,
}: MatchLivePitchProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-outline-variant bg-[#0c1a11]">
      <div className="flex items-center justify-between px-4 py-2 text-label-caps text-on-surface-variant">
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
          r="2.2"
          className="fill-primary"
          style={{
            transition: "cx 0.45s ease, cy 0.45s ease",
          }}
        >
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};
