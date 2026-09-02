import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubPresidentResponse } from "@/features/clubPresidents/clubPresidentTypes";
import { LegitimacyInfamyMeters } from "@/features/clubPresidents/components/LegitimacyInfamyMeters";

interface PresidentIdentityBannerProps {
  president?: ClubPresidentResponse;
}

export const PresidentIdentityBanner = ({ president }: PresidentIdentityBannerProps) => {
  if (!president) {
    return null;
  }

  return (
    <section className="col-span-1 rounded-xl border border-outline-variant bg-surface-container-high p-4 md:col-span-8 lg:col-span-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MaterialIcon name="account_balance" className="text-primary" />
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              President Identity
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {president.name} · {president.title?.trim() || "Club President"}
            </p>
          </div>
        </div>
        <p className="max-w-xl font-body-sm text-body-sm text-on-surface-variant">
          Legitimacy rewards the clean path. Infamy tracks gray-area influence. Both shape what
          you can unlock later.
        </p>
      </div>
      <LegitimacyInfamyMeters
        legitimacy={president.reputationPoints}
        infamy={president.infamyPoints}
      />
    </section>
  );
};
