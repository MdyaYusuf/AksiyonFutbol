import { parseApiDate } from "@/core/utils/dateTime";
import { MatchEventType, type MatchEvent } from "@/features/matches/matchTypes";

/** Matches GameOptions.MatchLiveReplayDurationSeconds default. */
export const MATCH_LIVE_REPLAY_DURATION_SECONDS = 180;

export type MatchPresentationPhase =
  | "upcoming"
  | "waitingSim"
  | "live"
  | "replay"
  | "result";

export interface MatchTimingInput {
  matchDate: string;
  isPlayed: boolean;
}

export const getMatchKickoff = (matchDate: string): Date => parseApiDate(matchDate);

export const getMatchLiveWindowEnd = (
  matchDate: string,
  liveDurationSeconds: number = MATCH_LIVE_REPLAY_DURATION_SECONDS,
): Date => {
  const kickoff = getMatchKickoff(matchDate);
  return new Date(kickoff.getTime() + liveDurationSeconds * 1000);
};

export const getMatchPresentationPhase = (
  match: MatchTimingInput,
  now: Date,
  liveDurationSeconds: number = MATCH_LIVE_REPLAY_DURATION_SECONDS,
): MatchPresentationPhase => {
  const kickoff = getMatchKickoff(match.matchDate);

  if (Number.isNaN(kickoff.getTime())) {
    return match.isPlayed ? "replay" : "upcoming";
  }

  if (now.getTime() < kickoff.getTime()) {
    return "upcoming";
  }

  if (!match.isPlayed) {
    return "waitingSim";
  }

  const liveEnd = getMatchLiveWindowEnd(match.matchDate, liveDurationSeconds);

  if (now.getTime() <= liveEnd.getTime()) {
    return "live";
  }

  return "replay";
};

export const matchMinuteToWallSeconds = (
  matchMinute: number,
  liveDurationSeconds: number = MATCH_LIVE_REPLAY_DURATION_SECONDS,
): number => {
  const clamped = Math.max(0, Math.min(90, matchMinute));
  return (clamped / 90) * liveDurationSeconds;
};

export const wallSecondsToMatchMinute = (
  wallSeconds: number,
  liveDurationSeconds: number = MATCH_LIVE_REPLAY_DURATION_SECONDS,
): number => {
  if (liveDurationSeconds <= 0) {
    return 0;
  }

  const clamped = Math.max(0, Math.min(liveDurationSeconds, wallSeconds));
  return Math.min(90, Math.floor((clamped / liveDurationSeconds) * 90));
};

export const getRevealedEvents = (
  events: MatchEvent[],
  matchMinute: number,
): MatchEvent[] => {
  return events.filter((event) => event.minute <= matchMinute);
};

export const getRunningScoreFromEvents = (
  events: MatchEvent[],
  homeClubId: string,
  awayClubId: string,
): { home: number; away: number } => {
  let home = 0;
  let away = 0;

  for (const event of events) {
    if (event.type !== MatchEventType.Goal || !event.clubId) {
      continue;
    }

    if (event.clubId === homeClubId) {
      home += 1;
    } else if (event.clubId === awayClubId) {
      away += 1;
    }
  }

  return { home, away };
};

export const getMatchEventKey = (event: MatchEvent): string => {
  return `${event.type}-${event.minute}-${event.description}`;
};

/** Events fully presented in the live feed — used so scoreboard lags until the Goal line. */
export const getEventsThroughFeedPresentation = (
  revealed: MatchEvent[],
  sequence: MatchEvent[],
  lineIndex: number,
): MatchEvent[] => {
  if (revealed.length === 0) {
    return [];
  }

  if (sequence.length === 0) {
    // Feed has not presented the current minute yet — withhold that minute.
    const latestMinute = revealed[revealed.length - 1].minute;
    return revealed.filter((event) => event.minute < latestMinute);
  }

  const sequenceMinute = sequence[0].minute;
  const presentedCount = Math.min(lineIndex + 1, sequence.length);
  const presentedKeys = new Set(
    sequence.slice(0, presentedCount).map((event) => getMatchEventKey(event)),
  );

  return revealed.filter((event) => {
    if (event.minute < sequenceMinute) {
      return true;
    }

    if (event.minute > sequenceMinute) {
      return false;
    }

    return presentedKeys.has(getMatchEventKey(event));
  });
};

