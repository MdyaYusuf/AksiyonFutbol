import {
  FORMATION_OPTIONS,
  MENTALITY_OPTIONS,
} from "../utils/tacticsHelpers";
import { TeamFormation, TeamMentality } from "../clubLineupTypes";

interface TacticsControlsProps {
  formation: TeamFormation;
  mentality: TeamMentality;
  onFormationChange: (formation: TeamFormation) => void;
  onMentalityChange: (mentality: TeamMentality) => void;
  onReset: () => void;
}

export const TacticsControls = ({
  formation,
  mentality,
  onFormationChange,
  onMentalityChange,
  onReset,
}: TacticsControlsProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low p-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={formation}
          onChange={(event) =>
            onFormationChange(Number(event.target.value) as TeamFormation)
          }
          className="h-8 rounded border-outline-variant bg-surface-container-highest px-3 py-1 font-data-mono text-data-mono text-on-background focus:border-primary focus:ring-1 focus:ring-primary"
          aria-label="Formation"
        >
          {FORMATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={mentality}
          onChange={(event) =>
            onMentalityChange(Number(event.target.value) as TeamMentality)
          }
          className="h-8 rounded border-outline-variant bg-surface-container-highest px-3 py-1 font-label-caps text-label-caps text-on-background focus:border-primary focus:ring-1 focus:ring-primary"
          aria-label="Mentality"
        >
          {MENTALITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded border border-outline-variant px-3 py-1.5 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
      >
        Reset
      </button>
    </div>
  );
};
