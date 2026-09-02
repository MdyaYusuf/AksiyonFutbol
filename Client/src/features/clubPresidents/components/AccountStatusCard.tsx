import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubPresidentResponse } from "@/features/clubPresidents/clubPresidentTypes";
import { formatMemberSince } from "@/features/clubPresidents/utils/presidentProfileHelpers";

interface AccountStatusCardProps {
  president: ClubPresidentResponse;
  email?: string;
}

export const AccountStatusCard = ({ president, email }: AccountStatusCardProps) => {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-high p-6">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="link" className="text-on-surface-variant" />
          Account Status
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border border-outline-variant bg-background p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label-caps text-on-surface-variant">Email Linked</span>
            <MaterialIcon name="check_circle" className="text-sm text-primary" filled />
          </div>
          <p className="truncate font-data-mono text-data-mono text-on-surface">
            {email ?? "—"}
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-background p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label-caps text-on-surface-variant">Account User</span>
            <MaterialIcon name="person" className="text-sm text-on-surface-variant" />
          </div>
          <p className="text-body-sm text-on-surface">{president.userName}</p>
        </div>

        <div className="rounded border border-outline-variant bg-background p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label-caps text-on-surface-variant">Member Since</span>
            <MaterialIcon name="calendar_today" className="text-sm text-on-surface-variant" />
          </div>
          <p className="font-data-mono text-data-mono text-on-surface">
            {formatMemberSince(president.createdDate)}
          </p>
        </div>

        <div className="flex flex-col justify-center rounded border border-outline-variant bg-background p-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded border border-outline-variant bg-surface-variant py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container-highest"
          >
            <MaterialIcon name="edit" className="text-sm" />
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  );
};