const POSSESSION_EVENT_TYPES = new Set<MatchEventType>([
  MatchEventType.Possession,
  MatchEventType.BuildUp,
  MatchEventType.AttackLeft,
  MatchEventType.AttackCenter,
  MatchEventType.AttackRight,
  MatchEventType.Cross,
  MatchEventType.ThroughBall,
  MatchEventType.Shot,
  MatchEventType.Save,
  MatchEventType.Block,
  MatchEventType.Miss,
  MatchEventType.Corner,
  MatchEventType.FreeKick,
  MatchEventType.Goal,
  MatchEventType.KickOff,
  MatchEventType.Tackle,
  MatchEventType.Interception,
  MatchEventType.Clearance,
  MatchEventType.LooseBall,
  MatchEventType.Foul,
  MatchEventType.ThrowIn,
  MatchEventType.GoalKick,
]);

export type PitchBallPosition = {
  x: number;
  y: number;
  clubId: string | null;
};

/** SVG viewBox coords: home attacks left→right (higher x). */
export const getBallPositionFromEvents = (
  events: MatchEvent[],
  homeClubId: string,
): PitchBallPosition => {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];

    if (!POSSESSION_EVENT_TYPES.has(event.type)) {
      continue;
    }

    const isHome = event.clubId === homeClubId;
    let x = isHome ? 62 : 38;
    let y = 32;

    switch (event.type) {
      case MatchEventType.KickOff:
        x = 50;
        y = 32;
        break;
      case MatchEventType.Possession:
      case MatchEventType.BuildUp:
        x = isHome ? 35 : 65;
        y = 32;
        break;
      case MatchEventType.AttackLeft:
        x = isHome ? 72 : 28;
        y = isHome ? 14 : 50;
        break;
      case MatchEventType.AttackCenter:
        x = isHome ? 75 : 25;
        y = 32;
        break;
      case MatchEventType.AttackRight:
        x = isHome ? 72 : 28;
        y = isHome ? 50 : 14;
        break;
      case MatchEventType.Cross:
      case MatchEventType.ThroughBall:
        x = isHome ? 80 : 20;
        y = 32;
        break;
      case MatchEventType.Shot:
      case MatchEventType.Miss:
      case MatchEventType.Goal:
        x = isHome ? 88 : 12;
        y = 32;
        break;
      case MatchEventType.Save:
      case MatchEventType.Block:
      case MatchEventType.Clearance:
        // Club is the defending side — ball is near their own goal.
        x = isHome ? 12 : 88;
        y = 32;
        break;
      case MatchEventType.Tackle:
      case MatchEventType.Interception:
      case MatchEventType.Foul:
        x = isHome ? 40 : 60;
        y = 32;
        break;
      case MatchEventType.LooseBall:
        x = isHome ? 48 : 52;
        y = 28;
        break;
      case MatchEventType.ThrowIn:
        x = isHome ? 55 : 45;
        y = isHome ? 6 : 58;
        break;
      case MatchEventType.GoalKick:
        // Club taking the kick is defending — ball near their goal.
        x = isHome ? 8 : 92;
        y = 32;
        break;
      case MatchEventType.Corner:
        x = isHome ? 92 : 8;
        y = isHome ? 8 : 56;
        break;
      case MatchEventType.FreeKick:
        x = isHome ? 70 : 30;
        y = 32;
        break;
      default:
        break;
    }

    return { x, y, clubId: event.clubId ?? null };
  }

  return { x: 50, y: 32, clubId: null };
};

