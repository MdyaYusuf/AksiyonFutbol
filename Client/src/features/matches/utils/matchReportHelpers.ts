import { MatchEventType, type MatchEvent, type MatchResponse } from "../matchTypes";
import { parseApiDate } from "../../../core/utils/dateTime";
import type { NavigateFunction } from "react-router-dom";

interface RawMatchEvent {
  minute?: number;
  Minute?: number;
  type?: MatchEventType | string | number;
  Type?: MatchEventType | string | number;
  clubId?: string | null;
  ClubId?: string | null;
  playerId?: string | null;
  PlayerId?: string | null;
  description?: string;
  Description?: string;
  expectedGoals?: number | null;
  ExpectedGoals?: number | null;
  isBigChance?: boolean | null;
  IsBigChance?: boolean | null;
}

/** Sentinel for unrecognized legacy/future event labels — UI falls through to "Event". */
const UNKNOWN_EVENT_TYPE = 999 as MatchEventType;

const KNOWN_EVENT_TYPE_VALUES = new Set<number>(
  Object.values(MatchEventType).filter((value): value is MatchEventType => typeof value === "number"),
);

const eventTypeNameMap: Record<string, MatchEventType> = {
  KickOff: MatchEventType.KickOff,
  Goal: MatchEventType.Goal,
  YellowCard: MatchEventType.YellowCard,
  RedCard: MatchEventType.RedCard,
  Injury: MatchEventType.Injury,
  HalfTime: MatchEventType.HalfTime,
  FullTime: MatchEventType.FullTime,
  Possession: MatchEventType.Possession,
  BuildUp: MatchEventType.BuildUp,
  AttackLeft: MatchEventType.AttackLeft,
  AttackCenter: MatchEventType.AttackCenter,
  AttackRight: MatchEventType.AttackRight,
  Cross: MatchEventType.Cross,
  ThroughBall: MatchEventType.ThroughBall,
  Shot: MatchEventType.Shot,
  Save: MatchEventType.Save,
  Block: MatchEventType.Block,
  Miss: MatchEventType.Miss,
  Corner: MatchEventType.Corner,
  FreeKick: MatchEventType.FreeKick,
  Tackle: MatchEventType.Tackle,
  Interception: MatchEventType.Interception,
  Clearance: MatchEventType.Clearance,
  LooseBall: MatchEventType.LooseBall,
  Foul: MatchEventType.Foul,
  ThrowIn: MatchEventType.ThrowIn,
  GoalKick: MatchEventType.GoalKick,
  OutOfPlay: MatchEventType.GoalKick,
  "1": MatchEventType.KickOff,
  "2": MatchEventType.Goal,
  "3": MatchEventType.YellowCard,
  "4": MatchEventType.RedCard,
  "5": MatchEventType.Injury,
  "6": MatchEventType.HalfTime,
  "7": MatchEventType.FullTime,
  "8": MatchEventType.Possession,
  "9": MatchEventType.BuildUp,
  "10": MatchEventType.AttackLeft,
  "11": MatchEventType.AttackCenter,
  "12": MatchEventType.AttackRight,
  "13": MatchEventType.Cross,
  "14": MatchEventType.ThroughBall,
  "15": MatchEventType.Shot,
  "16": MatchEventType.Save,
  "17": MatchEventType.Block,
  "18": MatchEventType.Miss,
  "19": MatchEventType.Corner,
  "20": MatchEventType.FreeKick,
  "21": MatchEventType.Tackle,
  "22": MatchEventType.Interception,
  "23": MatchEventType.Clearance,
  "24": MatchEventType.LooseBall,
  "25": MatchEventType.Foul,
  "26": MatchEventType.ThrowIn,
  "27": MatchEventType.GoalKick,
};

export const isKnownMatchEventType = (value: number): value is MatchEventType => {
  return KNOWN_EVENT_TYPE_VALUES.has(value);
};

const resolveMatchEventType = (
  typeValue: MatchEventType | string | number | undefined,
): MatchEventType => {
  if (typeof typeValue === "number") {
    return isKnownMatchEventType(typeValue) ? typeValue : (typeValue as MatchEventType);
  }

  if (typeof typeValue === "string" && typeValue.length > 0) {
    return eventTypeNameMap[typeValue] ?? UNKNOWN_EVENT_TYPE;
  }

  return UNKNOWN_EVENT_TYPE;
};

export const parseMatchEvents = (matchLogJson?: string | null): MatchEvent[] => {
  if (!matchLogJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(matchLogJson) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    type OrderedMatchEvent = MatchEvent & { _order: number };

    const orderedEvents: OrderedMatchEvent[] = [];

    parsed.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return;
      }

      const event = entry as RawMatchEvent;
      const typeValue = event.type ?? event.Type;

      orderedEvents.push({
        minute: event.minute ?? event.Minute ?? 0,
        type: resolveMatchEventType(typeValue),
        clubId: event.clubId ?? event.ClubId ?? null,
        playerId: event.playerId ?? event.PlayerId ?? null,
        description: event.description ?? event.Description ?? "",
        expectedGoals: event.expectedGoals ?? event.ExpectedGoals ?? null,
        isBigChance: event.isBigChance ?? event.IsBigChance ?? null,
        _order: index,
      });
    });

    return orderedEvents
      .sort((left, right) => {
        if (left.minute !== right.minute) {
          return left.minute - right.minute;
        }

        return left._order - right._order;
      })
      .map(({ _order: _ignored, ...event }) => event);
  } catch {
    return [];
  }
};

