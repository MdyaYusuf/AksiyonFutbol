namespace Api.Features.Objectives;

public enum ObjectiveKey
{
  WinMatches5 = 1,
  ScoreGoals10 = 2,
  CleanSheets3 = 3,
  IntegrityActions3 = 4,
  GrayActions3 = 5,
  ReachHonorablePower = 6,
  ReachGrayTierII = 7,
  FacilityUpgrade1 = 8,
  SeasonHonorablePackage = 9,
  SeasonShadyPackage = 10
}

/// <summary>
/// Progress counters the settler applies. Multiple objectives may share one metric.
/// </summary>
public enum ObjectiveMetric
{
  MatchWins = 1,
  GoalsScored = 2,
  CleanSheets = 3,
  IntegrityActions = 4,
  GrayActions = 5,
  HonorablePowerReached = 6,
  GrayTierIIReached = 7,
  FacilityUpgrades = 8,
  SeasonHonorableFinished = 9,
  SeasonShadyFinished = 10
}

public enum ObjectiveCategory
{
  Match = 1,
  Actions = 2,
  Identity = 3,
  Club = 4
}

public enum ObjectiveTrackAffinity
{
  Any = 1,
  Honorable = 2,
  Shady = 3
}

public enum ObjectiveStatus
{
  Active = 1,
  Completed = 2,
  Claimed = 3
}

public enum TitleUnlockSource
{
  Season = 1,
  Objective = 2,
  Tutorial = 3,
  Starting = 4
}
