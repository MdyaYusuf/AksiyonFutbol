import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ActionsPresidentSummary } from "@/features/actions/actionTypes";
import {
  PRESIDENT_HONORABLE_POWER_THRESHOLD,
  PRESIDENT_SHADY_TIER_II_THRESHOLD,
  hasHonorablePowerUnlock,
  hasShadyTierIIUnlock,
} from "@/features/clubPresidents/utils/presidentProfileHelpers";
import { PresidentAttributesPanel } from "@/features/clubPresidents/components/PresidentAttributesPanel";
import { legitimacyAccent } from "@/features/actions/utils/actionPresentationHelpers";

interface ActionsPresidentSummaryCardProps {
  president: ActionsPresidentSummary;
}

export const ActionsPresidentSummaryCard = ({
  president,
}: ActionsPresidentSummaryCardProps) => {
  const title = president.title?.trim() || "Amateur";
  const maxLegitimacy = president.maxLegitimacy ?? 100;
  const maxInfamy = president.maxInfamy ?? 100;
  const legitimacyPercent = Math.min(
    100,
    Math.round((president.reputationPoints / maxLegitimacy) * 100),
  );
  const infamyPercent = Math.min(
    100,
    Math.round((president.infamyPoints / maxInfamy) * 100),
  );
  const honorableUnlocked = hasHonorablePowerUnlock(president.reputationPoints);
  const shadyUnlocked = hasShadyTierIIUnlock(president.infamyPoints);
  const avatarInitial = president.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="col-span-1 flex flex-col justify-between rounded-lg border border-outline-variant bg-surface-container p-5 md:col-span-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-variant">
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">
              {avatarInitial}
            </span>
          </div>
          <div>
            <h3 className="mb-1 font-headline-sm text-headline-sm text-on-surface">
              {president.name}
            </h3>
            <span className="rounded border border-outline-variant bg-surface-variant px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              President ({title})
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <PresidentAttributesPanel
          compact
          attributes={{
            charisma: president.charisma,
            authority: president.authority,
            integrity: president.integrity,
            cunning: president.cunning,
            connections: president.connections,
          }}
        />
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1 text-on-surface-variant">
              <MaterialIcon name="verified" className={["text-sm", legitimacyAccent.text].join(" ")} />
              Legitimacy
            </span>
            <span className={`font-data-mono ${legitimacyAccent.text}`}>
              {president.reputationPoints}/{maxLegitimacy}
            </span>
          </div>
          <div className={["h-1 w-full overflow-hidden rounded-full", legitimacyAccent.barTrack].join(" ")}>
            <div
              className={["h-full", legitimacyAccent.bar].join(" ")}
              style={{ width: `${legitimacyPercent}%` }}
            />
          </div>
          <p
            className={[
              "mt-1 text-[10px]",
              honorableUnlocked ? legitimacyAccent.text : "text-on-surface-variant",
            ].join(" ")}
          >
            {honorableUnlocked
              ? "Honorable Power unlocked"
              : `Reach ${PRESIDENT_HONORABLE_POWER_THRESHOLD} for Honorable Power`}
          </p>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1 text-on-surface-variant">
              <MaterialIcon name="visibility_off" className="text-sm text-secondary" />
              Infamy
            </span>
            <span className="font-data-mono text-secondary">
              {president.infamyPoints}/{maxInfamy}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/20">
            <div
              className="h-full bg-secondary"
              style={{ width: `${infamyPercent}%` }}
            />
          </div>
          <p
            className={[
              "mt-1 text-[10px]",
              shadyUnlocked ? "text-secondary" : "text-on-surface-variant",
            ].join(" ")}
          >
            {shadyUnlocked
              ? "Gray Tier II unlocked"
              : `Reach ${PRESIDENT_SHADY_TIER_II_THRESHOLD} for Gray Tier II`}
          </p>
        </div>
      </div>
    </div>
  );
};
