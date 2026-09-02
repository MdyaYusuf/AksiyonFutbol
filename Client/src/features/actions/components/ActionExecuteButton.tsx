import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const actionExecuteButtonActiveClassName = [
  "inline-flex items-center justify-center gap-2 rounded-full border border-primary-fixed/50",
  "bg-gradient-to-r from-primary-container via-primary to-primary-fixed",
  "px-8 py-2 font-label-caps text-label-caps text-on-primary",
  "shadow-[0_4px_16px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]",
  "transition-all duration-200",
  "hover:-translate-y-0.5 hover:brightness-110",
  "hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--color-primary)_55%,transparent)]",
  "active:translate-y-0 active:brightness-100",
].join(" ");

const actionExecuteButtonDisabledClassName = [
  actionExecuteButtonActiveClassName,
  "cursor-not-allowed opacity-40",
  "hover:translate-y-0 hover:brightness-100",
  "hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]",
].join(" ");

const actionExecuteButtonUnavailableClassName = [
  "inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant",
  "bg-[#334155] px-8 py-2 font-label-caps text-label-caps text-on-surface-variant opacity-60",
  "pointer-events-none",
].join(" ");

interface ActionExecuteButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  unavailable?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  to?: string;
}

export const ActionExecuteButton = ({
  children,
  className = "",
  disabled = false,
  unavailable = false,
  onClick,
  type = "button",
  to,
}: ActionExecuteButtonProps) => {
  let classNames = actionExecuteButtonActiveClassName;

  if (unavailable) {
    classNames = actionExecuteButtonUnavailableClassName;
  } else if (disabled) {
    classNames = actionExecuteButtonDisabledClassName;
  }

  classNames = [classNames, className].join(" ");

  if (to && !unavailable && !disabled) {
    return (
      <Link to={to} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || unavailable}
      onClick={onClick}
      className={classNames}
    >
      {children}
    </button>
  );
};

export const actionExecuteButtonClassName = actionExecuteButtonActiveClassName;
