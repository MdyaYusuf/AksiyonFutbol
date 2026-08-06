import { parseApiDate } from "../../../core/utils/dateTime";
import { MatchEventType, type MatchEvent } from "../matchTypes";

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

/** Wall-clock seconds into the 180s window for mid-join live playback. */
export const getPlaybackSeekSeconds = (
  matchDate: string,
  now: Date,
  liveDurationSeconds: number = MATCH_LIVE_REPLAY_DURATION_SECONDS,
): number => {
  const kickoff = getMatchKickoff(matchDate);

  if (Number.isNaN(kickoff.getTime())) {
    return 0;
  }

  const elapsedMs = now.getTime() - kickoff.getTime();

  if (elapsedMs <= 0) {
    return 0;
  }

  return Math.min(liveDurationSeconds, elapsedMs / 1000);
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
      case MatchEventType.Block:
      case MatchEventType.Save:
      case MatchEventType.Goal:
        x = isHome ? 88 : 12;
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

export type LiveMatchSideStats = {
  goals: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  attacks: number;
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
  corners: 0,
  attacks: 0,
  yellowCards: 0,
  redCards: 0,
  possessionEvents: 0,
});

const isAttackEvent = (type: MatchEventType): boolean => {
  return (
    type === MatchEventType.AttackLeft ||
    type === MatchEventType.AttackCenter ||
    type === MatchEventType.AttackRight ||
    type === MatchEventType.Cross ||
    type === MatchEventType.ThroughBall
  );
};

const isShotEvent = (type: MatchEventType): boolean => {
  return (
    type === MatchEventType.Shot ||
    type === MatchEventType.Miss ||
    type === MatchEventType.Block ||
    type === MatchEventType.Save ||
    type === MatchEventType.Goal
  );
};

const isShotOnTarget = (type: MatchEventType): boolean => {
  return (
    type === MatchEventType.Shot ||
    type === MatchEventType.Save ||
    type === MatchEventType.Goal
  );
};

const isPossessionWeighted = (type: MatchEventType): boolean => {
  return POSSESSION_EVENT_TYPES.has(type);
};

export const getLiveMatchStats = (
  events: MatchEvent[],
  homeClubId: string,
  awayClubId: string,
): LiveMatchStats => {
  const home = emptySideStats();
  const away = emptySideStats();

  for (const event of events) {
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
    }

    if (isShotOnTarget(event.type)) {
      side.shotsOnTarget += 1;
    }

    if (event.type === MatchEventType.Corner) {
      side.corners += 1;
    }

    if (isAttackEvent(event.type)) {
      side.attacks += 1;
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
    event.type === MatchEventType.YellowCard ||
    event.type === MatchEventType.Injury ||
    event.type === MatchEventType.HalfTime ||
    event.type === MatchEventType.FullTime
  ) {
    return "notable";
  }

  return "normal";
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
