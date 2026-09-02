import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  FORMATION_OPTIONS,
  MENTALITY_OPTIONS,
  getFormationEffectSummary,
  getMentalityEffectSummary,
} from "@/features/clubLineups/utils/tacticsHelpers";
import { TeamFormation, TeamMentality } from "@/features/clubLineups/clubLineupTypes";

interface TacticsPlanPanelProps {
  formation: TeamFormation;
  mentality: TeamMentality;
  onFormationChange: (formation: TeamFormation) => void;
  onMentalityChange: (mentality: TeamMentality) => void;
  onReset: () => void;
}

export const TacticsPlanPanel = ({
  formation,
  mentality,
  onFormationChange,
  onMentalityChange,
  onReset,
}: TacticsPlanPanelProps) => {
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low md:w-52 md:shrink-0">
      <div className="border-b border-outline-variant p-3">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Plan</h3>
        <p className="mt-1 text-[11px] leading-snug text-on-surface-variant">
          Shape and approach for match day.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        <section>
          <label
            htmlFor="tactics-formation"
            className="mb-2.5 block font-label-caps text-label-caps text-primary"
          >
            Formation
          </label>
          <select
            id="tactics-formation"
            value={formation}
            onChange={(event) => {
              onFormationChange(Number(event.target.value) as TeamFormation);
            }}
            className="h-8 w-full rounded border-outline-variant bg-surface-container-highest px-2 py-1 font-data-mono text-data-mono text-on-background focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {FORMATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-4 rounded border border-primary/20 bg-primary/5 px-2 py-1.5 text-[11px] leading-snug text-on-surface-variant">
            {getFormationEffectSummary(formation)}
          </p>
        </section>

        <section className="border-t border-outline-variant pt-4">
          <label
            htmlFor="tactics-mentality"
            className="mb-2.5 block font-label-caps text-label-caps text-primary"
          >
            Mentality
          </label>
          <select
            id="tactics-mentality"
            value={mentality}
            onChange={(event) => {
              onMentalityChange(Number(event.target.value) as TeamMentality);
            }}
            className="h-8 w-full rounded border-outline-variant bg-surface-container-highest px-2 py-1 font-label-caps text-label-caps text-on-background focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {MENTALITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-4 rounded border border-primary/20 bg-primary/5 px-2 py-1.5 text-[11px] leading-snug text-on-surface-variant">
            {getMentalityEffectSummary(mentality)}
          </p>
        </section>
      </div>

      <div className="space-y-2 border-t border-outline-variant p-3">
        <p className="flex items-start gap-1.5 text-[10px] leading-snug text-on-surface-variant">
          <MaterialIcon name="info" className="mt-0.5 shrink-0 text-sm text-primary" />
          <span>
            Players are colored by position. Drag to swap, or click a pitch slot to pick.
          </span>
        </p>
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded border border-outline-variant px-3 py-1.5 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
        >
          Reset
        </button>
      </div>
    </aside>
  );
};