export const getMatchLivePath = (matchId: string): string => `/app/matches/${matchId}/live`;

export const getMatchLiveReplayPath = (matchId: string): string =>
  `/app/matches/${matchId}/live?replay=1`;

export const getMatchReportPath = (matchId: string): string => `/app/matches/${matchId}`;

export const shouldOpenLiveView = (phase: MatchPresentationPhase): boolean => {
  return phase === "waitingSim" || phase === "live";
};

export const shouldOpenMatchReport = (phase: MatchPresentationPhase): boolean => {
  return phase === "replay";
};

export type LiveMatchSideStats = {
  goals: number;
  shots: number;
  shotsOnTarget: number;
  expectedGoals: number;
  bigChances: number;
  bigChancesMissed: number;
  corners: number;
  tackles: number;
  interceptions: number;
  clearances: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  possessionEvents: number;
};

export type LiveMatchStats = {
  home: LiveMatchSideStats;
  away: LiveMatchSideStats;
  homePossessionPercent: number;
  awayPossessionPercent: number;
};

const emptySideStats = (): LiveMatchSideStats => ({
  goals: 0,
  shots: 0,
  shotsOnTarget: 0,
  expectedGoals: 0,
  bigChances: 0,
  bigChancesMissed: 0,
  corners: 0,
  tackles: 0,
  interceptions: 0,
  clearances: 0,
  fouls: 0,
  yellowCards: 0,
  redCards: 0,
  possessionEvents: 0,
});

const isShotEvent = (type: MatchEventType): boolean => {
  return type === MatchEventType.Shot;
};

const isShotOnTargetForAttacker = (type: MatchEventType): boolean => {
  return type === MatchEventType.Goal;
};

const isPossessionWeighted = (type: MatchEventType): boolean => {
  return POSSESSION_EVENT_TYPES.has(type);
};

const shotLedToGoal = (
  events: MatchEvent[],
  shotIndex: number,
  clubId: string,
): boolean => {
  const shot = events[shotIndex];

  // Prefer forward lookup (Shot then Goal — correct insertion order).
  for (let index = shotIndex + 1; index < events.length; index += 1) {
    const next = events[index];

    if (next.minute !== shot.minute) {
      break;
    }

    if (next.type === MatchEventType.Goal && next.clubId === clubId) {
      return true;
    }
  }

  // Legacy logs sorted by event type enum, which put Goal (2) before Shot (15).
  for (let index = shotIndex - 1; index >= 0; index -= 1) {
    const previous = events[index];

    if (previous.minute !== shot.minute) {
      break;
    }

    if (previous.type === MatchEventType.Goal && previous.clubId === clubId) {
      return true;
    }
  }

  return false;
};

