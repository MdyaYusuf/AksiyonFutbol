using Api.Features.Actions;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.Matches;

namespace Api.Features.Objectives;

public interface IObjectivesProgressSettler
{
  Task SettleAfterMatchAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default);

  Task SettleAfterActionAsync(
    Club club,
    ClubActionDefinition definition,
    bool succeeded,
    CancellationToken cancellationToken = default);

  Task SettleAfterFacilityUpgradeAsync(
    Club club,
    CancellationToken cancellationToken = default);

  Task SettleAfterSeasonPackageAsync(
    Club club,
    ClubPresident president,
    PresidentIdentityTrack track,
    string flavorTitle,
    TitleUnlockSource titleSource,
    CancellationToken cancellationToken = default);

  Task SyncIdentityThresholdsAsync(
    Club club,
    ClubPresident president,
    CancellationToken cancellationToken = default);
}

public class ObjectivesProgressSettler(
  IClubObjectiveProgressRepository _progressRepository,
  ObjectivesBusinessRules _businessRules) : IObjectivesProgressSettler
{
  public async Task SettleAfterMatchAsync(
    Match match,
    int homeScore,
    int awayScore,
    CancellationToken cancellationToken = default)
  {
    await SettleClubMatchAsync(
      match.HomeClub,
      goalsFor: homeScore,
      goalsAgainst: awayScore,
      cancellationToken);

    await SettleClubMatchAsync(
      match.AwayClub,
      goalsFor: awayScore,
      goalsAgainst: homeScore,
      cancellationToken);
  }

  public async Task SettleAfterActionAsync(
    Club club,
    ClubActionDefinition definition,
    bool succeeded,
    CancellationToken cancellationToken = default)
  {
    if (!succeeded || club.IsBot || club.President == null)
    {
      return;
    }

    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    ClubActionPathAffinity affinity = ClubActionPresentationRules.GetPathAffinity(definition);

    if (affinity == ClubActionPathAffinity.Honorable)
    {
      ApplyMetric(progresses, ObjectiveMetric.IntegrityActions, 1);
    }

    if (definition.IsShady)
    {
      ApplyMetric(progresses, ObjectiveMetric.GrayActions, 1);
    }

    await SyncIdentityThresholdsAsync(club, club.President, cancellationToken);
  }

  public async Task SettleAfterFacilityUpgradeAsync(
    Club club,
    CancellationToken cancellationToken = default)
  {
    if (club.IsBot || club.President == null)
    {
      return;
    }

    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);
    ApplyMetric(progresses, ObjectiveMetric.FacilityUpgrades, 1);
  }

  public async Task SettleAfterSeasonPackageAsync(
    Club club,
    ClubPresident president,
    PresidentIdentityTrack track,
    string flavorTitle,
    TitleUnlockSource titleSource,
    CancellationToken cancellationToken = default)
  {
    if (club.IsBot)
    {
      return;
    }

    string displayName = flavorTitle.Trim();
    if (!string.IsNullOrWhiteSpace(displayName))
    {
      string titleKey = ObjectivesBusinessRules.ToTitleKey(displayName);
      await _businessRules.UnlockTitleIfMissingAsync(
        president,
        titleKey,
        displayName,
        titleSource,
        cancellationToken);
    }

    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    if (track == PresidentIdentityTrack.Honorable)
    {
      ApplyMetric(progresses, ObjectiveMetric.SeasonHonorableFinished, 1);
    }
    else if (track == PresidentIdentityTrack.Shady)
    {
      ApplyMetric(progresses, ObjectiveMetric.SeasonShadyFinished, 1);
    }

    await SyncIdentityThresholdsAsync(club, president, cancellationToken);
  }

  public async Task SyncIdentityThresholdsAsync(
    Club club,
    ClubPresident president,
    CancellationToken cancellationToken = default)
  {
    if (club.IsBot)
    {
      return;
    }

    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    if (ClubPresidentMoralityBusinessRules.HasHonorablePowerUnlock(president.ReputationPoints))
    {
      ApplyMetric(progresses, ObjectiveMetric.HonorablePowerReached, 1);
    }

    if (ClubPresidentMoralityBusinessRules.HasShadyTierIIUnlock(president.InfamyPoints))
    {
      ApplyMetric(progresses, ObjectiveMetric.GrayTierIIReached, 1);
    }
  }

  private async Task SettleClubMatchAsync(
    Club? club,
    int goalsFor,
    int goalsAgainst,
    CancellationToken cancellationToken)
  {
    if (club == null || club.IsBot || club.President == null)
    {
      return;
    }

    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    bool won = goalsFor > goalsAgainst;
    bool cleanSheet = goalsAgainst == 0;

    if (won)
    {
      ApplyMetric(progresses, ObjectiveMetric.MatchWins, 1);
    }

    if (goalsFor > 0)
    {
      ApplyMetric(progresses, ObjectiveMetric.GoalsScored, goalsFor);
    }

    if (cleanSheet)
    {
      ApplyMetric(progresses, ObjectiveMetric.CleanSheets, 1);
    }

    await SyncIdentityThresholdsAsync(club, club.President, cancellationToken);
  }

  private async Task<List<ClubObjectiveProgress>> LoadProgressAsync(
    Guid clubId,
    CancellationToken cancellationToken)
  {
    return await _progressRepository.GetAllAsync(
      filter: p => p.ClubId == clubId,
      enableTracking: true,
      cancellationToken: cancellationToken);
  }

  private static void ApplyMetric(
    List<ClubObjectiveProgress> progresses,
    ObjectiveMetric metric,
    int amount)
  {
    IReadOnlyList<ObjectiveKey> keys = ObjectiveCatalog.KeysForMetric(metric);

    foreach (ObjectiveKey key in keys)
    {
      ClubObjectiveProgress? progress = progresses.FirstOrDefault(p => p.ObjectiveKey == key);
      if (progress == null)
      {
        continue;
      }

      ObjectivesBusinessRules.ApplyProgressIncrement(progress, amount);
    }
  }
}
