import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  DivisionLifecycleStatus,
  type LeagueDivisionResponse,
} from "@/features/leagueDivisions/leagueDivisionTypes";

interface LeagueStandingsHeaderProps {
  division: LeagueDivisionResponse;
  maxMatchWeek: number;
  selectedMatchWeek: number;
  onMatchWeekChange: (matchWeek: number) => void;
  onExport: () => void;
}

const getDivisionSubtitle = (division: LeagueDivisionResponse): string => {
  if (division.isTutorial) {
    if (division.lifecycleStatus === DivisionLifecycleStatus.Sealed) {
      return "Placement complete";
    }

    return "Private placement league";
  }

  return `Group ${division.groupNumber} Standings`;
};

export const LeagueStandingsHeader = ({
  division,
  maxMatchWeek,
  selectedMatchWeek,
  onMatchWeekChange,
  onExport,
}: LeagueStandingsHeaderProps) => {
  const matchWeekOptions = Array.from(
    { length: Math.max(1, maxMatchWeek) },
    (_, index) => index + 1,
  );

  return (
    <div className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-end">
      <div>
        <h2 className="text-[32px] leading-10 font-extrabold tracking-tight text-on-surface lg:text-display-lg lg:leading-[56px]">
          {division.name}
        </h2>
        <p className="mt-2 text-headline-sm text-on-surface-variant">
          {getDivisionSubtitle(division)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded border border-outline-variant bg-surface-container px-3 py-1.5 focus-within:border-primary">
          <span className="mr-2 text-label-caps text-on-surface-variant">Match Week</span>
          <select
            value={selectedMatchWeek}
            onChange={(event) => onMatchWeekChange(Number(event.target.value))}
            className="cursor-pointer border-none bg-transparent p-0 pr-6 text-body-sm text-on-surface outline-none focus:ring-0"
          >
            {matchWeekOptions.map((week) => (
              <option key={week} value={week} className="bg-surface-container">
                {week}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-label-caps text-on-primary-container transition-colors hover:bg-primary-fixed"
        >
          <MaterialIcon name="download" className="text-[18px]" />
          EXPORT
        </button>
      </div>
    </div>
  );
};
