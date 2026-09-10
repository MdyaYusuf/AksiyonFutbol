using Api.Core.Options;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Objectives;
using Api.Features.SeasonTransitions;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubPresidents;

public interface IPresidentSeasonIdentitySettler
{
  SeasonPresidentPackageDto BuildSeasonPackagePreview(
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition);

  Task<SeasonPresidentPackageDto> ApplySeasonPackageAsync(
    Club club,
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition,
    CancellationToken cancellationToken = default);

  Task<SeasonPresidentPackageDto> ApplyTutorialGraduationPackageAsync(
    Club club,
    ClubPresident president,
    LeagueTier tier,
    CancellationToken cancellationToken = default);
}

public class PresidentSeasonIdentitySettler(
  IOptions<GameOptions> _gameOptions,
  IObjectivesProgressSettler _objectivesProgressSettler) : IPresidentSeasonIdentitySettler
{
  public SeasonPresidentPackageDto BuildSeasonPackagePreview(
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition)
  {
    return PresidentSeasonIdentityBusinessRules.BuildSeasonPackage(
      _gameOptions.Value,
      president,
      outcome,
      finishingPosition);
  }

  public async Task<SeasonPresidentPackageDto> ApplySeasonPackageAsync(
    Club club,
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition,
    CancellationToken cancellationToken = default)
  {
    SeasonPresidentPackageDto package = BuildSeasonPackagePreview(
      president,
      outcome,
      finishingPosition);

    if (package.CashAwarded > 0m)
    {
      club.Cash += package.CashAwarded;
    }

    president.Title = package.FlavorTitle;

    PresidentIdentityTrack track = PresidentSeasonIdentityBusinessRules.ResolveTrack(
      president.ReputationPoints,
      president.InfamyPoints,
      _gameOptions.Value.PresidentMoralityDominanceThreshold);

    await _objectivesProgressSettler.SettleAfterSeasonPackageAsync(
      club,
      president,
      track,
      package.FlavorTitle,
      TitleUnlockSource.Season,
      cancellationToken);

    return package;
  }

  public async Task<SeasonPresidentPackageDto> ApplyTutorialGraduationPackageAsync(
    Club club,
    ClubPresident president,
    LeagueTier tier,
    CancellationToken cancellationToken = default)
  {
    SeasonPresidentPackageDto package = PresidentSeasonIdentityBusinessRules.BuildTutorialGraduationPackage(
      _gameOptions.Value,
      president,
      tier);

    if (package.CashAwarded > 0m)
    {
      club.Cash += package.CashAwarded;
    }

    president.Title = package.FlavorTitle;

    PresidentIdentityTrack track = PresidentSeasonIdentityBusinessRules.ResolveTrack(
      president.ReputationPoints,
      president.InfamyPoints,
      _gameOptions.Value.PresidentMoralityDominanceThreshold);

    await _objectivesProgressSettler.SettleAfterSeasonPackageAsync(
      club,
      president,
      track,
      package.FlavorTitle,
      TitleUnlockSource.Tutorial,
      cancellationToken);

    return package;
  }
}
