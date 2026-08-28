import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ProgressBar } from "../../../core/components/ui/ProgressBar";
import {
  PRESIDENT_HONORABLE_POWER_THRESHOLD,
  PRESIDENT_MAX_INFAMY,
  PRESIDENT_MAX_LEGITIMACY,
  PRESIDENT_SHADY_TIER_II_THRESHOLD,
  hasHonorablePowerUnlock,
  hasShadyTierIIUnlock,
} from "../utils/presidentProfileHelpers";

interface LegitimacyInfamyMetersProps {
  legitimacy: number;
  infamy: number;
  maxLegitimacy?: number;
  maxInfamy?: number;
  compact?: boolean;
  showUnlockBadges?: boolean;
}

export const LegitimacyInfamyMeters = ({
  legitimacy,
  infamy,
  maxLegitimacy = PRESIDENT_MAX_LEGITIMACY,
  maxInfamy = PRESIDENT_MAX_INFAMY,
  compact = false,
  showUnlockBadges = true,
}: LegitimacyInfamyMetersProps) => {
  const honorableUnlocked = hasHonorablePowerUnlock(legitimacy);
  const shadyUnlocked = hasShadyTierIIUnlock(infamy);

  return (
    <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
      <div className="rounded-lg border border-outline-variant bg-surface-variant p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <MaterialIcon name="verified" className="text-sm text-primary" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Legitimacy
            </span>
          </div>
          <span className="font-data-mono text-data-mono text-primary">
            {legitimacy}/{maxLegitimacy}
          </span>
        </div>
        <ProgressBar value={legitimacy} max={maxLegitimacy} />
        {showUnlockBadges && honorableUnlocked ? (
          <p className="mt-2 font-body-sm text-body-sm text-primary">
            Honorable Power unlocked
          </p>
        ) : showUnlockBadges ? (
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Reach {PRESIDENT_HONORABLE_POWER_THRESHOLD} for Honorable Power
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-secondary/30 bg-surface-variant p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <MaterialIcon name="visibility_off" className="text-sm text-secondary" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Infamy
            </span>
          </div>
          <span className="font-data-mono text-data-mono text-secondary">
            {infamy}/{maxInfamy}
          </span>
        </div>
        <ProgressBar
          value={infamy}
          max={maxInfamy}
          colorClassName="bg-secondary"
          trackClassName="bg-secondary/20"
        />
        {showUnlockBadges && shadyUnlocked ? (
          <p className="mt-2 font-body-sm text-body-sm text-secondary">
            Gray Tier II unlocked
          </p>
        ) : showUnlockBadges ? (
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Reach {PRESIDENT_SHADY_TIER_II_THRESHOLD} for Gray Tier II
          </p>
        ) : null}
      </div>
    </div>
  );
};
