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

    await _businessRules.EnsureProgressSeededAsync(club.Id, cancellationToken);
    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    ClubActionPathAffinity affinity = ClubActionPresentationRules.GetPathAffinity(definition);

    if (affinity == ClubActionPathAffinity.Honorable)
    {
      Increment(progresses, ObjectiveKey.IntegrityActions3, 1);
    }

    if (definition.IsShady)
    {
      Increment(progresses, ObjectiveKey.GrayActions3, 1);
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

    await _businessRules.EnsureProgressSeededAsync(club.Id, cancellationToken);
    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);
    Increment(progresses, ObjectiveKey.FacilityUpgrade1, 1);
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

    await _businessRules.EnsureProgressSeededAsync(club.Id, cancellationToken);
    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    if (track == PresidentIdentityTrack.Honorable)
    {
      Complete(progresses, ObjectiveKey.SeasonHonorablePackage);
    }
    else if (track == PresidentIdentityTrack.Shady)
    {
      Complete(progresses, ObjectiveKey.SeasonShadyPackage);
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

    await _businessRules.EnsureProgressSeededAsync(club.Id, cancellationToken);
    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    if (ClubPresidentMoralityBusinessRules.HasHonorablePowerUnlock(president.ReputationPoints))
    {
      Complete(progresses, ObjectiveKey.ReachHonorablePower);
    }

    if (ClubPresidentMoralityBusinessRules.HasShadyTierIIUnlock(president.InfamyPoints))
    {
      Complete(progresses, ObjectiveKey.ReachGrayTierII);
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

    await _businessRules.EnsureProgressSeededAsync(club.Id, cancellationToken);
    List<ClubObjectiveProgress> progresses = await LoadProgressAsync(club.Id, cancellationToken);

    bool won = goalsFor > goalsAgainst;
    bool cleanSheet = goalsAgainst == 0;

    if (won)
    {
      Increment(progresses, ObjectiveKey.WinMatches5, 1);
    }

    if (goalsFor > 0)
    {
      Increment(progresses, ObjectiveKey.ScoreGoals10, goalsFor);
    }

    if (cleanSheet)
    {
      Increment(progresses, ObjectiveKey.CleanSheets3, 1);
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

  private static void Increment(
    List<ClubObjectiveProgress> progresses,
    ObjectiveKey key,
    int amount)
  {
    ClubObjectiveProgress? progress = progresses.FirstOrDefault(p => p.ObjectiveKey == key);
    if (progress == null)
    {
      return;
    }

    ObjectivesBusinessRules.ApplyProgressIncrement(progress, amount);
    // tracked entity — Update not required for EF-tracked
  }

  private static void Complete(
    List<ClubObjectiveProgress> progresses,
    ObjectiveKey key)
  {
    ClubObjectiveProgress? progress = progresses.FirstOrDefault(p => p.ObjectiveKey == key);
    if (progress == null)
    {
      return;
    }

    ObjectivesBusinessRules.CompleteOneShot(progress);
  }
}
