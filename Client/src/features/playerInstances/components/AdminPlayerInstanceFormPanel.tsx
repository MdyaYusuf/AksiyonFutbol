import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  PlayerPosition,
  PreferredFoot,
  type BasePlayerResponse,
} from "../../basePlayers/basePlayerTypes";
import type { ClubResponse } from "../../clubs/clubTypes";

export type PlayerInstancePanelTab = "assign" | "custom" | "edit";

export interface AssignFromBaseFormValues {
  clubId: string;
  basePlayerId: string;
  marketValue: number;
  wage: number;
}

export interface CustomPlayerFormValues {
  clubId: string;
  firstName: string;
  lastName: string;
  nationality: string;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
  marketValue: number;
  wage: number;
}

export interface EditPlayerFormValues {
  firstName: string;
  lastName: string;
  clubName: string;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
  isInjured: boolean;
  injuryDays: number;
  seasonGoals: number;
  seasonAssists: number;
  seasonYellowCards: number;
  seasonRedCards: number;
  marketValue: number;
  wage: number;
}

interface AdminPlayerInstanceFormPanelProps {
  activeTab: PlayerInstancePanelTab;
  isOpen: boolean;
  isSubmitting: boolean;
  hasEditingPlayer: boolean;
  clubs: ClubResponse[];
  basePlayers: BasePlayerResponse[];
  assignValues: AssignFromBaseFormValues;
  customValues: CustomPlayerFormValues;
  editValues: EditPlayerFormValues;
  onTabChange: (tab: PlayerInstancePanelTab) => void;
  onAssignChange: (values: AssignFromBaseFormValues) => void;
  onCustomChange: (values: CustomPlayerFormValues) => void;
  onEditChange: (values: EditPlayerFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const positionOptions = [
  { value: PlayerPosition.Goalkeeper, label: "Goalkeeper (GK)" },
  { value: PlayerPosition.Defender, label: "Defender (DEF)" },
  { value: PlayerPosition.Midfielder, label: "Midfielder (MID)" },
  { value: PlayerPosition.Forward, label: "Forward (FWD)" },
];

const footOptions = [
  { value: PreferredFoot.Right, label: "Right" },
  { value: PreferredFoot.Left, label: "Left" },
  { value: PreferredFoot.Both, label: "Both" },
];

const inputClassName =
  "w-full rounded border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export const AdminPlayerInstanceFormPanel = ({
  activeTab,
  isOpen,
  isSubmitting,
  hasEditingPlayer,
  clubs,
  basePlayers,
  assignValues,
  customValues,
  editValues,
  onTabChange,
  onAssignChange,
  onCustomChange,
  onEditChange,
  onClose,
  onSubmit,
}: AdminPlayerInstanceFormPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const title =
    activeTab === "assign"
      ? "Assign From Base"
      : activeTab === "custom"
        ? "Create Custom Player"
        : "Edit Player";

  const submitLabel =
    activeTab === "edit"
      ? "Save Changes"
      : activeTab === "assign"
        ? "Assign Player"
        : "Create Player";

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-l border-outline-variant bg-surface-container-low xl:w-96">
      <div className="flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-6">
        <h3 className="text-headline-sm font-bold text-on-surface">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label="Close panel"
        >
          <MaterialIcon name="close" />
        </button>
      </div>

