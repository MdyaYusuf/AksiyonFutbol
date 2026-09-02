import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { BriberyContext } from "@/features/bribery/briberyTypes";
import {
  formatFixtureHeadline,
  formatInfluenceMatchDate,
  getDifficultyLabel,
  getPersonalityBlurb,
} from "@/features/bribery/utils/matchInfluenceHelpers";

interface MatchInfluenceContextCardProps {
  context: BriberyContext;
}

export const MatchInfluenceContextCard = ({
  context,
}: MatchInfluenceContextCardProps) => {
  const difficulty = context.briberyDifficulty ?? 0;
  const personality = context.refereePersonality ?? "";
  const difficultyLabel = getDifficultyLabel(difficulty);
  const difficultyPercent = Math.min(100, Math.max(0, difficulty));
  const heatPercent = Math.min(
    100,
    Math.max(0, (context.suspicion / Math.max(1, context.maxSuspicion)) * 100),
  );

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container p-5">
        <div className="flex flex-col gap-1">
          <span className="font-label-caps text-label-caps text-secondary">
            Next Fixture
          </span>
          <span className="font-headline-sm text-headline-sm text-on-background">
            {formatFixtureHeadline(context)}
          </span>
        </div>
        <span className="rounded border border-outline-variant bg-surface px-3 py-1 font-data-mono text-data-mono text-on-surface-variant">
          {context.matchDate ? formatInfluenceMatchDate(context.matchDate) : "—"}
        </span>
      </div>

      <div className="border-b border-outline-variant px-6 py-4">
        <div className="mb-2 flex items-end justify-between">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
            Club Heat
          </span>
          <span className="font-data-mono text-data-mono text-secondary">
            {context.suspicion} / {context.maxSuspicion}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full border border-outline-variant bg-surface">
          <div
            className="h-full bg-secondary"
            style={{ width: `${heatPercent}%` }}
          />
        </div>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          Higher heat raises detection odds on every gray-area move.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
            Assigned Official
          </span>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-outline-variant bg-surface">
              <MaterialIcon name="sports" className="text-3xl text-on-surface-variant" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-stat-value text-stat-value text-on-background">
                {context.refereeName ?? "—"}
              </span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="font-body-sm text-body-sm text-secondary">
                  Personality: {personality || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-end justify-between">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
              Approach Difficulty
            </span>
            <span className="font-data-mono text-data-mono text-secondary">
              {difficultyLabel} ({difficultyPercent}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full border border-outline-variant bg-surface">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${difficultyPercent}%` }}
            />
          </div>
          <p className="mt-1 font-body-sm text-body-sm italic text-on-surface-variant">
            &ldquo;{getPersonalityBlurb(personality)}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
