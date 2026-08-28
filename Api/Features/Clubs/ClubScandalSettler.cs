using Api.Core.Options;
using Api.Features.ClubPresidents;
using Microsoft.Extensions.Options;

namespace Api.Features.Clubs;

public interface IClubScandalSettler
{
  decimal CalculateDetectionChance(decimal baseDetectionChance, int currentSuspicion);

  int ApplyHeat(Club club, int heatAmount);

  ClubScandalConsequence ApplyScandal(Club club, bool applyMatchPenalty = false);
}

public class ClubScandalSettler(
  IOptions<GameOptions> _gameOptions,
  IPresidentMoralitySettler _moralitySettler) : IClubScandalSettler
{
  public decimal CalculateDetectionChance(decimal baseDetectionChance, int currentSuspicion)
  {
    return ClubScandalBusinessRules.CalculateDetectionChance(
      _gameOptions.Value,
      baseDetectionChance,
      currentSuspicion);
  }

  public int ApplyHeat(Club club, int heatAmount)
  {
    if (heatAmount <= 0)
    {
      return 0;
    }

    int newSuspicion = Math.Clamp(
      club.Suspicion + heatAmount,
      0,
      _gameOptions.Value.MaxSuspicion);

    int applied = newSuspicion - club.Suspicion;
    club.Suspicion = newSuspicion;

    return applied;
  }

  public ClubScandalConsequence ApplyScandal(Club club, bool applyMatchPenalty = false)
  {
    GameOptions options = _gameOptions.Value;

    decimal fineAmount = Math.Round(club.Cash * options.ScandalFineCashRatio, 2);

    if (fineAmount < 0m)
    {
      fineAmount = 0m;
    }

    club.Cash = Math.Max(0m, club.Cash - fineAmount);

    int moraleBefore = club.Morale;
    club.Morale = ClubScandalBusinessRules.ClampClubStatus(
      club.Morale - options.ScandalMoralePenalty);
    int moralePenalty = moraleBefore - club.Morale;

    int reputationPenalty = 0;
    int infamyGain = 0;

    if (club.President != null)
    {
      if (options.ScandalReputationPenalty > 0)
      {
        reputationPenalty = _moralitySettler.ApplyLegitimacyLoss(
          club.President,
          options.ScandalReputationPenalty);
      }

      if (options.ScandalInfamyGain > 0)
      {
        infamyGain = _moralitySettler.ApplyInfamyGain(
          club.President,
          options.ScandalInfamyGain);
      }
    }

    return new ClubScandalConsequence
    {
      FineAmount = fineAmount,
      MoralePenalty = moralePenalty,
      ReputationPenalty = reputationPenalty,
      InfamyGain = infamyGain,
      MatchPenaltyApplied = applyMatchPenalty
    };
  }
}
