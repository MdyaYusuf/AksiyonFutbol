import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getNationalityFlagSrc } from "@/core/utils/nationalityFlags";
import type { PlayerInstanceResponse } from "@/features/playerInstances/playerInstanceTypes";
import {
  getPlayerDisplayName,
} from "@/features/playerInstances/utils/squadHelpers";
import { PlayerAttributeProfile } from "@/features/playerInstances/components/PlayerAttributeProfile";

interface PlayerAttributePopoverProps {
  player?: PlayerInstanceResponse;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

const HOVER_OPEN_MS = 280;
const HOVER_CLOSE_MS = 140;
const POPOVER_WIDTH = 520;
const POPOVER_ESTIMATED_HEIGHT = 280;

const isCoarsePointer = (): boolean => {
  return window.matchMedia("(pointer: coarse)").matches;
};

const getPopoverStyle = (anchor: DOMRect): React.CSSProperties => {
  const gap = 10;
  let left = anchor.right + gap;
  if (left + POPOVER_WIDTH > window.innerWidth - 8) {
    left = anchor.left - POPOVER_WIDTH - gap;
  }

  if (left < 8) {
    left = Math.max(8, window.innerWidth - POPOVER_WIDTH - 8);
  }

  let top = anchor.top;
  if (top + POPOVER_ESTIMATED_HEIGHT > window.innerHeight - 8) {
    top = Math.max(8, window.innerHeight - POPOVER_ESTIMATED_HEIGHT - 8);
  }

  return {
    top,
    left,
    width: POPOVER_WIDTH,
  };
};

export const PlayerAttributePopover = ({
  player,
  disabled = false,
  className,
  children,
}: PlayerAttributePopoverProps) => {
  const labelId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lastPointerTypeRef = useRef<string>("");
  const pinnedRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

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
    if (disabled || !player) {
      closePopover();
    }
  }, [closePopover, disabled, player]);

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

  if (!player) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseEnter = () => {
    if (disabled || pinnedRef.current || isCoarsePointer()) {
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
    if (disabled || pinnedRef.current) {
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
    if (disabled) {
      return;
    }

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

  const displayName = getPlayerDisplayName(player.firstName, player.lastName);
  const flagSrc = getNationalityFlagSrc(player.nationality);
  const nationalityLabel = player.nationality?.trim() || "Unknown";

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      onDragStart={closePopover}
    >
      {children}
      {isOpen && anchor
        ? createPortal(
            <div
              ref={panelRef}
              role="tooltip"
              id={labelId}
              aria-label={`${displayName} attributes`}
              className="fixed z-40 rounded-lg border border-outline-variant bg-surface-container shadow-lg"
              style={getPopoverStyle(anchor)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between gap-2 border-b border-outline-variant px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  {flagSrc ? (
                    <img
                      src={flagSrc}
                      alt={nationalityLabel}
                      title={nationalityLabel}
                      width={33}
                      height={20}
                      className="h-5 w-[33px] shrink-0 object-contain"
                    />
                  ) : (
                    <span
                      title={nationalityLabel}
                      className="inline-block h-5 w-[33px] shrink-0 rounded-sm bg-surface-container-highest"
                    />
                  )}
                  <span className="truncate font-body-sm font-semibold text-on-surface">
                    {displayName}
                  </span>
                </div>
                <span className="shrink-0 font-data-mono text-[11px] text-on-surface-variant">
                  Overall · {player.overallRating}
                </span>
              </div>
              <div className="p-3">
                <PlayerAttributeProfile
                  position={player.position}
                  attributes={player.attributes}
                  attackPower={player.attackPower}
                  defenseStrength={player.defenseStrength}
                  midfieldControl={player.midfieldControl}
                  compact
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
