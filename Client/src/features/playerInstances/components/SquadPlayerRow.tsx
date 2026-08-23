import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { getNationalityFlagSrc } from "../../../core/utils/nationalityFlags";
import type { PlayerInstanceResponse } from "../playerInstanceTypes";
import {
  formatSquadMoney,
  getOverallBadgeClassName,
  getPlayerDisplayName,
  getPlayerInitials,
  getPlayerStatus,
  getPositionBadgeClassName,
  getPositionLabel,
  getPreferredFootLabel,
  getPreferredFootShortLabel,
  getSeasonCardsTotal,
} from "../utils/squadHelpers";

interface SquadPlayerRowProps {
  player: PlayerInstanceResponse;
}

export const SquadPlayerRow = ({ player }: SquadPlayerRowProps) => {
  const status = getPlayerStatus(player);
  const displayName = getPlayerDisplayName(player.firstName, player.lastName);
  const initials = getPlayerInitials(player.firstName, player.lastName);
  const cards = getSeasonCardsTotal(player);
  const detailPath = `/app/squad/${player.id}`;
  const flagSrc = getNationalityFlagSrc(player.nationality);
  const nationalityLabel = player.nationality?.trim() || "Unknown";

  return (
    <tr className="transition-colors hover:bg-surface-container-high">
      <td className="px-4 py-3">
        <span
          className={`inline-flex h-6 w-8 items-center justify-center rounded text-label-caps ${getPositionBadgeClassName(player.position)}`}
        >
          {getPositionLabel(player.position)}
        </span>
      </td>
      <td className="px-4 py-3">
        <Link
          to={detailPath}
          className="flex items-center gap-3 font-semibold text-on-surface transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-variant bg-surface-bright text-label-caps text-on-surface-variant">
            {initials}
          </div>
          {displayName}
        </Link>
      </td>
      <td className="px-4 py-3">
        {flagSrc ? (
          <img
            src={flagSrc}
            alt={nationalityLabel}
            title={nationalityLabel}
            width={33}
            height={20}
            className="h-5 w-[33px] object-contain"
          />
        ) : (
          <span
            title={nationalityLabel}
            className="inline-block h-5 w-[33px] rounded-sm bg-surface-container-highest"
          />
        )}
      </td>
      <td className="px-4 py-3 font-data-mono text-data-mono text-on-surface-variant">
        <span title={getPreferredFootLabel(player.preferredFoot)}>
          {getPreferredFootShortLabel(player.preferredFoot)}
        </span>
      </td>
      <td className="px-4 py-3 font-data-mono text-data-mono text-on-surface-variant">
        {player.age}
      </td>
      <td className="px-4 py-3 font-data-mono text-data-mono text-on-surface-variant">
        {player.heightCm}cm
      </td>
      <td className="px-4 py-3 font-data-mono text-data-mono text-on-surface-variant">
        {player.weightKg}kg
      </td>
      <td className="px-4 py-3">
        <div
          className={`inline-flex h-8 w-8 items-center justify-center rounded text-stat-value ${getOverallBadgeClassName(player.overallRating)}`}
        >
          {player.overallRating}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] text-label-caps ${status.className}`}
        >
          <MaterialIcon name={status.icon} className="text-[14px]" />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3 font-data-mono text-data-mono text-on-surface-variant">
        {player.seasonGoals} / {player.seasonAssists} / {cards}
      </td>
      <td className="px-4 py-3 text-right font-data-mono text-data-mono text-on-surface">
        {formatSquadMoney(player.wage)}
      </td>
      <td className="px-4 py-3 text-right font-data-mono text-data-mono text-on-surface">
        {formatSquadMoney(player.marketValue)}
      </td>
    </tr>
  );
};
