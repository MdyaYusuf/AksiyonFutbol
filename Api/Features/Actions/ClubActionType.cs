namespace Api.Features.Actions;

// Referee bribery is intentionally not part of this enum; it keeps its own
// dedicated feature (Api.Features.Bribery) and is surfaced alongside these
// actions in the client hub.
public enum ClubActionType
{
  // Match category (pre-match, one attempt per fixture)
  MatchFixing = 1,
  Doping = 2,
  Espionage = 3,
  Sabotage = 4,
  IntimidateReferee = 5,
  EspionageII = 6,

  // Squad category (cooldown based)
  TeamBonding = 20,
  FinePlayer = 21,
  MotivationalTalk = 22,
  BrutalTraining = 23,
  PromiseWinBonus = 24,

  // Politics category (cooldown based)
  MediaSpin = 40,
  LobbyFederation = 41,
  DodgySponsorship = 42,
  TapUpTarget = 43,
  TapUpTargetII = 44,

  // Honorable power actions (Legitimacy-gated politics)
  CommunityDay = 50,
  AcademyPush = 51,
  FairPlayPledge = 52,
  CleanMediaCampaign = 53,
  FederationAlly = 54
}
