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
}

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
};

export const parseMatchEvents = (matchLogJson?: string | null): MatchEvent[] => {
  if (!matchLogJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(matchLogJson) as RawMatchEvent[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((event) => {
        const typeValue = event.type ?? event.Type;
        const type: MatchEventType =
          typeof typeValue === "number"
            ? (typeValue as MatchEventType)
            : eventTypeNameMap[String(typeValue)] ?? MatchEventType.KickOff;

        return {
          minute: event.minute ?? event.Minute ?? 0,
          type,
          clubId: event.clubId ?? event.ClubId ?? null,
          playerId: event.playerId ?? event.PlayerId ?? null,
          description: event.description ?? event.Description ?? "",
        };
      })
      .sort((left, right) => left.minute - right.minute);
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
      return "Shot";
    case MatchEventType.Save:
      return "Save";
    case MatchEventType.Block:
      return "Block";
    case MatchEventType.Miss:
      return "Miss";
    case MatchEventType.Corner:
      return "Corner";
    case MatchEventType.FreeKick:
      return "Free Kick";
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
    case MatchEventType.Corner:
      return "flag";
    case MatchEventType.FreeKick:
      return "sports";
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

export interface MatchSideStats {
  goals: number;
  yellowCards: number;
  redCards: number;
  injuries: number;
}

export const buildMatchSideStats = (
  match: MatchResponse,
  events: MatchEvent[],
): { home: MatchSideStats; away: MatchSideStats } => {
  const home: MatchSideStats = {
    goals: match.homeScore ?? 0,
    yellowCards: 0,
    redCards: 0,
    injuries: 0,
  };

  const away: MatchSideStats = {
    goals: match.awayScore ?? 0,
    yellowCards: 0,
    redCards: 0,
    injuries: 0,
  };

  for (const event of events) {
    if (!event.clubId) {
      continue;
    }

    const side = event.clubId === match.homeClubId ? home : away;

    if (event.clubId !== match.homeClubId && event.clubId !== match.awayClubId) {
      continue;
    }

    if (event.type === MatchEventType.YellowCard) {
      side.yellowCards += 1;
    }

    if (event.type === MatchEventType.RedCard) {
      side.redCards += 1;
    }

    if (event.type === MatchEventType.Injury) {
      side.injuries += 1;
    }
  }

  return { home, away };
};

export const getDominanceBarWidth = (homeValue: number, awayValue: number): number => {
  const total = homeValue + awayValue;

  if (total <= 0) {
    return 50;
  }

  return Math.round((homeValue / total) * 100);
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
