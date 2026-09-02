import { cashAccent } from "@/core/utils/cashPresentation";

interface CashAmountProps {
  amount: number;
  className?: string;
  digitsClassName?: string;
  freeLabel?: string;
  compact?: boolean;
  greenSignOnly?: boolean;
  neutral?: boolean;
}

const formatCashNumeric = (amount: number, compact: boolean): string => {
  const rounded = Math.round(amount);

  if (!compact) {
    return rounded.toLocaleString("en-US");
  }

  if (rounded >= 1_000_000) {
    return `${(rounded / 1_000_000).toFixed(1)}M`;
  }

  if (rounded >= 1_000) {
    return `${(rounded / 1_000).toFixed(1)}K`;
  }

  return rounded.toLocaleString("en-US");
};

export const CashAmount = ({
  amount,
  className = "",
  digitsClassName = "text-on-surface",
  freeLabel = "Free",
  compact = false,
  greenSignOnly = false,
  neutral = false,
}: CashAmountProps) => {
  if (amount <= 0) {
    return <span className={className || "text-on-surface"}>{freeLabel}</span>;
  }

  const numeric = formatCashNumeric(amount, compact);

  if (neutral) {
    return (
      <span className={["inline-flex items-baseline text-on-surface", className].join(" ")}>
        <span className="text-[1.25em] leading-none">$</span>
        <span className={digitsClassName}>{numeric}</span>
      </span>
    );
  }

  if (greenSignOnly) {
    return (
      <span className={["inline-flex items-baseline", className].join(" ")}>
        <span className={["text-[1.25em] leading-none", cashAccent.text].join(" ")}>$</span>
        <span className={digitsClassName}>{numeric}</span>
      </span>
    );
  }

  return (
    <span className={["inline-flex items-baseline", cashAccent.text, className].join(" ")}>
      <span className="text-[1.25em] leading-none">$</span>
      <span>{numeric}</span>
    </span>
  );
};
