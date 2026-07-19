import { MatchEventType, type MatchEvent, type MatchResponse } from "../matchTypes";

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
  "1": MatchEventType.KickOff,
  "2": MatchEventType.Goal,
  "3": MatchEventType.YellowCard,
  "4": MatchEventType.RedCard,
  "5": MatchEventType.Injury,
  "6": MatchEventType.HalfTime,
  "7": MatchEventType.FullTime,
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
  const date = new Date(matchDate);

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
