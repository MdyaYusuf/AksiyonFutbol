using Api.Core.Exceptions;
using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Features.Transfers;

public class TransferBusinessRules(
  IClubRepository _clubRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IBasePlayerRepository _basePlayerRepository,
  ITransferListingRepository _transferListingRepository,
  ITransferOfferRepository _transferOfferRepository,
  IOptions<GameOptions> _gameOptions)
{
  public int MinimumSquadSize => _gameOptions.Value.TransferMinimumSquadSize;

  public async Task<Club> GetClubIfExistAsync(
    Guid clubId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetByIdAsync(clubId, include, enableTracking, cancellationToken);

    if (club == null)
    {
      throw new NotFoundException($"{clubId} numaralı kulüp bulunamadı.");
    }

    return club;
  }

  public async Task<Club> GetClubByUserIdIfExistAsync(
    Guid userId,
    Func<IQueryable<Club>, IQueryable<Club>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Club? club = await _clubRepository.GetAsync(
      c => c.President != null && c.President.UserId == userId,
      include,
      enableTracking,
      cancellationToken);

    if (club == null)
    {
      throw new NotFoundException("Kullanıcıya ait kulüp bulunamadı.");
    }

    return club;
  }

  public void ClubMustBelongToCurrentUserOrAdmin(Club club, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    if (club.President == null || club.President.UserId != currentUserId)
    {
      throw new ForbiddenException("Bu kulüp için transfer işlemi yapma yetkiniz bulunmamaktadır.");
    }
  }

  public async Task<PlayerInstance> GetPlayerIfExistAsync(
    Guid playerInstanceId,
    Func<IQueryable<PlayerInstance>, IQueryable<PlayerInstance>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    PlayerInstance? player = await _playerInstanceRepository.GetByIdAsync(
      playerInstanceId,
      include,
      enableTracking,
      cancellationToken);

    if (player == null)
    {
      throw new NotFoundException($"{playerInstanceId} numaralı oyuncu bulunamadı.");
    }

    return player;
  }

  public async Task<TransferListing> GetListingIfExistAsync(
    Guid listingId,
    Func<IQueryable<TransferListing>, IQueryable<TransferListing>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    TransferListing? listing = await _transferListingRepository.GetByIdAsync(
      listingId,
      include,
      enableTracking,
      cancellationToken);

    if (listing == null)
    {
      throw new NotFoundException($"{listingId} numaralı transfer ilanı bulunamadı.");
    }

    return listing;
  }

  public async Task<TransferOffer> GetOfferIfExistAsync(
    Guid offerId,
    Func<IQueryable<TransferOffer>, IQueryable<TransferOffer>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    TransferOffer? offer = await _transferOfferRepository.GetByIdAsync(
      offerId,
      include,
      enableTracking,
      cancellationToken);

    if (offer == null)
    {
      throw new NotFoundException($"{offerId} numaralı transfer teklifi bulunamadı.");
    }

    return offer;
  }

  public void PlayerMustBelongToClub(PlayerInstance player, Guid clubId)
  {
    if (player.ClubId != clubId)
    {
      throw new BusinessException("Oyuncu bu kulübe ait değil.");
    }
  }

  public async Task EnsureNoActiveListingAsync(
    Guid playerInstanceId,
    CancellationToken cancellationToken = default)
  {
    bool hasActiveListing = await _transferListingRepository.AnyAsync(
      l => l.PlayerInstanceId == playerInstanceId && l.Status == TransferListingStatus.Active,
      cancellationToken);

    if (hasActiveListing)
    {
      throw new BusinessException("Bu oyuncu için zaten aktif bir transfer ilanı bulunmaktadır.");
    }
  }

  public async Task EnsureSellerKeepsMinimumSquadAsync(
    Guid clubId,
    CancellationToken cancellationToken = default)
  {
    int squadCount = await _playerInstanceRepository.CountByClubIdAsync(clubId, cancellationToken);

    if (squadCount <= MinimumSquadSize)
    {
      throw new BusinessException(
        $"Kulüpte en az {MinimumSquadSize} oyuncu kalmalıdır. Transfer ilanı oluşturulamaz.");
    }
  }

  public void ListingMustBeActive(TransferListing listing)
  {
    if (listing.Status != TransferListingStatus.Active)
    {
      throw new BusinessException("Yalnızca aktif transfer ilanları üzerinde işlem yapılabilir.");
    }
  }

  public void OfferMustBePending(TransferOffer offer)
  {
    if (offer.Status != TransferOfferStatus.Pending)
    {
      throw new BusinessException("Yalnızca bekleyen teklifler üzerinde işlem yapılabilir.");
    }
  }

  public void BuyerMustDifferFromSeller(Guid buyingClubId, Guid sellingClubId)
  {
    if (buyingClubId == sellingClubId)
    {
      throw new BusinessException("Kendi kulübünüze teklif veremezsiniz.");
    }
  }

  public async Task EnsureNoPendingOfferFromBuyerAsync(
    Guid listingId,
    Guid buyingClubId,
    CancellationToken cancellationToken = default)
  {
    bool hasPending = await _transferOfferRepository.AnyAsync(
      o =>
        o.TransferListingId == listingId &&
        o.BuyingClubId == buyingClubId &&
        o.Status == TransferOfferStatus.Pending,
      cancellationToken);

    if (hasPending)
    {
      throw new BusinessException("Bu ilan için zaten bekleyen bir teklifiniz bulunmaktadır.");
    }
  }

  public void BuyerMustAffordFee(Club buyingClub, decimal offerFee)
  {
    if (buyingClub.Cash < offerFee)
    {
      throw new BusinessException("Kulüp kasası bu transfer bedelini karşılamaya yetmiyor.");
    }
  }

  public async Task BuyerMustAffordWageAsync(
    Club buyingClub,
    decimal proposedWage,
    CancellationToken cancellationToken = default)
  {
    List<PlayerInstance> squad = await _playerInstanceRepository.GetAllAsync(
      filter: p => p.ClubId == buyingClub.Id,
      cancellationToken: cancellationToken);

    decimal currentWageBill = squad.Sum(p => p.Wage);
    decimal projectedWageBill = currentWageBill + proposedWage;

    if (projectedWageBill > buyingClub.WageBudget)
    {
      throw new BusinessException("Önerilen maaş kulübün maaş bütçesini aşıyor.");
    }
  }

  public void ClubMustBeAbleToSignFreeAgent(Club club)
  {
    if (club.LifecycleStatus != ClubLifecycleStatus.Tutorial
        && club.LifecycleStatus != ClubLifecycleStatus.Competitive)
    {
      throw new BusinessException(
        "Serbest ajan yalnızca tutorial veya rekabetçi kulüpler tarafından transfer edilebilir.");
    }
  }

  public async Task<BasePlayer> GetFreeAgentTemplateIfExistAsync(
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

    if (!basePlayer.IsFreeAgentTemplate || basePlayer.IsDraftOnly)
    {
      throw new BusinessException("Bu oyuncu serbest ajan piyasasında mevcut değil.");
    }

    return basePlayer;
  }

  public async Task EnsureTemplateNotInClubSquadAsync(
    Guid clubId,
    Guid basePlayerId,
    CancellationToken cancellationToken = default)
  {
    bool alreadySigned = await _playerInstanceRepository.AnyAsync(
      p => p.ClubId == clubId && p.BasePlayerId == basePlayerId,
      cancellationToken);

    if (alreadySigned)
    {
      throw new BusinessException("Bu oyuncu zaten kulübünüzde.");
    }
  }

  public Func<IQueryable<TransferListing>, IQueryable<TransferListing>> ListingDetailInclude()
  {
    return query => query
      .Include(l => l.Club)
      .Include(l => l.PlayerInstance)
      .Include(l => l.Offers);
  }

  public Func<IQueryable<TransferOffer>, IQueryable<TransferOffer>> OfferDetailInclude()
  {
    return query => query
      .Include(o => o.BuyingClub)
      .Include(o => o.TransferListing)
        .ThenInclude(l => l.Club)
      .Include(o => o.TransferListing)
        .ThenInclude(l => l.PlayerInstance);
  }
}
