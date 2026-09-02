import { Link, useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { getNationalityFlagSrc } from "@/core/utils/nationalityFlags";
import { goBackOrFallback } from "@/features/matches/utils/matchReportHelpers";
import { PlayerAttributeProfile } from "@/features/playerInstances/components/PlayerAttributeProfile";
import { useGetPlayerInstanceByIdQuery } from "@/features/playerInstances/playerInstancesApiSlice";
import {
  formatSquadMoney,
  formatWeeklyWage,
  getDetailPositionBadgeClassName,
  getOverallBadgeClassName,
  getPlayerFullName,
  getPlayerInitials,
  getPlayerStatus,
  getPositionLabel,
  getPreferredFootLabel,
} from "@/features/playerInstances/utils/squadHelpers";

export const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: player, isLoading, isError } = useGetPlayerInstanceByIdQuery(
    id ?? "",
    { skip: !id },
  );

  const handleGoBack = () => {
    goBackOrFallback(navigate, "/app/squad");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Player loading...
      </div>
    );
  }

  if (isError || !player) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary"
        >
          <MaterialIcon name="arrow_back" className="text-sm" />
          <span className="text-label-caps">Go back</span>
        </button>
        <p className="text-body-sm text-on-surface-variant">Player not found.</p>
      </div>
    );
  }

  const fullName = getPlayerFullName(player.firstName, player.lastName);
  const initials = getPlayerInitials(player.firstName, player.lastName);
  const status = getPlayerStatus(player);
  const positionLabel = getPositionLabel(player.position);
  const flagSrc = getNationalityFlagSrc(player.nationality);
  const nationalityLabel = player.nationality?.trim() || "Unknown";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="mb-2 flex items-center gap-4 text-on-surface-variant">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-1 transition-colors hover:text-primary"
        >
          <MaterialIcon name="arrow_back" className="text-sm" />
          <span className="text-label-caps">Go back</span>
        </button>
        <nav className="flex items-center gap-2 text-body-sm">
          <Link to="/app/squad" className="transition-colors hover:text-primary">
            Squad
          </Link>
          <MaterialIcon name="chevron_right" className="text-[16px]" />
          <span className="font-semibold text-on-background">{fullName}</span>
        </nav>
      </div>

      <section className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-lg border border-surface-variant bg-surface-container p-8 md:flex-row md:items-center">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-container opacity-5 blur-3xl" />

        <div className="z-10 flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded border border-outline-variant bg-surface-container-high text-display-lg tracking-tighter text-primary shadow-sm">
            {initials}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="m-0 text-headline-md font-bold text-on-background">
                {fullName}
              </h1>
              <div
                className={`rounded px-2 py-0.5 text-stat-value shadow-sm ${getOverallBadgeClassName(player.overallRating)}`}
              >
                {player.overallRating}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-label-caps text-on-surface-variant uppercase">
              <span
                className={`rounded px-2 py-0.5 ${getDetailPositionBadgeClassName(player.position)}`}
              >
                {positionLabel}
              </span>
              <span>Age: {player.age}</span>
              <span className="flex items-center gap-2">
                {flagSrc ? (
                  <img
                    src={flagSrc}
                    alt={nationalityLabel}
                    title={nationalityLabel}
                    width={33}
                    height={20}
                    className="h-5 w-[33px] object-contain"
                  />
                ) : (
                  <span
                    title={nationalityLabel}
                    className="inline-block h-5 w-[33px] rounded-sm bg-surface-container-highest"
                  />
                )}
                {nationalityLabel}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
                {getPreferredFootLabel(player.preferredFoot)}
              </span>
              <span
                className={`flex items-center gap-1 rounded px-2 py-0.5 ${status.className}`}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    player.isInjured
                      ? "bg-error"
                      : "animate-pulse bg-primary-container",
                  ].join(" ")}
                />
                {player.isInjured
                  ? `Injured · ${player.injuryDays}d`
                  : "Fit"}
              </span>
            </div>
          </div>
        </div>

        <div className="z-10 flex flex-col gap-1 rounded border border-surface-variant bg-surface-container-low p-3 font-data-mono text-data-mono text-on-surface-variant md:items-end">
          <div className="flex items-center gap-2">
            <MaterialIcon name="apartment" className="text-[16px]" />
            <span>{player.clubName}</span>
          </div>
          <div className="flex items-center gap-2 text-on-background">
            <MaterialIcon name="payments" className="text-[16px] text-secondary" />
            <span>Wage: {formatWeeklyWage(player.wage)}</span>
          </div>
          <div className="flex items-center gap-2 text-on-background">
            <MaterialIcon name="monitoring" className="text-[16px] text-primary" />
            <span>Value: {formatSquadMoney(player.marketValue)}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-6 rounded-lg border border-surface-variant bg-surface-container p-6 md:col-span-2">
          <h2 className="flex items-center gap-2 border-b border-surface-variant pb-2 text-headline-sm font-semibold text-on-background">
            <MaterialIcon name="tune" className="text-primary" />
            Attributes Profile
          </h2>
          <PlayerAttributeProfile
            position={player.position}
            attributes={player.attributes}
            attackPower={player.attackPower}
            defenseStrength={player.defenseStrength}
            midfieldControl={player.midfieldControl}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-lg border border-surface-variant bg-surface-container p-6">
            <h2 className="flex items-center gap-2 border-b border-surface-variant pb-2 text-headline-sm font-semibold text-on-background">
              <MaterialIcon name="accessibility_new" className="text-outline" />
              Physical
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col rounded border border-surface-variant bg-surface-container-low p-3">
                <span className="text-label-caps text-on-surface-variant">Height</span>
                <span className="text-stat-value text-on-background">{player.heightCm}cm</span>
              </div>
              <div className="flex flex-col rounded border border-surface-variant bg-surface-container-low p-3">
                <span className="text-label-caps text-on-surface-variant">Weight</span>
                <span className="text-stat-value text-on-background">{player.weightKg}kg</span>
              </div>
            </div>
          </div>

          <div className="flex flex-grow flex-col gap-4 rounded-lg border border-surface-variant bg-surface-container p-6">
            <h2 className="flex items-center gap-2 border-b border-surface-variant pb-2 text-headline-sm font-semibold text-on-background">
              <MaterialIcon name="leaderboard" className="text-secondary" />
              Season Totals
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="group flex cursor-default items-center justify-between rounded border border-surface-variant bg-surface-container-low p-3 transition-colors hover:bg-surface-variant">
                <span className="text-label-caps text-on-surface-variant group-hover:text-on-background">
                  Goals
                </span>
                <span className="text-stat-value text-primary-container">
                  {player.seasonGoals}
                </span>
              </div>
              <div className="group flex cursor-default items-center justify-between rounded border border-surface-variant bg-surface-container-low p-3 transition-colors hover:bg-surface-variant">
                <span className="text-label-caps text-on-surface-variant group-hover:text-on-background">
                  Assists
                </span>
                <span className="text-stat-value text-primary-container">
                  {player.seasonAssists}
                </span>
              </div>
              <div className="group flex cursor-default items-center justify-between rounded border border-surface-variant bg-surface-container-low p-3 transition-colors hover:bg-surface-variant">
                <span className="text-label-caps text-on-surface-variant group-hover:text-on-background">
                  Yellows
                </span>
                <span className="text-stat-value text-secondary">
                  {player.seasonYellowCards}
                </span>
              </div>
              <div className="group flex cursor-default items-center justify-between rounded border border-surface-variant bg-surface-container-low p-3 transition-colors hover:bg-surface-variant">
                <span className="text-label-caps text-on-surface-variant group-hover:text-on-background">
                  Reds
                </span>
                <span className="text-stat-value text-error">
                  {player.seasonRedCards}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
