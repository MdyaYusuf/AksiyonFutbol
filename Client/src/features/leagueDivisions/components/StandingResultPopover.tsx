import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  filterStandingResultsByOutcome,
  formatStandingResultScore,
  getFormBadgeClassName,
  getOutcomePopoverTheme,
  getVenueBadgeClassName,
  MATCH_WEEK_BADGE_CLASS_NAME,
  type FormResult,
  type StandingMatchResult,
} from "@/features/leagueDivisions/utils/standingsHelpers";

interface StandingResultPopoverProps {
  clubName: string;
  outcome: FormResult;
  results: StandingMatchResult[];
  className?: string;
  children: ReactNode;
}

const HOVER_OPEN_MS = 280;
const HOVER_CLOSE_MS = 140;
const POPOVER_WIDTH = 300;
const POPOVER_ESTIMATED_HEIGHT = 240;

const OUTCOME_LABELS: Record<FormResult, string> = {
  W: "Wins",
  D: "Draws",
  L: "Losses",
};

const isCoarsePointer = (): boolean => {
  return window.matchMedia("(pointer: coarse)").matches;
};

const getPopoverStyle = (anchor: DOMRect): React.CSSProperties => {
  const gap = 10;
  let left = anchor.left + anchor.width / 2 - POPOVER_WIDTH / 2;

  if (left + POPOVER_WIDTH > window.innerWidth - 8) {
    left = window.innerWidth - POPOVER_WIDTH - 8;
  }

  if (left < 8) {
    left = 8;
  }

  let top = anchor.bottom + gap;
  if (top + POPOVER_ESTIMATED_HEIGHT > window.innerHeight - 8) {
    top = Math.max(8, anchor.top - POPOVER_ESTIMATED_HEIGHT - gap);
  }

  return {
    top,
    left,
    width: POPOVER_WIDTH,
  };
};

export const StandingResultPopover = ({
  clubName,
  outcome,
  results,
  className,
  children,
}: StandingResultPopoverProps) => {
  const labelId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lastPointerTypeRef = useRef<string>("");
  const pinnedRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  const filteredResults = filterStandingResultsByOutcome(results, outcome);
  const outcomeLabel = OUTCOME_LABELS[outcome];
  const theme = getOutcomePopoverTheme(outcome);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closePopover = useCallback(() => {
    clearTimers();
    pinnedRef.current = false;
    setIsOpen(false);
  }, [clearTimers]);

  const openPopover = useCallback(
    (pinned: boolean) => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      clearTimers();
      pinnedRef.current = pinned;
      setAnchor(rect);
      setIsOpen(true);
    },
    [clearTimers],
  );

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopover();
      }
    };

    const handleViewportChange = () => {
      closePopover();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }

      closePopover();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [closePopover, isOpen]);

  const handleMouseEnter = () => {
    if (pinnedRef.current || isCoarsePointer()) {
      return;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    openTimerRef.current = window.setTimeout(() => {
      openPopover(false);
    }, HOVER_OPEN_MS);
  };

  const handleMouseLeave = () => {
    if (pinnedRef.current) {
      return;
    }

    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    closeTimerRef.current = window.setTimeout(() => {
      closePopover();
    }, HOVER_CLOSE_MS);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    lastPointerTypeRef.current = event.pointerType;
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    const isTouch =
      lastPointerTypeRef.current === "touch" || isCoarsePointer();
    if (!isTouch) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isOpen && pinnedRef.current) {
      closePopover();
      return;
    }

    openPopover(true);
  };

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
    >
      {children}
      {isOpen && anchor
        ? createPortal(
            <div
              ref={panelRef}
              role="tooltip"
              id={labelId}
              aria-label={`${clubName} ${outcomeLabel}`}
              className={`fixed z-40 overflow-hidden rounded-lg border bg-surface-container shadow-lg ${theme.panelBorder}`}
              style={getPopoverStyle(anchor)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`flex items-center justify-between gap-2 px-3 py-2.5 ${theme.header}`}
              >
                <div className="min-w-0">
                  <span className={`block truncate font-label-caps text-label-caps ${theme.headerTitle}`}>
                    {outcomeLabel}
                  </span>
                  <span className="block truncate font-body-sm text-body-sm text-on-surface-variant">
                    {clubName}
                  </span>
                </div>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${getFormBadgeClassName(outcome)}`}
                >
                  {outcome}
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto p-2">
                {filteredResults.length === 0 ? (
                  <p className="px-1 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">
                    No {outcomeLabel.toLowerCase()} yet.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {filteredResults.map((result) => (
                      <li
                        key={`${result.date}-${result.opponentName}-${result.matchWeek}`}
                        className={`flex items-center justify-between gap-2 rounded-md border border-outline-variant/40 bg-surface-container-low px-2 py-2 font-data-mono text-[11px] transition-colors ${theme.rowHover}`}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span
                            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold ${MATCH_WEEK_BADGE_CLASS_NAME}`}
                          >
                            MW{result.matchWeek}
                          </span>
                          <span
                            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${getVenueBadgeClassName(result.isHome)}`}
                          >
                            {result.isHome ? "Home" : "Away"}
                          </span>
                          <span className="truncate text-on-surface">
                            {result.opponentName}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 rounded border px-2 py-0.5 text-[11px] ${theme.scoreBadge}`}
                        >
                          {formatStandingResultScore(result)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
