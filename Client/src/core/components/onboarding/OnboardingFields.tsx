import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

interface OnboardingTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  error?: string;
}

export const OnboardingTextField = ({
  label,
  icon,
  error,
  id,
  className = "",
  ...inputProps
}: OnboardingTextFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label-caps text-on-surface">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <MaterialIcon
            name={icon}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
          />
        )}
        <input
          id={id}
          className={[
            "w-full rounded border border-outline-variant bg-surface-container-low py-3 text-body-lg text-on-surface transition-all outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary",
            icon ? "pl-10 pr-4" : "px-4",
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

interface OnboardingSelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const OnboardingSelectField = ({
  label,
  error,
  id,
  className = "",
  children,
  ...selectProps
}: OnboardingSelectFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label-caps text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={[
            "w-full cursor-pointer appearance-none rounded border border-outline-variant bg-surface-container-low px-4 py-3 text-body-lg text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary",
            error ? "border-error" : "",
            className,
          ].join(" ")}
          {...selectProps}
        >
          {children}
        </select>
        <MaterialIcon
          name="expand_more"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-variant"
        />
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
};
