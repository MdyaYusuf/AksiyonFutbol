import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface LegalDocumentHeaderProps {
  title: string;
  lastUpdated: string;
  showCalendarIcon?: boolean;
}

export const LegalDocumentHeader = ({
  title,
  lastUpdated,
  showCalendarIcon = false,
}: LegalDocumentHeaderProps) => {
  return (
    <header className="mb-12 border-b border-outline-variant pb-8">
      <h1 className="mb-2 text-display-lg font-extrabold tracking-tight text-on-surface">
        {title}
      </h1>
      <p className="flex items-center gap-2 text-body-sm text-on-surface-variant">
        {showCalendarIcon ? (
          <MaterialIcon name="calendar_today" className="text-[16px]" />
        ) : null}
        Last Updated: {lastUpdated}
      </p>
    </header>
  );
};
