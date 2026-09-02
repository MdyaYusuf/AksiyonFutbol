import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

export const ActionsPageIntro = () => {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="mb-2 font-display-lg text-display-lg tracking-tight text-on-surface">
          Actions
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Spend resources, tilt the odds, manage the heat
        </p>
      </div>
      <div className="flex max-w-sm items-center gap-2 rounded border border-outline-variant/30 bg-surface-variant/50 px-4 py-2">
        <MaterialIcon name="info" className="shrink-0 text-base text-secondary" />
        <p className="font-body-sm text-body-sm leading-snug text-on-surface-variant opacity-90">
          Fictional satire set in a made-up league. Gray-area moves are game mechanics only.
        </p>
      </div>
    </div>
  );
};
