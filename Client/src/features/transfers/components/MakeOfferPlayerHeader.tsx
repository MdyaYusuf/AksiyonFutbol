import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import {
  getPlayerFullName,
  getPositionLabel,
} from "../../playerInstances/utils/squadHelpers";
import type { TransferMarketItem } from "../transferTypes";
import {
  formatCompactMoney,
  getEstimatedValueRange,
  getStarFillCount,
} from "../utils/makeOfferHelpers";
import { formatTransferWage } from "../utils/transferMarketHelpers";

interface MakeOfferPlayerHeaderProps {
  player: PlayerInstanceResponse;
  listing: TransferMarketItem;
}

export const MakeOfferPlayerHeader = ({
  player,
  listing,
}: MakeOfferPlayerHeaderProps) => {
  const filledStars = getStarFillCount(player.overallRating);

  return (
    <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-6 shadow-sm">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary opacity-5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
          <MaterialIcon name="person" className="text-4xl text-on-surface-variant" />
        </div>

        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h1 className="font-headline-md text-headline-md text-on-surface">
              {getPlayerFullName(player.firstName, player.lastName)}
            </h1>
            <span className="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 font-label-caps text-[10px] text-primary">
              {getPositionLabel(player.position)}
            </span>
            <span className="rounded border border-outline-variant bg-surface-variant px-2 py-0.5 font-label-caps text-[10px] text-on-surface-variant">
              AGE {player.age}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <MaterialIcon name="location_on" className="text-[16px]" />
            <span>
              {listing.sellingClubName}
              {player.nationality ? ` • ${player.nationality}` : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
                Current Rating
              </span>
              <div className="flex items-center gap-0.5 text-primary">
                {Array.from({ length: 5 }, (_, index) => (
                  <MaterialIcon
                    key={`star-${index}`}
                    name="star"
                    filled={index < filledStars}
                    className="text-[18px]"
                  />
                ))}
                <span className="ml-2 font-data-mono text-data-mono text-on-surface">
                  {player.overallRating}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
                Est. Value
              </span>
              <span className="font-stat-value text-stat-value text-on-surface">
                {getEstimatedValueRange(player.marketValue)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
                Current Wage
              </span>
              <span className="font-data-mono text-data-mono text-on-surface">
                {formatTransferWage(player.wage)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
                Asking Price
              </span>
              <span className="font-data-mono text-data-mono text-primary">
                {formatCompactMoney(listing.askingPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
