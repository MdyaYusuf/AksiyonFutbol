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
