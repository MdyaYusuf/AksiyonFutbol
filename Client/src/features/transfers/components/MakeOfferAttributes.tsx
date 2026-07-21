import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { getAttributeToneClass } from "../utils/makeOfferHelpers";

interface MakeOfferAttributesProps {
  player: PlayerInstanceResponse;
}

export const MakeOfferAttributes = ({ player }: MakeOfferAttributesProps) => {
  const attributes = [
    { label: "Attack", value: player.attackPower },
    { label: "Defense", value: player.defenseStrength },
    { label: "Control", value: player.midfieldControl },
    { label: "Overall", value: player.overallRating },
  ];

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container p-5">
      <div className="mb-4 flex items-center justify-between border-b border-outline-variant pb-3">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Key Attributes</h3>
        <MaterialIcon name="monitoring" className="text-on-surface-variant" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {attributes.map((attribute) => (
          <div
            key={attribute.label}
            className="flex items-center justify-between rounded border border-outline-variant bg-surface p-3"
          >
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {attribute.label}
            </span>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded border font-data-mono text-data-mono font-bold ${getAttributeToneClass(attribute.value)}`}
            >
              {attribute.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
