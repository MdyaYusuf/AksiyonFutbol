import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { SeasonClubMovement } from "../seasonTransitionTypes";
import { getClubInitial } from "../utils/endOfSeasonHelpers";

interface EndOfSeasonBoardReviewProps {
  objective: string;
  result: string;
  achieved: boolean;
  rating: string;
}

export const EndOfSeasonBoardReview = ({
  objective,
  result,
  achieved,
  rating,
}: EndOfSeasonBoardReviewProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container p-6 shadow-lg">
      <div className="absolute -top-10 -right-10 opacity-10">
        <MaterialIcon name="monitoring" className="text-[150px]" />
      </div>
      <h3 className="relative z-10 mb-4 text-xl font-bold text-on-surface">Board Review</h3>
      <div className="relative z-10 space-y-4">
        <div className="flex items-end justify-between border-b border-outline-variant pb-2">
          <span className="text-sm text-on-surface-variant">Objective</span>
          <span className="text-right font-semibold text-on-surface">{objective}</span>
        </div>
        <div className="flex items-end justify-between border-b border-outline-variant pb-2">
          <span className="text-sm text-on-surface-variant">Result</span>
          <span
            className={`flex items-center gap-1 text-right font-bold ${
              achieved ? "text-primary" : "text-error"
            }`}
          >
            {result}
            <MaterialIcon
              name={achieved ? "check_circle" : "cancel"}
              className="text-sm"
            />
          </span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-sm text-on-surface-variant">Manager Rating</span>
          <span className="text-right text-2xl font-black text-on-surface">{rating}</span>
        </div>
      </div>
    </div>
  );
};

interface EndOfSeasonPresidentPackageProps {
  identityTrack: string;
  flavorTitle: string;
  cashAwarded: number;
  summary: string;
}

export const EndOfSeasonPresidentPackage = ({
  identityTrack,
  flavorTitle,
  cashAwarded,
  summary,
}: EndOfSeasonPresidentPackageProps) => {
  const trackClass =
    identityTrack.toLowerCase() === "honorable"
      ? "text-primary border-primary/30 bg-primary/10"
      : identityTrack.toLowerCase() === "shady"
        ? "text-error border-error/30 bg-error/10"
        : "text-secondary border-secondary/30 bg-secondary/10";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container p-6 shadow-lg">
      <div className="absolute -top-10 -right-10 opacity-10">
        <MaterialIcon name="military_tech" className="text-[150px]" />
      </div>
      <h3 className="relative z-10 mb-4 text-xl font-bold text-on-surface">
        President Identity
      </h3>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-on-surface-variant">Season Path</span>
          <span
            className={`rounded border px-2 py-0.5 font-label-caps text-label-caps ${trackClass}`}
          >
            {identityTrack}
          </span>
        </div>
        <div className="flex items-end justify-between border-b border-outline-variant pb-2">
          <span className="text-sm text-on-surface-variant">New Title</span>
          <span className="text-right font-semibold text-on-surface">{flavorTitle}</span>
        </div>
        <div className="flex items-end justify-between border-b border-outline-variant pb-2">
          <span className="text-sm text-on-surface-variant">Package</span>
          <span className="font-data-mono text-data-mono text-secondary">
            {cashAwarded.toLocaleString("en-GB")}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{summary}</p>
      </div>
    </div>
  );
};

interface EndOfSeasonMovementsPanelProps {
  promoted: SeasonClubMovement[];
  relegated: SeasonClubMovement[];
  promoteTargetName?: string | null;
  relegateTargetName?: string | null;
}

export const EndOfSeasonMovementsPanel = ({
  promoted,
  relegated,
  promoteTargetName,
  relegateTargetName,
}: EndOfSeasonMovementsPanelProps) => {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-on-surface">
        <MaterialIcon name="swap_vert" className="text-on-surface-variant" />
        Division Movements
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
            <MaterialIcon name="arrow_upward" className="text-sm" />
            {promoteTargetName
              ? `Promoted to ${promoteTargetName}`
              : "Promoted"}
          </h4>
          {promoted.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant">No promotions from this division.</p>
          ) : (
            <ul className="space-y-3">
              {promoted.map((movement) => (
                <li
                  key={movement.clubId}
                  className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {getClubInitial(movement.clubName)}
                  </div>
                  <span className="flex-1 font-semibold text-on-surface">
                    {movement.clubName}
                  </span>
                  {movement.position === 1 ? (
                    <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-on-primary">
                      Champions
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr className="border-outline-variant" />

        <div>
          <h4 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-error uppercase">
            <MaterialIcon name="arrow_downward" className="text-sm" />
            {relegateTargetName
              ? `Relegated to ${relegateTargetName}`
              : "Relegated"}
          </h4>
          {relegated.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant">No relegations from this division.</p>
          ) : (
            <ul className="space-y-3">
              {relegated.map((movement) => (
                <li
                  key={movement.clubId}
                  className="flex items-center gap-3 rounded-lg border border-error/20 bg-error-container/40 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error-container text-xs font-bold text-error">
                    {getClubInitial(movement.clubName)}
                  </div>
                  <span className="flex-1 font-semibold text-error">{movement.clubName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
