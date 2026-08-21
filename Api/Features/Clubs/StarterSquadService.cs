using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.ClubDrafts;
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
    ClubDraftBusinessRules.EnsureCompositionIsValid(options);

    decimal selectionCash = options.DraftStartingCash;
    decimal selectionWage = options.TierStartingWageBudgetIron;
    club.Cash = Math.Max(club.Cash, selectionCash);
    club.WageBudget = Math.Max(club.WageBudget, selectionWage);

    List<BasePlayer> catalog = await _basePlayerRepository.GetAllAsync(
      enableTracking: false,
      cancellationToken: cancellationToken);

    List<BasePlayer> selectedTemplates = BotSquadAutoDraft.SelectSquad(
      catalog,
      options,
      selectionCash,
      selectionWage,
      BotDraftProfileKind.Iron,
      BotDraftStyle.Balanced);

    foreach (BasePlayer template in selectedTemplates)
    {
      club.Cash -= template.DraftFee;
      club.Players.Add(PlayerInstanceFromBasePlayer.CreateFromTemplate(club.Id, template));
    }
  }
}
