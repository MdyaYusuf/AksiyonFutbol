import { legitimacyAccent } from "@/features/actions/utils/actionPresentationHelpers";

interface ActionMoralityDeltasProps {
  legitimacyDeltaOnSuccess?: number | null;
  infamyDeltaOnSuccess?: number | null;
}

export const ActionMoralityDeltas = ({
  legitimacyDeltaOnSuccess,
  infamyDeltaOnSuccess,
}: ActionMoralityDeltasProps) => {
  if (legitimacyDeltaOnSuccess == null && infamyDeltaOnSuccess == null) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {legitimacyDeltaOnSuccess != null ? (
        <span
          className={[
            "rounded-full border px-2.5 py-1 font-label-caps text-label-caps",
            legitimacyDeltaOnSuccess >= 0
              ? legitimacyAccent.badge
              : "border-error/30 bg-error/10 text-error",
          ].join(" ")}
        >
          {legitimacyDeltaOnSuccess >= 0 ? "+" : ""}
          {legitimacyDeltaOnSuccess} Legitimacy on success
        </span>
      ) : null}
      {infamyDeltaOnSuccess != null ? (
        <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 font-label-caps text-label-caps text-secondary">
          +{infamyDeltaOnSuccess} Infamy on success
        </span>
      ) : null}
    </div>
  );
};
