import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { MatchEventType, type MatchEvent, type MatchResponse } from "../matchTypes";
import {
  extractPlayerNameFromDescription,
  getEventIcon,
  getEventTitle,
  isDividerEvent,
} from "../utils/matchReportHelpers";

interface MatchTimelineProps {
  match: MatchResponse;
  events: MatchEvent[];
}

export const MatchTimeline = ({ match, events }: MatchTimelineProps) => {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container p-6 lg:col-span-8">
      <div className="mb-8 flex items-center justify-between border-b border-outline-variant pb-4">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="timeline" className="text-primary" />
          Match Timeline
        </h3>
        <div className="rounded border border-outline-variant bg-surface-variant px-3 py-1 text-label-caps text-on-surface-variant">
          Log view
        </div>
      </div>

      {events.length === 0 ? (
        <p className="py-10 text-center text-body-sm text-on-surface-variant">
          {match.isPlayed
            ? "No match events were recorded."
            : "This match has not been played yet."}
        </p>
      ) : (
        <div className="relative space-y-8 pl-8 before:absolute before:inset-0 before:ml-[1.15rem] before:h-full before:w-[2px] before:-translate-x-px before:bg-surface-variant md:pl-16 md:before:ml-[3.15rem] md:before:translate-x-0">
          {events.map((event, index) => (
            <TimelineEventItem
              key={`${event.type}-${event.minute}-${index}`}
              event={event}
              match={match}
            />
          ))}
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
      <div className={`relative flex items-center group ${isFullTime ? "mt-8" : ""}`}>
        <div className="absolute left-[-2.5rem] w-8 bg-surface-container py-1 text-right font-data-mono text-data-mono text-on-surface-variant md:left-[-4.5rem]">
          {event.minute}&apos;
        </div>
        <div className="absolute left-[-1.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-outline-variant bg-surface-container">
          <MaterialIcon
            name={getEventIcon(event)}
            className="text-[12px] text-on-surface-variant"
          />
        </div>
        <div
          className={`relative my-4 ml-6 flex-1 border-t ${isFullTime ? "border-solid" : "border-dashed"} border-outline-variant`}
        >
          <div
            className={[
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container px-4 text-label-caps tracking-widest text-on-surface-variant uppercase",
              isFullTime
                ? "rounded border border-outline-variant py-1 text-on-surface shadow-sm"
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
          "absolute left-[-2.5rem] w-8 bg-surface-container py-1 text-right font-data-mono text-data-mono md:left-[-4.5rem]",
          isGoal ? "font-bold text-primary" : "text-on-surface-variant",
        ].join(" ")}
      >
        {event.minute}&apos;
      </div>
      <div
        className={[
          "absolute left-[-1.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-surface-container transition-colors group-hover:border-primary",
          accentClassName,
          isGoal ? "bg-surface shadow-[0_0_8px_rgba(34,197,94,0.3)]" : "",
        ].join(" ")}
      >
        <MaterialIcon
          name={getEventIcon(event)}
          className={`text-[14px] ${isGoal ? "text-primary" : isYellow ? "text-secondary" : isRed || isInjury ? "text-error" : "text-on-surface-variant"}`}
          filled={isGoal || isYellow || isRed}
        />
      </div>
      <div
        className={[
          "ml-6 flex flex-1 items-center gap-3 rounded border border-outline-variant p-3 transition-colors hover:bg-surface-variant",
          isGoal ? "bg-surface-bright" : "bg-surface-container-high",
        ].join(" ")}
      >
        {(isGoal || isYellow || isRed || isInjury) && (
          <div className={`h-8 w-1 rounded-full ${barClassName}`} />
        )}
        <div className="flex flex-col">
          <span
            className={[
              "flex items-center gap-2 text-body-lg",
              isGoal ? "font-semibold text-on-surface" : "text-on-surface",
            ].join(" ")}
          >
            {getEventTitle(event)}
            {clubName && (
              <span className="text-body-sm font-normal text-on-surface-variant">
                ({clubName})
              </span>
            )}
          </span>
          {playerName ? (
            <span
              className={`text-body-sm ${isGoal ? "text-primary" : isYellow ? "text-secondary" : "text-on-surface-variant"}`}
            >
              {playerName}
            </span>
          ) : (
            <span className="text-body-sm text-on-surface-variant">{event.description}</span>
          )}
        </div>
      </div>
    </div>
  );
};
