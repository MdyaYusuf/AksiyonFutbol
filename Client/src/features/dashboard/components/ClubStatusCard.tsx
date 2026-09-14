import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubResponse } from "@/features/clubs/clubTypes";
import {
  formatCash,
  getChemistryLabel,
  getDisciplineLabel,
  getMoraleLabel,
} from "@/features/dashboard/utils/dashboardFormatters";

interface ClubStatusCardProps {
  club?: ClubResponse;
}

const StatTile = ({
  icon,
  label,
  value,
  detail,
  valueClassName = "text-primary",
  detailClassName = "text-on-surface-variant",
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
  valueClassName?: string;
  detailClassName?: string;
}) => (
  <div className="rounded border border-outline-variant bg-background p-3">
    <div className="mb-2 flex items-center gap-2">
      <MaterialIcon name={icon} className="text-sm text-on-surface-variant" />
      <span className="text-body-sm text-on-surface-variant">{label}</span>
    </div>
    <div className={`text-stat-value ${valueClassName}`}>{value}</div>
    <div className={`mt-1 font-data-mono text-xs ${detailClassName}`}>{detail}</div>
  </div>
);

export const ClubStatusCard = ({ club }: ClubStatusCardProps) => {
  return (
    <div className="col-span-1 rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-4 lg:col-span-6">
      <h2 className="mb-4 text-label-caps text-on-surface-variant">Club Status</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatTile
          icon="account_balance_wallet"
          label="Finances"
          value={club ? formatCash(club.cash) : "—"}
          detail="Current balance"
        />
        <StatTile
          icon="mood"
          label="Morale"
          value={club ? `${club.morale}%` : "—"}
          detail={club ? getMoraleLabel(club.morale) : "—"}
          detailClassName="text-primary"
        />
        <StatTile
          icon="hub"
          label="Chemistry"
          value={club ? `${club.chemistry}%` : "—"}
          detail={club ? getChemistryLabel(club.chemistry) : "—"}
          valueClassName="text-secondary"
        />
        <StatTile
          icon="gavel"
          label="Discipline"
          value={club ? `${club.discipline}%` : "—"}
          detail={club ? getDisciplineLabel(club.discipline) : "—"}
        />
      </div>
    </div>
  );
};
