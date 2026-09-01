import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { ClubPreview } from "../../clubs/clubTypes";
import { getClubDisplayName } from "../../clubs/utils/clubDisplayName";
import type { LeagueDivisionResponse } from "../../leagueDivisions/leagueDivisionTypes";
import type { RefereeResponse } from "../../referees/refereeTypes";
import { formatDivisionOption } from "../utils/adminMatchesHelpers";

export interface AdminMatchFormValues {
  divisionId: number | "";
  matchWeek: number;
  homeClubId: string;
  awayClubId: string;
  refereeId: number | "";
  matchDate: string;
}

interface AdminMatchFormPanelProps {
  mode: "create" | "edit";
  isOpen: boolean;
  values: AdminMatchFormValues;
  divisions: LeagueDivisionResponse[];
  clubs: ClubPreview[];
  referees: RefereeResponse[];
  isSubmitting: boolean;
  onChange: (values: AdminMatchFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AdminMatchFormPanel = ({
  mode,
  isOpen,
  values,
  divisions,
  clubs,
  referees,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: AdminMatchFormPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const title = mode === "create" ? "Schedule Match" : "Edit Match Schedule";
  const submitLabel = mode === "create" ? "Create Match" : "Update Match";
  const divisionClubs = clubs;

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col border-l border-outline-variant bg-surface-container-low xl:flex xl:w-80">
      <div className="flex items-center gap-2 border-b border-outline-variant bg-surface p-4">
        <MaterialIcon name="event_available" className="text-primary" />
        <h3 className="flex-1 text-headline-sm font-semibold text-on-surface">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant transition-colors hover:text-on-surface xl:hidden"
          aria-label="Close panel"
        >
          <MaterialIcon name="close" className="text-sm" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1">
          <label htmlFor="match-division" className="text-label-caps text-on-surface-variant">
            Division
          </label>
          <select
            id="match-division"
            value={values.divisionId}
            onChange={(event) =>
              onChange({
                ...values,
                divisionId: event.target.value === "" ? "" : Number(event.target.value),
                homeClubId: "",
                awayClubId: "",
              })
            }
            className="w-full rounded border border-outline-variant bg-surface p-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Select division</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {formatDivisionOption(division)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="match-week" className="text-label-caps text-on-surface-variant">
            Match Week
          </label>
          <input
            id="match-week"
            type="number"
            min={1}
            value={values.matchWeek}
            onChange={(event) =>
              onChange({ ...values, matchWeek: Number(event.target.value) })
            }
            className="w-full rounded border border-outline-variant bg-surface p-2 font-data-mono text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="relative space-y-3 overflow-hidden rounded border border-outline-variant bg-surface p-3">
          <div
            className="pointer-events-none absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 19px, #fff 19px, #fff 20px)",
            }}
          />

          <div className="relative space-y-1">
            <label htmlFor="match-home" className="text-label-caps text-on-surface-variant">
              Home Club
            </label>
            <select
              id="match-home"
              value={values.homeClubId}
              onChange={(event) =>
                onChange({ ...values, homeClubId: event.target.value })
              }
              disabled={values.divisionId === ""}
              className="w-full rounded border border-outline-variant bg-surface p-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              <option value="">Select Home Team...</option>
              {divisionClubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {getClubDisplayName(club)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative z-10 -my-1 flex justify-center">
            <span className="rounded border border-outline-variant bg-surface-variant px-2 py-0.5 font-data-mono text-xs text-on-surface-variant">
              VS
            </span>
          </div>

          <div className="relative space-y-1">
            <label htmlFor="match-away" className="text-label-caps text-on-surface-variant">
              Away Club
            </label>
            <select
              id="match-away"
              value={values.awayClubId}
              onChange={(event) =>
                onChange({ ...values, awayClubId: event.target.value })
              }
              disabled={values.divisionId === ""}
              className="w-full rounded border border-outline-variant bg-surface p-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              <option value="">Select Away Team...</option>
              {divisionClubs
                .filter((club) => club.id !== values.homeClubId)
                .map((club) => (
                  <option key={club.id} value={club.id}>
                    {getClubDisplayName(club)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="match-referee" className="text-label-caps text-on-surface-variant">
            Referee
          </label>
          <select
            id="match-referee"
            value={values.refereeId}
            onChange={(event) =>
              onChange({
                ...values,
                refereeId: event.target.value === "" ? "" : Number(event.target.value),
              })
            }
            className="w-full rounded border border-outline-variant bg-surface p-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Unassigned</option>
            {referees.map((referee) => (
              <option key={referee.id} value={referee.id}>
                {referee.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-on-surface-variant">
            A referee is required before simulation.
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="match-date" className="text-label-caps text-on-surface-variant">
            Date & Time
          </label>
          <input
            id="match-date"
            type="datetime-local"
            value={values.matchDate}
            onChange={(event) =>
              onChange({ ...values, matchDate: event.target.value })
            }
            className="w-full rounded border border-outline-variant bg-surface p-2 font-data-mono text-sm text-on-surface outline-none [color-scheme:dark] focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-auto flex justify-end gap-3 border-t border-outline-variant bg-surface p-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </aside>
  );
};
