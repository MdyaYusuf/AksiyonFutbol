import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { formatCashFull } from "@/features/clubs/utils/clubOverviewHelpers";
import type { ClubActionHistoryItem } from "@/features/actions/actionTypes";
import { ClubActionOutcome } from "@/features/actions/actionTypes";
import { legitimacyAccent } from "@/features/actions/utils/actionPresentationHelpers";

interface ActionsRecentHistoryTableProps {
  items: ClubActionHistoryItem[];
}

interface ImpactPart {
  text: string;
  className: string;
}

const formatResult = (item: ClubActionHistoryItem): string => {
  const outcome =
    item.outcome === ClubActionOutcome.Succeeded ? "Success" : "Failed";

  if (item.wasDetected) {
    return `${outcome} (Detected)`;
  }

  return outcome;
};

const getImpactParts = (item: ClubActionHistoryItem): ImpactPart[] => {
  const parts: ImpactPart[] = [];

  if (item.heatGenerated > 0) {
    parts.push({ text: `Heat +${item.heatGenerated}`, className: "text-on-surface-variant" });
  }

  if (item.fineAmount > 0) {
    parts.push({
      text: `Fine ${formatCashFull(item.fineAmount)}`,
      className: "text-error",
    });
  }

  if (item.scandalReputationPenaltyApplied > 0) {
    parts.push({
      text: `Legitimacy −${item.scandalReputationPenaltyApplied}`,
      className: legitimacyAccent.text,
    });
  }

  if (item.scandalMoralePenaltyApplied > 0) {
    parts.push({
      text: `Morale −${item.scandalMoralePenaltyApplied}`,
      className: "text-on-surface-variant",
    });
  }

  if (item.matchPenaltyApplied) {
    parts.push({ text: "Match penalty", className: "text-on-surface-variant" });
  }

  if (parts.length === 0) {
    if (item.outcome === ClubActionOutcome.Succeeded) {
      return [{ text: "Action completed", className: "text-on-surface-variant" }];
    }

    return [{ text: "No major impact", className: "text-on-surface-variant" }];
  }

  return parts;
};

export const ActionsRecentHistoryTable = ({ items }: ActionsRecentHistoryTableProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 mt-12">
      <h3 className="mb-4 border-b border-[#334155] pb-2 font-headline-md text-headline-md text-on-surface">
        Recent History
      </h3>
      <div className="overflow-hidden rounded border border-outline-variant bg-surface-container-high">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Week
              </th>
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Action
              </th>
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Result
              </th>
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Impact
              </th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono">
            {items.map((item) => {
              const succeeded = item.outcome === ClubActionOutcome.Succeeded;
              const resultClass = item.wasDetected
                ? "text-error"
                : succeeded
                  ? "text-primary"
                  : "text-on-surface-variant";
              const impactParts = getImpactParts(item);

              return (
                <tr
                  key={item.id}
                  className="border-b border-[#334155] transition-colors last:border-b-0 hover:bg-[#334155]"
                >
                  <td className="p-3 text-on-surface-variant">
                    {item.matchWeek != null ? `Wk ${item.matchWeek}` : "—"}
                  </td>
                  <td className="p-3 text-on-surface">
                    <span className="inline-flex items-center gap-2">
                      {item.displayName}
                      {item.wasDetected ? (
                        <MaterialIcon name="warning" className="text-sm text-secondary" />
                      ) : null}
                    </span>
                  </td>
                  <td className={["p-3", resultClass].join(" ")}>{formatResult(item)}</td>
                  <td className="p-3">
                    {impactParts.map((part, index) => (
                      <span key={part.text}>
                        {index > 0 ? ", " : null}
                        <span className={part.className}>{part.text}</span>
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
