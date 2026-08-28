using Api.Core.Options;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.SeasonTransitions;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubPresidents;

public interface IPresidentSeasonIdentitySettler
{
  SeasonPresidentPackageDto BuildSeasonPackagePreview(
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition);

  SeasonPresidentPackageDto ApplySeasonPackage(
    Club club,
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition);

  SeasonPresidentPackageDto ApplyTutorialGraduationPackage(
    Club club,
    ClubPresident president,
    LeagueTier tier);
}

public class PresidentSeasonIdentitySettler(IOptions<GameOptions> _gameOptions) : IPresidentSeasonIdentitySettler
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

  public SeasonPresidentPackageDto ApplySeasonPackage(
    Club club,
    ClubPresident president,
    SeasonMovementOutcome outcome,
    int finishingPosition)
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

    return package;
  }

  public SeasonPresidentPackageDto ApplyTutorialGraduationPackage(
    Club club,
    ClubPresident president,
    LeagueTier tier)
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

    return package;
  }
}
