import { useEffect, useState } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { FictionalDisclaimer } from "@/core/components/legal/FictionalDisclaimer";

const STORAGE_KEY = "aksiyonfutbol.ageGateAccepted";

export const AgeGateModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(STORAGE_KEY) === "true";

    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container-high p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center gap-3">
          <MaterialIcon name="verified_user" className="text-3xl text-primary" />
          <div>
            <h2 id="age-gate-title" className="text-headline-sm font-bold text-on-surface">
              Age confirmation
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Required before you continue
            </p>
          </div>
        </div>

        <div className="space-y-4 text-body-sm text-on-surface-variant">
          <p>
            AksiyonFutbol includes fictional gray-area themes such as bribery, scandals, and
            political pressure. The game is intended for players aged 13 and older.
          </p>
          <FictionalDisclaimer compact />
          <p>
            By continuing, you confirm that you meet the minimum age requirement and understand
            this is a fictional game, not real-world guidance.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <a
            href="https://www.google.com"
            className="inline-flex items-center justify-center rounded border border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant transition-colors hover:bg-surface-variant"
          >
            Leave site
          </a>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded bg-primary px-5 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
          >
            I am 13 or older
          </button>
        </div>
      </div>
    </div>
  );
};
