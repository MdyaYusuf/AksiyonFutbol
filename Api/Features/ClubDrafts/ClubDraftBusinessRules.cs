using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BaseBotClubs;
using Api.Features.BasePlayers;
using Api.Features.Clubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.ClubDrafts;

public class ClubDraftBusinessRules(
  ClubBusinessRules _clubBusinessRules,
  IBasePlayerRepository _basePlayerRepository,
  IClubDraftPickRepository _draftPickRepository,
  IBaseBotClubRepository _baseBotClubRepository,
  IOptions<GameOptions> _gameOptions)
{
  public GameOptions Options => _gameOptions.Value;

  public async Task<Club> GetDraftingClubForUserAsync(
    Guid userId,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club club = await _clubBusinessRules.GetClubByUserIdIfExistAsync(
      userId,
      include: query => query
        .Include(c => c.President)
        .Include(c => c.DraftPicks)
        .ThenInclude(p => p.BasePlayer),
      enableTracking: enableTracking,
      cancellationToken: cancellationToken);

    MustBeDrafting(club);
    return club;
  }

  public void MustBeDrafting(Club club)
  {
    if (club.LifecycleStatus != ClubLifecycleStatus.Drafting)
    {
      throw new BusinessException("Draft yalnızca Drafting durumundaki kulüpler için kullanılabilir.");
    }
  }

  public async Task<BasePlayer> GetBasePlayerIfExistAsync(
    Guid basePlayerId,
    CancellationToken cancellationToken = default)
  {
    BasePlayer? basePlayer = await _basePlayerRepository.GetByIdAsync(
      basePlayerId,
      cancellationToken: cancellationToken);

    if (basePlayer == null)
    {
      throw new NotFoundException($"{basePlayerId} numaralı oyuncu şablonu bulunamadı.");
    }

    return basePlayer;
  }

  public async Task MustNotAlreadyBePickedAsync(
    Guid clubId,
    Guid basePlayerId,
    CancellationToken cancellationToken = default)
  {
    bool exists = await _draftPickRepository.AnyAsync(
      p => p.ClubId == clubId && p.BasePlayerId == basePlayerId,
      cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu oyuncu zaten draft listenizde.");
    }
  }

  public void MustHavePositionQuotaRemaining(
    Club club,
    PlayerPosition position,
    GameOptions options)
  {
    int required = GetRequiredCount(position, options);
    int selected = club.DraftPicks.Count(p => p.BasePlayer.Position == position);

    if (selected >= required)
    {
      throw new BusinessException($"Bu pozisyon için draft kotası dolu ({required}).");
    }
  }

  public void MustAffordPick(Club club, BasePlayer basePlayer)
  {
    decimal spentFees = club.DraftPicks.Sum(p => p.BasePlayer.DraftFee);
    decimal committedWages = club.DraftPicks.Sum(p => p.BasePlayer.Wage);
    decimal fee = basePlayer.DraftFee;
    decimal wage = basePlayer.Wage;

    if (club.Cash - spentFees - fee < 0)
    {
      throw new BusinessException("Draft ücreti için yeterli nakit yok.");
    }

    if (club.WageBudget - committedWages - wage < 0)
    {
      throw new BusinessException("Draft için yeterli maaş bütçesi yok.");
    }
  }

  public void MustMeetExactQuotas(Club club, GameOptions options)
  {
    EnsureCompositionIsValid(options);

    foreach ((PlayerPosition position, int required) in GetQuotaMap(options))
    {
      int selected = club.DraftPicks.Count(p => p.BasePlayer.Position == position);

      if (selected != required)
      {
        throw new BusinessException(
          $"Draft kotası tamamlanmadı. {position}: gereken {required}, seçilen {selected}.");
      }
    }

    decimal spentFees = club.DraftPicks.Sum(p => p.BasePlayer.DraftFee);
    decimal committedWages = club.DraftPicks.Sum(p => p.BasePlayer.Wage);

    if (club.Cash - spentFees < 0)
    {
      throw new BusinessException("Draft ücretleri kulüp nakitini aşıyor.");
    }

    if (club.WageBudget - committedWages < 0)
    {
      throw new BusinessException("Draft maaşları bütçeyi aşıyor.");
    }
  }

  public async Task<List<BaseBotClub>> GetTutorialBotTemplatesAsync(
    CancellationToken cancellationToken = default)
  {
    int botCount = Options.TutorialClubCount - 1;

    if (botCount <= 0)
    {
      throw new BusinessException("Placement bot sayısı yapılandırması geçersiz.");
    }

    List<BaseBotClub> templates = await _baseBotClubRepository.GetAllAsync(
      filter: b => b.IsTutorialTemplate,
      orderBy: query => query.OrderBy(b => b.Name),
      cancellationToken: cancellationToken);

    if (templates.Count < botCount)
    {
      throw new BusinessException(
        $"Placement ligi için yeterli bot şablonu yok. Gereken: {botCount}, mevcut: {templates.Count}.");
    }

    return templates.Take(botCount).ToList();
  }

  public static int GetRequiredCount(PlayerPosition position, GameOptions options)
  {
    return position switch
    {
      PlayerPosition.Goalkeeper => options.StarterSquadGoalkeepers,
      PlayerPosition.Defender => options.StarterSquadDefenders,
      PlayerPosition.Midfielder => options.StarterSquadMidfielders,
      PlayerPosition.Forward => options.StarterSquadForwards,
      _ => 0
    };
  }

  public static IReadOnlyList<(PlayerPosition Position, int Required)> GetQuotaMap(GameOptions options)
  {
    return
    [
      (PlayerPosition.Goalkeeper, options.StarterSquadGoalkeepers),
      (PlayerPosition.Defender, options.StarterSquadDefenders),
      (PlayerPosition.Midfielder, options.StarterSquadMidfielders),
      (PlayerPosition.Forward, options.StarterSquadForwards)
    ];
  }

  public static void EnsureCompositionIsValid(GameOptions options)
  {
    int total =
      options.StarterSquadGoalkeepers +
      options.StarterSquadDefenders +
      options.StarterSquadMidfielders +
      options.StarterSquadForwards;

    if (total <= 0)
    {
      throw new BusinessException("Draft kadro kotası yapılandırması geçersiz.");
    }

    if (options.StarterSquadGoalkeepers < 1)
    {
      throw new BusinessException("Draft kadrosunda en az bir kaleci olmalıdır.");
    }
  }
}
