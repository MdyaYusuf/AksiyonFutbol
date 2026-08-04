import { useEffect, useRef } from "react";
import type { MatchEvent } from "../matchTypes";
import { getEventTitle } from "../utils/matchReportHelpers";

interface MatchLiveCommentaryProps {
  events: MatchEvent[];
}

export const MatchLiveCommentary = ({ events }: MatchLiveCommentaryProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [events.length]);

  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-lg border border-outline-variant bg-surface-container">
      <div className="border-b border-outline-variant px-4 py-3">
        <h3 className="text-headline-sm text-on-surface">Commentary</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {events.length === 0 ? (
          <p className="py-8 text-center text-body-sm text-on-surface-variant">
            Waiting for the first events…
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={`${event.type}-${event.minute}-${index}`}
              className="rounded border border-outline-variant bg-surface-container-high px-3 py-2"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-label-caps text-on-surface-variant">
                  {getEventTitle(event)}
                </span>
                <span className="font-data-mono text-data-mono text-on-surface-variant">
                  {event.minute}&apos;
                </span>
              </div>
              <p className="text-body-sm text-on-surface">{event.description}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
