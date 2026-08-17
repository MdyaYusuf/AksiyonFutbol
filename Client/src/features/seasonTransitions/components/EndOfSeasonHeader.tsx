import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface EndOfSeasonHeaderProps {
  divisionName: string;
  matchWeek: number;
  canProcess: boolean;
  isSubmitting: boolean;
  blockReason?: string | null;
  onContinue: () => void;
}

export const EndOfSeasonHeader = ({
  divisionName,
  matchWeek,
  canProcess,
  isSubmitting,
  blockReason,
  onContinue,
}: EndOfSeasonHeaderProps) => {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface-container-highest px-3 py-1 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {divisionName}
        </div>
        <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface md:text-5xl">
          Season Complete
        </h1>
        <p className="mt-2 text-lg font-medium text-on-surface-variant">
          The final whistle has blown. Promotion and relegation are applied automatically
          once every group fixture is complete.
        </p>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Matchday {matchWeek} of {matchWeek}
        </p>
        {!canProcess && blockReason ? (
          <p className="mt-3 text-body-sm text-error">{blockReason}</p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={!canProcess || isSubmitting}
        onClick={onContinue}
        className="group flex items-center gap-3 whitespace-nowrap rounded-xl bg-primary px-8 py-4 text-lg font-bold text-on-primary shadow-lg transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? "Processing..." : "Force Continue (if needed)"}
        <MaterialIcon
          name="arrow_forward"
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );
};
