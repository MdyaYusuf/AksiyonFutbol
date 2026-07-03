import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface PresidentPreviewCardProps {
  name: string;
  title: string;
  isReady: boolean;
}

export const PresidentPreviewCard = ({
  name,
  title,
  isReady,
}: PresidentPreviewCardProps) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary-container to-surface-variant opacity-20 blur" />
      <div className="relative flex h-[500px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container/60 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-outline-variant/50 bg-surface-container-lowest/50 px-6 py-4">
          <span className="flex items-center gap-2 text-label-caps text-on-surface-variant">
            <MaterialIcon name="visibility" className="text-[16px]" />
            Live Preview
          </span>
          <span className="font-data-mono text-[11px] text-primary-fixed-dim">ID: PR-001</span>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center p-8">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(#bccbb9 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          <div className="relative z-10 mb-6 h-32 w-32">
            <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border-2 border-dashed border-primary opacity-50" />
            <div className="absolute inset-2 flex items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest">
              <MaterialIcon name="person" className="text-4xl text-on-surface-variant" />
            </div>
          </div>

          <div className="z-10 w-full text-center">
            <h2 className="mb-1 min-h-8 text-headline-md text-on-surface">
              {name || "\u00A0"}
            </h2>
            <p className="min-h-5 text-body-sm text-secondary">{title || "\u00A0"}</p>
          </div>

          <div className="z-10 mt-8 grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-lg border border-outline-variant/50 bg-surface-container-low p-3">
              <MaterialIcon name="military_tech" className="mb-1 text-[20px] text-primary" />
              <span className="text-stat-value text-on-surface">0</span>
              <span className="text-[10px] text-label-caps text-on-surface-variant">
                Reputation
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-outline-variant/50 bg-surface-container-low p-3">
              <MaterialIcon name="account_balance" className="mb-1 text-[20px] text-on-surface-variant" />
              <span className="text-stat-value text-on-surface">N/A</span>
              <span className="text-[10px] text-label-caps text-on-surface-variant">
                Club Assigned
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/50 bg-surface-container-lowest/50 px-6 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 animate-pulse rounded-full ${isReady ? "bg-primary" : "bg-error"}`}
            />
            <span className="font-data-mono text-[10px] text-on-surface-variant">
              {isReady ? "READY FOR REGISTRATION" : "AWAITING INPUT"}
            </span>
          </div>
          <MaterialIcon name="fingerprint" className="text-[18px] text-on-surface-variant opacity-30" />
        </div>
      </div>
    </div>
  );
};