export const formatMatchReportDateTime = (matchDate: string): string => {
  const date = parseApiDate(matchDate);

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} • ${timePart}`;
};

export const getMatchStatusLabel = (match: MatchResponse): string => {
  if (match.isPlayed) {
    return "Full Time";
  }

  return "Scheduled";
};

export const getEventTitle = (event: MatchEvent): string => {
  switch (event.type) {
    case MatchEventType.KickOff:
      return "Kickoff";
    case MatchEventType.Goal:
      return "Goal";
    case MatchEventType.YellowCard:
      return "Yellow Card";
    case MatchEventType.RedCard:
      return "Red Card";
    case MatchEventType.Injury:
      return "Injury";
    case MatchEventType.HalfTime:
      return "Half Time";
    case MatchEventType.FullTime:
      return "Full Time";
    case MatchEventType.Possession:
      return "Possession";
    case MatchEventType.BuildUp:
      return "Build-up";
    case MatchEventType.AttackLeft:
      return "Attack Left";
    case MatchEventType.AttackCenter:
      return "Attack Center";
    case MatchEventType.AttackRight:
      return "Attack Right";
    case MatchEventType.Cross:
      return "Cross";
    case MatchEventType.ThroughBall:
      return "Through Ball";
    case MatchEventType.Shot:
      return event.isBigChance ? "Big Chance" : "Shot";
    case MatchEventType.Save:
      return "Save";
    case MatchEventType.Block:
      return "Block";
    case MatchEventType.Miss:
      return "Miss";
    case MatchEventType.GoalKick:
      return "Goal Kick";
    case MatchEventType.Corner:
      return "Corner";
    case MatchEventType.FreeKick:
      return "Free Kick";
    case MatchEventType.Tackle:
      return "Tackle";
    case MatchEventType.Interception:
      return "Interception";
    case MatchEventType.Clearance:
      return "Clearance";
    case MatchEventType.LooseBall:
      return "Loose Ball";
    case MatchEventType.Foul:
      return "Foul";
    case MatchEventType.ThrowIn:
      return "Throw-in";
    default:
      return "Event";
  }
};

export const getEventIcon = (event: MatchEvent): string => {
  switch (event.type) {
    case MatchEventType.KickOff:
      return "timer";
    case MatchEventType.Goal:
      return "sports_soccer";
    case MatchEventType.YellowCard:
    case MatchEventType.RedCard:
      return "style";
    case MatchEventType.Injury:
      return "local_hospital";
    case MatchEventType.HalfTime:
      return "timer_pause";
    case MatchEventType.FullTime:
      return "sports_score";
    case MatchEventType.Possession:
    case MatchEventType.BuildUp:
      return "sync_alt";
    case MatchEventType.AttackLeft:
    case MatchEventType.AttackCenter:
    case MatchEventType.AttackRight:
      return "trending_flat";
    case MatchEventType.Cross:
    case MatchEventType.ThroughBall:
      return "swap_calls";
    case MatchEventType.Shot:
      return "sports_soccer";
    case MatchEventType.Save:
      return "pan_tool";
    case MatchEventType.Block:
      return "front_hand";
    case MatchEventType.Miss:
      return "close";
    case MatchEventType.GoalKick:
      return "sports_soccer";
    case MatchEventType.Corner:
      return "flag";
    case MatchEventType.FreeKick:
      return "sports";
    case MatchEventType.Tackle:
      return "front_hand";
    case MatchEventType.Interception:
      return "pan_tool";
    case MatchEventType.Clearance:
      return "north";
    case MatchEventType.LooseBall:
      return "blur_on";
    case MatchEventType.Foul:
      return "report";
    case MatchEventType.ThrowIn:
      return "redo";
    default:
      return "circle";
  }
};

export const isDividerEvent = (event: MatchEvent): boolean => {
  return (
    event.type === MatchEventType.HalfTime || event.type === MatchEventType.FullTime
  );
};

export const extractPlayerNameFromDescription = (description: string): string | null => {
  const goalMatch = description.match(/Gol:\s*(.+?)\.?$/i);
  if (goalMatch?.[1]) {
    return goalMatch[1].trim();
  }

  const scoresMatch = description.match(/scores for .+ through (.+?)(?:\s*\(|\.|$)/i);
  if (scoresMatch?.[1]) {
    return scoresMatch[1].trim();
  }

  return null;
};

/** Uses browser history when available; otherwise navigates to fallback (e.g. cold load / refresh). */
export const goBackOrFallback = (
  navigate: NavigateFunction,
  fallbackPath: string,
): void => {
  const historyIndex = (window.history.state as { idx?: number } | null)?.idx;

  if (typeof historyIndex === "number" && historyIndex > 0) {
    navigate(-1);
    return;
  }

  navigate(fallbackPath);
};
