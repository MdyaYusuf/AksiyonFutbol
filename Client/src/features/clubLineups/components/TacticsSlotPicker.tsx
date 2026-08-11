import { useEffect, useRef } from "react";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import {
  getPositionBadgeClassName,
  getPositionLabel,
} from "../../playerInstances/utils/squadHelpers";
import type { SlotCandidate, SlotCandidateSource } from "../utils/tacticsHelpers";

interface TacticsSlotPickerProps {
  anchor: DOMRect;
  slotLabel: string;
  occupant?: PlayerInstanceResponse;
  candidates: SlotCandidate[];
  emptyMessage: string;
  allowInjured?: boolean;
  onPick: (playerId: string) => void;
  onClose: () => void;
}

const SOURCE_LABELS: Record<SlotCandidateSource, string> = {
  bench: "Bench",
  unused: "Available",
  starter: "On pitch",
};

export const TacticsSlotPicker = ({
  anchor,
  slotLabel,
  occupant,
  candidates,
  emptyMessage,
  allowInjured = false,
  onPick,
  onClose,
}: TacticsSlotPickerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const width = 260;
  const left = Math.max(
    8,
    Math.min(anchor.left, window.innerWidth - width - 8),
  );
  const spaceBelow = window.innerHeight - anchor.bottom - 12;
  const maxHeight = Math.min(320, Math.max(160, spaceBelow > 180 ? spaceBelow : anchor.top - 16));
  const showAbove = spaceBelow < 180 && anchor.top > spaceBelow;
  const top = showAbove
    ? Math.max(8, anchor.top - maxHeight - 8)
    : Math.min(anchor.bottom + 8, window.innerHeight - maxHeight - 8);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (panelRef.current?.contains(target)) {
        return;
      }

      if (
        target instanceof Element &&
        (target.closest("[data-tactics-slot]") ||
          target.closest("[data-tactics-bench-slot]"))
      ) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const sections: { source: SlotCandidateSource; items: SlotCandidate[] }[] = [
    { source: "bench", items: candidates.filter((item) => item.source === "bench") },
    { source: "unused", items: candidates.filter((item) => item.source === "unused") },
    { source: "starter", items: candidates.filter((item) => item.source === "starter") },
  ];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`${slotLabel} replacements`}
      className="fixed z-50 overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-lg"
      style={{ top, left, width, maxHeight }}
    >
      <div className="border-b border-outline-variant px-3 py-2">
        <div className="font-label-caps text-label-caps text-on-surface-variant">
          {slotLabel}
        </div>
        <div className="font-body-sm text-body-sm text-on-surface">
          {occupant
            ? `Replace ${occupant.firstName.charAt(0)}. ${occupant.lastName}`
            : "Pick a player"}
        </div>
      </div>

      <div className="max-h-[260px] overflow-y-auto p-2">
        {sections.map((section) =>
          section.items.length === 0 ? null : (
            <div key={section.source} className="mb-2 last:mb-0">
              <div className="mb-1 px-1 font-label-caps text-label-caps text-on-surface-variant">
                {SOURCE_LABELS[section.source]}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const disabled = item.player.isInjured && !allowInjured;

                  return (
                    <button
                      key={item.player.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) {
                          return;
                        }

                        onPick(item.player.id);
                      }}
                      className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`inline-flex h-6 w-8 shrink-0 items-center justify-center rounded text-label-caps ${getPositionBadgeClassName(item.player.position)}`}
                        >
                          {getPositionLabel(item.player.position)}
                        </span>
                        <span className="truncate font-body-sm text-body-sm text-on-surface">
                          {item.player.firstName.charAt(0)}. {item.player.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.player.isInjured ? (
                          <span className="rounded bg-error-container px-1.5 py-0.5 text-[10px] font-bold text-on-error-container">
                            INJ
                          </span>
                        ) : null}
                        <span className="font-data-mono text-[11px] text-primary">
                          {item.player.overallRating}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ),
        )}

        {candidates.length === 0 ? (
          <p className="px-1 py-4 text-center font-body-sm text-body-sm text-on-surface-variant">
            {emptyMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};
