import type { InputHTMLAttributes, ReactNode } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  error?: string;
}

export const AuthTextField = ({
  label,
  icon,
  error,
  id,
  className = "",
  ...inputProps
}: AuthTextFieldProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-label-caps text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <MaterialIcon
          name={icon}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant"
        />
        <input
          id={id}
          className={[
            "w-full rounded border border-outline-variant bg-background py-2.5 pr-4 pl-10 text-body-sm text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary",
            error ? "border-error" : "",
            className,
          ].join(" ")}
          {...inputProps}
        />
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
};

interface AuthPageShellProps {
  children: ReactNode;
}

export const AuthPageShell = ({ children }: AuthPageShellProps) => {
  return (
    <div className="relative flex flex-grow items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-primary mix-blend-screen blur-[100px] filter" />
        <div
          className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-secondary mix-blend-screen blur-[120px] filter"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <div className="z-10 w-full max-w-md">{children}</div>
    </div>
  );
};
