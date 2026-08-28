interface FictionalDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const FictionalDisclaimer = ({
  compact = false,
  className = "",
}: FictionalDisclaimerProps) => {
  if (compact) {
    return (
      <p className={`text-body-sm text-on-surface-variant ${className}`.trim()}>
        AksiyonFutbol is fictional satire. Clubs, leagues, and people are invented for gameplay.
      </p>
    );
  }

  return (
    <div
      className={[
        "rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3 text-body-sm text-on-surface-variant",
        className,
      ].join(" ")}
    >
      <p className="font-semibold text-on-surface">Fictional game world</p>
      <p className="mt-1">
        AksiyonFutbol is a made-up football management satire. It does not depict real clubs,
        leagues, federations, players, or officials. Any resemblance is coincidental. In-game
        scandals, bribery, and press stories are gameplay fiction only.
      </p>
    </div>
  );
};
