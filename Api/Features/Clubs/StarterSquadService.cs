using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.PlayerInstances;
using Microsoft.Extensions.Options;

namespace Api.Features.Clubs;

public class StarterSquadService(
  IBasePlayerRepository _basePlayerRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IOptions<GameOptions> _gameOptions) : IStarterSquadService
{
  public async Task AssignAsync(Club club, CancellationToken cancellationToken = default)
  {
    ArgumentNullException.ThrowIfNull(club);

    if (club.Id == Guid.Empty)
    {
      throw new BusinessException("Kulüp kimliği atanmadan başlangıç kadrosu oluşturulamaz.");
    }

    int existingPlayerCount = await _playerInstanceRepository.CountByClubIdAsync(
      club.Id,
      cancellationToken);

    if (existingPlayerCount > 0)
    {
      throw new BusinessException("Bu kulübün zaten oyuncuları var. Başlangıç kadrosu tekrar atanamaz.");
    }

    GameOptions options = _gameOptions.Value;
    EnsureCompositionIsValid(options);

    List<BasePlayer> selectedTemplates = await SelectTemplatesAsync(options, cancellationToken);

    foreach (BasePlayer template in selectedTemplates)
    {
      club.Players.Add(CreatePlayerFromTemplate(club.Id, template, options));
    }
  }

  private async Task<List<BasePlayer>> SelectTemplatesAsync(
    GameOptions options,
    CancellationToken cancellationToken)
  {
    List<BasePlayer> selected = new();

    selected.AddRange(await PickForPositionAsync(
      PlayerPosition.Goalkeeper,
      options.StarterSquadGoalkeepers,
      "kaleci",
      cancellationToken));

    selected.AddRange(await PickForPositionAsync(
      PlayerPosition.Defender,
      options.StarterSquadDefenders,
      "defans",
      cancellationToken));

    selected.AddRange(await PickForPositionAsync(
      PlayerPosition.Midfielder,
      options.StarterSquadMidfielders,
      "orta saha",
      cancellationToken));

    selected.AddRange(await PickForPositionAsync(
      PlayerPosition.Forward,
      options.StarterSquadForwards,
      "forvet",
      cancellationToken));

    return selected;
  }

  private async Task<List<BasePlayer>> PickForPositionAsync(
    PlayerPosition position,
    int count,
    string positionLabel,
    CancellationToken cancellationToken)
  {
    if (count <= 0)
    {
      return [];
    }

    List<BasePlayer> pool = await _basePlayerRepository.GetAllAsync(
      filter: bp => bp.Position == position,
      orderBy: query => query
        .OrderByDescending(bp => bp.AttackPower + bp.DefenseStrength + bp.MidfieldControl)
        .ThenBy(bp => bp.DefaultLastName)
        .ThenBy(bp => bp.DefaultFirstName),
      enableTracking: false,
      cancellationToken: cancellationToken);

    if (pool.Count < count)
    {
      throw new BusinessException(
        $"Başlangıç kadrosu için yeterli {positionLabel} şablonu yok. Gereken: {count}, mevcut: {pool.Count}.");
    }

    return pool
      .OrderBy(_ => Random.Shared.Next())
      .Take(count)
      .ToList();
  }

  private static PlayerInstance CreatePlayerFromTemplate(
    Guid clubId,
    BasePlayer basePlayer,
    GameOptions options)
  {
    int overall = BasePlayerRatingCalculator.Calculate(basePlayer);

    PlayerInstance player = new()
    {
      FirstName = basePlayer.DefaultFirstName,
      LastName = basePlayer.DefaultLastName,
      ClubId = clubId,
      BasePlayerId = basePlayer.Id,
      Nationality = basePlayer.Nationality,
      Position = basePlayer.Position,
      Age = basePlayer.Age,
      HeightCm = basePlayer.HeightCm,
      WeightKg = basePlayer.WeightKg,
      PreferredFoot = basePlayer.PreferredFoot,
      AttackPower = basePlayer.AttackPower,
      DefenseStrength = basePlayer.DefenseStrength,
      MidfieldControl = basePlayer.MidfieldControl,
      MarketValue = overall * options.StarterMarketValuePerOverall,
      Wage = overall * options.StarterWagePerOverall,
      IsInjured = false,
      InjuryDays = 0
    };

    PlayerAttributeMapper.CopySubStats(basePlayer, player);
    PlayerAttributeCalculator.ApplyMainStats(player);
    return player;
  }

  private static void EnsureCompositionIsValid(GameOptions options)
  {
    int total =
      options.StarterSquadGoalkeepers +
      options.StarterSquadDefenders +
      options.StarterSquadMidfielders +
      options.StarterSquadForwards;

    if (total <= 0)
    {
      throw new BusinessException("Başlangıç kadrosu oyuncu sayısı yapılandırması geçersiz.");
    }

    if (options.StarterSquadGoalkeepers < 1)
    {
      throw new BusinessException("Başlangıç kadrosunda en az bir kaleci olmalıdır.");
    }
  }
}
