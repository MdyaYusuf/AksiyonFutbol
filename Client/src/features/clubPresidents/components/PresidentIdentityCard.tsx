import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ProgressBar } from "../../../core/components/ui/ProgressBar";
import { resolveMediaUrl } from "../../../core/utils/mediaUrl";
import type { ClubResponse } from "../../clubs/clubTypes";
import type { ClubPresidentResponse } from "../clubPresidentTypes";
import { getReputationXp } from "../utils/presidentProfileHelpers";

interface PresidentIdentityCardProps {
  president: ClubPresidentResponse;
  club?: ClubResponse;
  winRate: number | null;
  profileImageUrl?: string | null;
}

export const PresidentIdentityCard = ({
  president,
  club,
  winRate,
  profileImageUrl,
}: PresidentIdentityCardProps) => {
  const reputationXp = getReputationXp(president.reputationPoints);
  const title = president.title?.trim() || "Club President";
  const avatarUrl = resolveMediaUrl(profileImageUrl);

  return (
    <section className="relative flex flex-col items-center gap-8 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-6 shadow-sm md:flex-row md:items-start md:p-8">
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-primary opacity-5 blur-3xl" />

      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary via-surface-variant to-secondary-container p-1 md:h-40 md:w-40">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-surface-container-high bg-surface-container-highest">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={president.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <MaterialIcon name="person" className="text-5xl text-on-surface-variant" />
            )}
          </div>
        </div>
        <div className="absolute -right-2 -bottom-2 flex items-center gap-1 rounded-full border border-primary bg-surface-variant px-3 py-1 shadow-sm">
          <MaterialIcon name="verified" className="text-sm text-primary" filled />
          <span className="text-label-caps text-primary">Elite</span>
        </div>
      </div>

      <div className="z-10 flex-1 space-y-4 text-center md:text-left">
        <div>
          <h1 className="mb-1 text-[32px] leading-10 font-extrabold tracking-tight text-on-surface lg:text-display-lg lg:leading-[56px]">
            {president.name}
          </h1>
          <p className="flex items-center justify-center gap-2 text-headline-sm text-on-surface-variant md:justify-start">
            <MaterialIcon name="workspace_premium" className="text-secondary" />
            {title}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
          <div className="min-w-[120px] max-w-[200px] flex-1 rounded-lg border border-outline-variant bg-surface-variant p-3">
            <p className="mb-1 text-label-caps text-on-surface-variant">Total Experience</p>
            <p className="text-stat-value text-primary">
              {reputationXp.toLocaleString("en-US")}{" "}
              <span className="text-sm font-normal text-on-surface-variant">XP</span>
            </p>
            <div className="mt-2">
              <ProgressBar value={president.reputationPoints} />
            </div>
          </div>

          <div className="min-w-[120px] max-w-[200px] flex-1 rounded-lg border border-outline-variant bg-surface-variant p-3">
            <p className="mb-1 text-label-caps text-on-surface-variant">Win Rate</p>
            <p className="text-stat-value text-on-surface">
              {winRate == null ? "—" : `${winRate.toFixed(1)}%`}
            </p>
          </div>

          <div className="min-w-[120px] max-w-[200px] flex-1 rounded-lg border border-outline-variant bg-surface-variant p-3">
            <p className="mb-1 text-label-caps text-on-surface-variant">Current Club</p>
            <p className="text-stat-value text-on-surface">{club?.name ?? "—"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
