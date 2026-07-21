import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import type { TransferMarketItem } from "../transferTypes";
import { buildScoutNote } from "../utils/makeOfferHelpers";

interface MakeOfferScoutReportProps {
  player: PlayerInstanceResponse;
  listing: TransferMarketItem;
}

export const MakeOfferScoutReport = ({
  player,
  listing,
}: MakeOfferScoutReportProps) => {
  const seasonChips = [
    { label: "G", value: player.seasonGoals },
    { label: "A", value: player.seasonAssists },
    { label: "YC", value: player.seasonYellowCards },
    { label: "RC", value: player.seasonRedCards },
  ];

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
      <h3 className="mb-4 border-b border-outline-variant pb-3 font-headline-sm text-headline-sm text-on-surface">
        Scout Report
      </h3>

      <div className="space-y-4">
        <div>
          <span className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
            Season Stats
          </span>
          <div className="flex flex-wrap gap-2">
            {seasonChips.map((chip) => (
              <div
                key={chip.label}
                className="flex h-8 min-w-8 items-center justify-center gap-1 rounded border border-primary/30 bg-primary/20 px-2 font-data-mono text-[11px] text-primary"
              >
                <span className="text-on-surface-variant">{chip.label}</span>
                <span>{chip.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            {buildScoutNote(player, listing)}
          </p>
        </div>
      </div>
    </div>
  );
};
