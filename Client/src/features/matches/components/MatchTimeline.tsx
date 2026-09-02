import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { MatchEventType, type MatchEvent, type MatchResponse } from "@/features/matches/matchTypes";
import {
  extractPlayerNameFromDescription,
  getEventIcon,
  getEventTitle,
  isDividerEvent,
} from "@/features/matches/utils/matchReportHelpers";

interface MatchTimelineProps {
  match: MatchResponse;
  events: MatchEvent[];
}

export const MatchTimeline = ({ match, events }: MatchTimelineProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border border-outline-variant bg-surface-container p-3 lg:col-span-7">
      <div className="mb-2 flex shrink-0 items-center justify-between border-b border-outline-variant pb-2">
        <h3 className="flex items-center gap-2 text-label-caps text-on-surface-variant">
          <MaterialIcon name="timeline" className="text-sm text-primary" />
          Match Timeline
        </h3>
        <div className="rounded border border-outline-variant bg-surface-variant px-2 py-0.5 text-label-caps text-on-surface-variant">
          Log view
        </div>
      </div>

      {events.length === 0 ? (
        <p className="flex flex-1 items-center justify-center py-6 text-center text-body-sm text-on-surface-variant">
          {match.isPlayed
            ? "No match events were recorded."
            : "This match has not been played yet."}
        </p>
      ) : (
        <div className="scrollbar-theme min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="relative space-y-4 pl-8 before:absolute before:inset-0 before:ml-[1.15rem] before:h-full before:w-[2px] before:-translate-x-px before:bg-surface-variant md:pl-14 md:before:ml-[2.65rem] md:before:translate-x-0">
            {events.map((event, index) => (
              <TimelineEventItem
                key={`${event.type}-${event.minute}-${index}`}
                event={event}
                match={match}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineEventItem = ({
  event,
  match,
}: {
  event: MatchEvent;
  match: MatchResponse;
}) => {
  if (isDividerEvent(event)) {
    const isFullTime = event.type === MatchEventType.FullTime;

    return (
      <div className={`relative flex items-center group ${isFullTime ? "mt-4" : ""}`}>
        <div className="absolute left-[-2.5rem] w-8 bg-surface-container py-0.5 text-right font-data-mono text-data-mono text-on-surface-variant md:left-[-3.75rem]">
          {event.minute}&apos;
        </div>
        <div className="absolute left-[-1.5rem] z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-outline-variant bg-surface-container">
          <MaterialIcon
            name={getEventIcon(event)}
            className="text-[11px] text-on-surface-variant"
          />
        </div>
        <div
          className={`relative my-2 ml-5 flex-1 border-t ${isFullTime ? "border-solid" : "border-dashed"} border-outline-variant`}
        >
          <div
            className={[
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container px-3 text-label-caps tracking-widest text-on-surface-variant uppercase",
              isFullTime
                ? "rounded border border-outline-variant py-0.5 text-on-surface"
                : "",
            ].join(" ")}
          >
            {getEventTitle(event)}
          </div>
        </div>
      </div>
    );
  }

  const isGoal = event.type === MatchEventType.Goal;
  const isYellow = event.type === MatchEventType.YellowCard;
  const isRed = event.type === MatchEventType.RedCard;
  const isInjury = event.type === MatchEventType.Injury;
  const isHomeEvent = event.clubId === match.homeClubId;
  const clubName = isHomeEvent
    ? match.homeClubName
    : event.clubId === match.awayClubId
      ? match.awayClubName
      : null;
  const playerName = extractPlayerNameFromDescription(event.description);

  const accentClassName = isGoal
    ? "border-primary text-primary"
    : isYellow
      ? "border-secondary text-secondary"
      : isRed || isInjury
        ? "border-error text-error"
        : "border-outline-variant text-on-surface-variant";

  const barClassName = isGoal
    ? "bg-primary"
    : isYellow
      ? "bg-secondary"
      : isRed || isInjury
        ? "bg-error"
        : "bg-outline-variant";

  return (
    <div className="group relative flex items-center">
      <div
        className={[
          "absolute left-[-2.5rem] w-8 bg-surface-container py-0.5 text-right font-data-mono text-data-mono md:left-[-3.75rem]",
          isGoal ? "font-bold text-primary" : "text-on-surface-variant",
        ].join(" ")}
      >
        {event.minute}&apos;
      </div>
      <div
        className={[
          "absolute left-[-1.5rem] z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-surface-container transition-colors group-hover:border-primary",
          accentClassName,
          isGoal ? "bg-surface shadow-[0_0_8px_rgba(34,197,94,0.3)]" : "",
        ].join(" ")}
      >
        <MaterialIcon
          name={getEventIcon(event)}
          className={`text-[12px] ${isGoal ? "text-primary" : isYellow ? "text-secondary" : isRed || isInjury ? "text-error" : "text-on-surface-variant"}`}
          filled={isGoal || isYellow || isRed}
        />
      </div>
      <div
        className={[
          "ml-5 flex flex-1 items-center gap-2 rounded border border-outline-variant px-2.5 py-1.5 transition-colors hover:bg-surface-variant",
          isGoal ? "bg-surface-bright" : "bg-surface-container-high",
        ].join(" ")}
      >
        {(isGoal || isYellow || isRed || isInjury) && (
          <div className={`h-6 w-1 rounded-full ${barClassName}`} />
        )}
        <div className="flex min-w-0 flex-col">
          <span
            className={[
              "flex items-center gap-2 text-body-sm",
              isGoal ? "font-semibold text-on-surface" : "text-on-surface",
            ].join(" ")}
          >
            {getEventTitle(event)}
            {clubName ? (
              <span className="truncate text-label-caps font-normal text-on-surface-variant">
                ({clubName})
              </span>
            ) : null}
          </span>
          {playerName ? (
            <span
              className={`text-body-sm ${isGoal ? "text-primary" : isYellow ? "text-secondary" : "text-on-surface-variant"}`}
            >
              {playerName}
            </span>
          ) : (
            <span className="line-clamp-2 text-body-sm text-on-surface-variant">
              {event.description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
