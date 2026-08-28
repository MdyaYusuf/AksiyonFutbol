import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { resolveMediaUrl } from "../../../core/utils/mediaUrl";
import type { ClubResponse } from "../../clubs/clubTypes";
import type { ClubPresidentResponse } from "../../clubPresidents/clubPresidentTypes";
import { LegitimacyInfamyMeters } from "../../clubPresidents/components/LegitimacyInfamyMeters";
import { PresidentAttributesPanel } from "../../clubPresidents/components/PresidentAttributesPanel";
import { getLegitimacyXp } from "../../clubPresidents/utils/presidentProfileHelpers";

interface DashboardPresidentHeroProps {
  president: ClubPresidentResponse;
  club?: ClubResponse;
  winRate: number | null;
  profileImageUrl?: string | null;
}

export const DashboardPresidentHero = ({
  president,
  club,
  winRate,
  profileImageUrl,
}: DashboardPresidentHeroProps) => {
  const legitimacyXp = getLegitimacyXp(president.reputationPoints);
  const title = president.title?.trim() || "Club President";
  const avatarUrl = resolveMediaUrl(profileImageUrl);

  return (
    <section className="relative col-span-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-6 shadow-sm md:col-span-8 lg:col-span-12 md:p-8">
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 translate-x-1/4 -translate-y-1/2 rounded-full bg-primary opacity-5 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col items-center gap-3 lg:items-start">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary via-surface-variant to-secondary-container p-1 md:h-36 md:w-36">
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
          <Link
            to="/app/president"
            className="inline-flex items-center gap-1 text-body-sm font-semibold text-primary hover:underline"
          >
            Full profile
            <MaterialIcon name="arrow_forward" className="text-sm" />
          </Link>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="text-center lg:text-left">
            <p className="mb-1 font-label-caps text-label-caps text-primary">Your President</p>
            <h1 className="text-[28px] leading-9 font-extrabold tracking-tight text-on-surface lg:text-display-md">
              {president.name}
            </h1>
            <p className="mt-1 flex items-center justify-center gap-2 text-headline-sm text-on-surface-variant lg:justify-start">
              <MaterialIcon name="workspace_premium" className="text-secondary" />
              {title}
            </p>
          </div>

          <PresidentAttributesPanel
            attributes={{
              charisma: president.charisma,
              authority: president.authority,
              integrity: president.integrity,
              cunning: president.cunning,
              connections: president.connections,
            }}
          />

          <LegitimacyInfamyMeters
            legitimacy={president.reputationPoints}
            infamy={president.infamyPoints}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <HeroStat
              label="Legitimacy XP"
              value={`${legitimacyXp.toLocaleString("en-US")} XP`}
              accentClassName="text-primary"
            />
            <HeroStat
              label="Win Rate"
              value={winRate == null ? "—" : `${winRate.toFixed(1)}%`}
            />
            <HeroStat label="Club" value={club?.name ?? "—"} />
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroStat = ({
  label,
  value,
  accentClassName = "text-on-surface",
}: {
  label: string;
  value: string;
  accentClassName?: string;
}) => {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-variant p-3">
      <p className="mb-1 text-label-caps text-on-surface-variant">{label}</p>
      <p className={`text-stat-value ${accentClassName}`}>{value}</p>
    </div>
  );
};
