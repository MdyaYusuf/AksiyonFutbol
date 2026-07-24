import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface AdminSeasonEndPreflightProps {
  fixtures: { ok: boolean; label: string };
  dataSync: { ok: boolean; label: string };
  backup: { ok: boolean; label: string };
}

export const AdminSeasonEndPreflight = ({
  fixtures,
  dataSync,
  backup,
}: AdminSeasonEndPreflightProps) => {
  const checks = [
    { key: "fixtures", title: "Fixtures", ...fixtures },
    { key: "dataSync", title: "Data Sync", ...dataSync },
    { key: "backup", title: "Backup", ...backup },
  ];

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container p-6">
      <h3 className="mb-4 border-b border-outline-variant pb-2 font-headline-sm text-headline-sm text-on-surface">
        Pre-Flight Checks
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {checks.map((check) => (
          <div
            key={check.key}
            className="flex items-center gap-3 rounded border border-outline-variant bg-surface-container-low p-3"
          >
            <MaterialIcon
              name={check.ok ? "check_circle" : "warning"}
              className={check.ok ? "text-primary" : "text-secondary"}
            />
            <div>
              <div className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                {check.title}
              </div>
              <div
                className={`font-data-mono text-data-mono ${
                  check.ok ? "text-on-surface" : "text-secondary"
                }`}
              >
                {check.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