export const getLiveMatchStats = (
  events: MatchEvent[],
  homeClubId: string,
  awayClubId: string,
): LiveMatchStats => {
  const home = emptySideStats();
  const away = emptySideStats();

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];

    if (!event.clubId) {
      continue;
    }

    const side = event.clubId === homeClubId
      ? home
      : event.clubId === awayClubId
        ? away
        : null;

    if (!side) {
      continue;
    }

    if (event.type === MatchEventType.Goal) {
      side.goals += 1;
    }

    if (isShotEvent(event.type)) {
      side.shots += 1;
      side.expectedGoals += event.expectedGoals ?? 0;

      if (event.isBigChance) {
        side.bigChances += 1;

        if (!shotLedToGoal(events, index, event.clubId)) {
          side.bigChancesMissed += 1;
        }
      }
    }

    if (isShotOnTargetForAttacker(event.type)) {
      side.shotsOnTarget += 1;
    }

    // Saves are attributed to the keeper's club; on-target credit goes to the shooters.
    if (event.type === MatchEventType.Save) {
      if (event.clubId === homeClubId) {
        away.shotsOnTarget += 1;
      } else if (event.clubId === awayClubId) {
        home.shotsOnTarget += 1;
      }
    }

    if (event.type === MatchEventType.Corner) {
      side.corners += 1;
    }

    if (event.type === MatchEventType.Tackle) {
      side.tackles += 1;
    }

    if (event.type === MatchEventType.Interception) {
      side.interceptions += 1;
    }

    if (event.type === MatchEventType.Clearance) {
      side.clearances += 1;
    }

    if (event.type === MatchEventType.Foul) {
      side.fouls += 1;
    }

    if (event.type === MatchEventType.YellowCard) {
      side.yellowCards += 1;
    }

    if (event.type === MatchEventType.RedCard) {
      side.redCards += 1;
    }

    if (isPossessionWeighted(event.type)) {
      side.possessionEvents += 1;
    }
  }

  const roundXg = (value: number): number => Math.round(value * 100) / 100;
  home.expectedGoals = roundXg(home.expectedGoals);
  away.expectedGoals = roundXg(away.expectedGoals);

  const possessionTotal = home.possessionEvents + away.possessionEvents;

  if (possessionTotal <= 0) {
    return {
      home,
      away,
      homePossessionPercent: 50,
      awayPossessionPercent: 50,
    };
  }

  const homePossessionPercent = Math.round(
    (home.possessionEvents / possessionTotal) * 100,
  );

  return {
    home,
    away,
    homePossessionPercent,
    awayPossessionPercent: 100 - homePossessionPercent,
  };
};

export type LiveMomentIntensity = "normal" | "notable" | "critical";

export const getLiveMomentIntensity = (
  event: MatchEvent | null | undefined,
): LiveMomentIntensity => {
  if (!event) {
    return "normal";
  }

  if (
    event.type === MatchEventType.Goal ||
    event.type === MatchEventType.RedCard
  ) {
    return "critical";
  }

  if (
    event.type === MatchEventType.Shot ||
    event.type === MatchEventType.Save ||
    event.type === MatchEventType.Miss ||
    event.type === MatchEventType.Block ||
    event.type === MatchEventType.GoalKick ||
    event.type === MatchEventType.YellowCard ||
    event.type === MatchEventType.Injury ||
    event.type === MatchEventType.Foul ||
    event.type === MatchEventType.HalfTime ||
    event.type === MatchEventType.FullTime
  ) {
    return "notable";
  }

  return "normal";
};

/** Same-minute trail that should pause the clock while commentary plays through. */
export const isKeyAttackSequence = (sequence: MatchEvent[]): boolean => {
  if (sequence.length === 0) {
    return false;
  }

  // Goals and big chances always pause the clock, even as a single feed line.
  if (
    sequence.some(
      (event) => event.type === MatchEventType.Goal || event.isBigChance,
    )
  ) {
    return true;
  }

  if (sequence.length < 2) {
    return false;
  }

  // Only real finishing sequences — not failed attacks or restarts.
  return sequence.some((event) => {
    return (
      event.type === MatchEventType.Shot ||
      event.type === MatchEventType.Save ||
      event.type === MatchEventType.Miss ||
      event.type === MatchEventType.Block ||
      event.type === MatchEventType.GoalKick ||
      event.type === MatchEventType.Goal
    );
  });
};

export const getSameMinuteSequence = (events: MatchEvent[]): MatchEvent[] => {
  if (events.length === 0) {
    return [];
  }

  const latest = events[events.length - 1];
  const sequence: MatchEvent[] = [];

  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];

    if (event.minute !== latest.minute) {
      break;
    }

    sequence.unshift(event);
  }

  return sequence;
};

export const getLatestLiveEvents = (
  events: MatchEvent[],
  count = 2,
): MatchEvent[] => {
  if (events.length === 0) {
    return [];
  }

  return events.slice(-Math.max(1, count));
};