      <div className="flex border-b border-outline-variant px-2">
        {(
          [
            { id: "assign", label: "Assign Base" },
            { id: "custom", label: "Custom" },
            { id: "edit", label: "Edit Player" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={[
              "flex-1 border-b-2 pb-2 pt-3 text-label-caps font-bold transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {activeTab === "assign" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps text-on-surface-variant">Club</label>
              <select
                value={assignValues.clubId}
                onChange={(event) =>
                  onAssignChange({ ...assignValues, clubId: event.target.value })
                }
                className={inputClassName}
              >
                <option value="">Select club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps text-on-surface-variant">Base Player</label>
              <select
                value={assignValues.basePlayerId}
                onChange={(event) =>
                  onAssignChange({
                    ...assignValues,
                    basePlayerId: event.target.value,
                  })
                }
                className={inputClassName}
              >
                <option value="">Select base player</option>
                {basePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.defaultFirstName} {player.defaultLastName} (OVR{" "}
                    {player.overallRating})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Market Value ($)</label>
                <input
                  type="number"
                  min={0}
                  value={assignValues.marketValue}
                  onChange={(event) =>
                    onAssignChange({
                      ...assignValues,
                      marketValue: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Wage ($)</label>
                <input
                  type="number"
                  min={0}
                  value={assignValues.wage}
                  onChange={(event) =>
                    onAssignChange({
                      ...assignValues,
                      wage: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "custom" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-label-caps text-on-surface-variant">First Name</label>
                <input
                  type="text"
                  value={customValues.firstName}
                  onChange={(event) =>
                    onCustomChange({ ...customValues, firstName: event.target.value })
                  }
                  className={inputClassName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-caps text-on-surface-variant">Last Name</label>
                <input
                  type="text"
                  value={customValues.lastName}
                  onChange={(event) =>
                    onCustomChange({ ...customValues, lastName: event.target.value })
                  }
                  className={inputClassName}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps text-on-surface-variant">Club</label>
              <select
                value={customValues.clubId}
                onChange={(event) =>
                  onCustomChange({ ...customValues, clubId: event.target.value })
                }
                className={inputClassName}
              >
                <option value="">Select club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-label-caps text-on-surface-variant">Nationality</label>
                <input
                  type="text"
                  value={customValues.nationality}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      nationality: event.target.value,
                    })
                  }
                  className={inputClassName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-caps text-on-surface-variant">Position</label>
                <select
                  value={customValues.position}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      position: Number(event.target.value) as PlayerPosition,
                    })
                  }
                  className={inputClassName}
                >
                  {positionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Age</label>
                <input
                  type="number"
                  min={16}
                  max={40}
                  value={customValues.age}
                  onChange={(event) =>
                    onCustomChange({ ...customValues, age: Number(event.target.value) })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Height</label>
                <input
                  type="number"
                  min={150}
                  max={220}
                  value={customValues.heightCm}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      heightCm: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Weight</label>
                <input
                  type="number"
                  min={50}
                  max={120}
                  value={customValues.weightKg}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      weightKg: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps text-on-surface-variant">Preferred Foot</label>
              <select
                value={customValues.preferredFoot}
                onChange={(event) =>
                  onCustomChange({
                    ...customValues,
                    preferredFoot: Number(event.target.value) as PreferredFoot,
                  })
                }
                className={inputClassName}
              >
                {footOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">ATT</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={customValues.attackPower}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      attackPower: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">DEF</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={customValues.defenseStrength}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      defenseStrength: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">MID</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={customValues.midfieldControl}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      midfieldControl: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Market Value ($)</label>
                <input
                  type="number"
                  min={0}
                  value={customValues.marketValue}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      marketValue: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant">Wage ($)</label>
                <input
                  type="number"
                  min={0}
                  value={customValues.wage}
                  onChange={(event) =>
                    onCustomChange({
                      ...customValues,
                      wage: Number(event.target.value),
                    })
                  }
                  className={`${inputClassName} font-data-mono`}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "edit" && !hasEditingPlayer && (
          <div className="rounded border border-outline-variant bg-background p-4 text-sm text-on-surface-variant">
            Select a player from the table and click Edit to manage their instance.
          </div>
        )}

        {activeTab === "edit" && hasEditingPlayer && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-label-caps text-on-surface-variant">First Name</label>
                <input
                  type="text"
                  value={editValues.firstName}
                  onChange={(event) =>
                    onEditChange({ ...editValues, firstName: event.target.value })
                  }
                  className={inputClassName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-label-caps text-on-surface-variant">Last Name</label>
                <input
                  type="text"
                  value={editValues.lastName}
                  onChange={(event) =>
                    onEditChange({ ...editValues, lastName: event.target.value })
                  }
                  className={inputClassName}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-caps text-on-surface-variant">Club Assigned</label>
              <input
                type="text"
                value={editValues.clubName}
                readOnly
                className={`${inputClassName} opacity-70`}
              />
              <p className="text-[11px] text-on-surface-variant">
                Club assignment cannot be changed here.
              </p>
            </div>

            <hr className="border-outline-variant" />

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-label-caps text-secondary">
                <MaterialIcon name="favorite" className="text-[14px]" />
                Health Status
              </h4>
              <div className="flex flex-col gap-3 rounded border border-outline-variant bg-background p-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editValues.isInjured}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        isInjured: event.target.checked,
                        injuryDays: event.target.checked
                          ? Math.max(1, editValues.injuryDays)
                          : 0,
                      })
                    }
                    className="rounded border-outline-variant text-error focus:ring-error"
                  />
                  <span className="text-sm text-on-surface">Currently Injured</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-on-surface-variant">Days Remaining:</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.injuryDays}
                    disabled={!editValues.isInjured}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        injuryDays: Number(event.target.value),
                      })
                    }
                    className="w-20 rounded border border-outline-variant bg-surface px-2 py-1 font-data-mono text-sm text-on-surface disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-label-caps text-on-surface-variant">
                <MaterialIcon name="monitoring" className="text-[14px]" />
                Season Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Goals</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.seasonGoals}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        seasonGoals: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Assists</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.seasonAssists}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        seasonAssists: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Yellow Cards</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.seasonYellowCards}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        seasonYellowCards: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Red Cards</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.seasonRedCards}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        seasonRedCards: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-label-caps text-on-surface-variant">
                <MaterialIcon name="troubleshoot" className="text-[14px]" />
                Attributes & Contract
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Position</label>
                  <select
                    value={editValues.position}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        position: Number(event.target.value) as PlayerPosition,
                      })
                    }
                    className={inputClassName}
                  >
                    {positionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Age</label>
                  <input
                    type="number"
                    min={16}
                    max={40}
                    value={editValues.age}
                    onChange={(event) =>
                      onEditChange({ ...editValues, age: Number(event.target.value) })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">ATT</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editValues.attackPower}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        attackPower: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">DEF</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editValues.defenseStrength}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        defenseStrength: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">MID</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editValues.midfieldControl}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        midfieldControl: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Preferred Foot</label>
                  <select
                    value={editValues.preferredFoot}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        preferredFoot: Number(event.target.value) as PreferredFoot,
                      })
                    }
                    className={inputClassName}
                  >
                    {footOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Market Value ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.marketValue}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        marketValue: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface-variant">Wage ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={editValues.wage}
                    onChange={(event) =>
                      onEditChange({
                        ...editValues,
                        wage: Number(event.target.value),
                      })
                    }
                    className={`${inputClassName} font-data-mono`}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 border-t border-outline-variant bg-surface-container-highest p-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-surface-variant"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={
            isSubmitting || (activeTab === "edit" && !hasEditingPlayer)
          }
          className="flex-1 rounded bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </aside>
  );
};
