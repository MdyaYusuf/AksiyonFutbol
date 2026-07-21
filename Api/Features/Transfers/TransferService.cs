using Api.Core.Exceptions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.BasePlayers;
using Api.Features.ClubLineups;
using Api.Features.Clubs;
using Api.Features.PlayerInstances;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Transfers;

public class TransferService(
  ITransferListingRepository _transferListingRepository,
  ITransferOfferRepository _transferOfferRepository,
  IPlayerInstanceRepository _playerInstanceRepository,
  IClubRepository _clubRepository,
  IClubLineupSelectionRepository _clubLineupSelectionRepository,
  TransferBusinessRules _businessRules,
  TransferMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<CreateTransferListingRequest> _createListingValidator,
  IValidator<CreateTransferOfferRequest> _createOfferValidator) : ITransferService
{
  public async Task<ReturnModel<List<TransferMarketItemDto>>> GetMarketAsync(
    TransferMarketQuery query,
    CancellationToken cancellationToken = default)
  {
    List<TransferListing> listings = await _transferListingRepository.GetAllAsync(
      filter: l => l.Status == TransferListingStatus.Active,
      include: q => q
        .Include(l => l.Club)
        .Include(l => l.PlayerInstance),
      cancellationToken: cancellationToken);

    IEnumerable<TransferListing> filtered = listings;

    if (query.Position is PlayerPosition position)
    {
      filtered = filtered.Where(l => l.PlayerInstance.Position == position);
    }

    if (!string.IsNullOrWhiteSpace(query.Search))
    {
      string search = query.Search.Trim();
      filtered = filtered.Where(l =>
        l.PlayerInstance.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
        l.PlayerInstance.LastName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
        l.Club.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
    }

    filtered = ApplyMarketSort(filtered, query);

    List<TransferMarketItemDto> items = filtered
      .Select(_mapper.ListingToMarketItemDto)
      .ToList();

    return new ReturnModel<List<TransferMarketItemDto>>()
    {
      Success = true,
      Message = "Transfer piyasası başarılı bir şekilde getirildi.",
      Data = items,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<List<TransferListingResponseDto>>> GetMyListingsAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(currentUserId, cancellationToken: cancellationToken);

    List<TransferListing> listings = await _transferListingRepository.GetAllAsync(
      filter: l => l.ClubId == club.Id,
      include: _businessRules.ListingDetailInclude(),
      orderBy: q => q.OrderByDescending(l => l.CreatedDate),
      cancellationToken: cancellationToken);

    List<TransferListingResponseDto> response = listings
      .Select(_mapper.ListingToResponseDto)
      .ToList();

    return new ReturnModel<List<TransferListingResponseDto>>()
    {
      Success = true,
      Message = "Kulüp transfer ilanları başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<TransferListingResponseDto>> CreateListingAsync(
    CreateTransferListingRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _createListingValidator.ValidateAndThrowAsync(request, cancellationToken);

    Club club = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: q => q.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    PlayerInstance player = await _businessRules.GetPlayerIfExistAsync(
      request.PlayerInstanceId,
      enableTracking: false,
      cancellationToken: cancellationToken);

    _businessRules.PlayerMustBelongToClub(player, club.Id);
    await _businessRules.EnsureNoActiveListingAsync(player.Id, cancellationToken);
    await _businessRules.EnsureSellerKeepsMinimumSquadAsync(club.Id, cancellationToken);

    TransferListing listing = new()
    {
      PlayerInstanceId = player.Id,
      ClubId = club.Id,
      AskingPrice = request.AskingPrice,
      Status = TransferListingStatus.Active
    };

    await _transferListingRepository.AddAsync(listing, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    TransferListing created = await _businessRules.GetListingIfExistAsync(
      listing.Id,
      include: _businessRules.ListingDetailInclude(),
      cancellationToken: cancellationToken);

    return new ReturnModel<TransferListingResponseDto>()
    {
      Success = true,
      Message = "Transfer ilanı başarılı bir şekilde oluşturuldu.",
      Data = _mapper.ListingToResponseDto(created),
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<TransferListingResponseDto>> WithdrawListingAsync(
    Guid listingId,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(currentUserId, cancellationToken: cancellationToken);

    TransferListing listing = await _businessRules.GetListingIfExistAsync(
      listingId,
      include: _businessRules.ListingDetailInclude(),
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (listing.ClubId != club.Id)
    {
      throw new ForbiddenException("Bu transfer ilanını geri çekme yetkiniz bulunmamaktadır.");
    }

    _businessRules.ListingMustBeActive(listing);

    listing.Status = TransferListingStatus.Withdrawn;
    listing.UpdatedDate = DateTime.UtcNow;

    List<TransferOffer> pendingOffers = listing.Offers
      .Where(o => o.Status == TransferOfferStatus.Pending)
      .ToList();

    foreach (TransferOffer offer in pendingOffers)
    {
      offer.Status = TransferOfferStatus.Cancelled;
      offer.UpdatedDate = DateTime.UtcNow;
      _transferOfferRepository.Update(offer);
    }

    _transferListingRepository.Update(listing);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<TransferListingResponseDto>()
    {
      Success = true,
      Message = "Transfer ilanı başarıyla geri çekildi.",
      Data = _mapper.ListingToResponseDto(listing),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<TransferDealsResponseDto>> GetMyDealsAsync(
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(currentUserId, cancellationToken: cancellationToken);

    List<TransferOffer> offers = await _transferOfferRepository.GetAllAsync(
      filter: o => o.BuyingClubId == club.Id || o.TransferListing.ClubId == club.Id,
      include: _businessRules.OfferDetailInclude(),
      orderBy: q => q.OrderByDescending(o => o.CreatedDate),
      cancellationToken: cancellationToken);

    List<TransferOfferResponseDto> incoming = offers
      .Where(o => o.TransferListing.ClubId == club.Id)
      .Select(_mapper.OfferToResponseDto)
      .ToList();

    List<TransferOfferResponseDto> outgoing = offers
      .Where(o => o.BuyingClubId == club.Id)
      .Select(_mapper.OfferToResponseDto)
      .ToList();

    return new ReturnModel<TransferDealsResponseDto>()
    {
      Success = true,
      Message = "Transfer teklifleri başarılı bir şekilde getirildi.",
      Data = new TransferDealsResponseDto
      {
        IncomingOffers = incoming,
        OutgoingOffers = outgoing
      },
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<TransferOfferResponseDto>> CreateOfferAsync(
    CreateTransferOfferRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    await _createOfferValidator.ValidateAndThrowAsync(request, cancellationToken);

    Club buyingClub = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      include: q => q.Include(c => c.President),
      enableTracking: true,
      cancellationToken: cancellationToken);

    TransferListing listing = await _businessRules.GetListingIfExistAsync(
      request.TransferListingId,
      include: _businessRules.ListingDetailInclude(),
      cancellationToken: cancellationToken);

    _businessRules.ListingMustBeActive(listing);
    _businessRules.BuyerMustDifferFromSeller(buyingClub.Id, listing.ClubId);
    await _businessRules.EnsureNoPendingOfferFromBuyerAsync(listing.Id, buyingClub.Id, cancellationToken);
    _businessRules.BuyerMustAffordFee(buyingClub, request.OfferFee);
    await _businessRules.BuyerMustAffordWageAsync(buyingClub, request.ProposedWage, cancellationToken);

    TransferOffer offer = new()
    {
      TransferListingId = listing.Id,
      BuyingClubId = buyingClub.Id,
      OfferFee = request.OfferFee,
      ProposedWage = request.ProposedWage,
      Status = TransferOfferStatus.Pending
    };

    await _transferOfferRepository.AddAsync(offer, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    TransferOffer created = await _businessRules.GetOfferIfExistAsync(
      offer.Id,
      include: _businessRules.OfferDetailInclude(),
      cancellationToken: cancellationToken);

    return new ReturnModel<TransferOfferResponseDto>()
    {
      Success = true,
      Message = "Transfer teklifi başarılı bir şekilde oluşturuldu.",
      Data = _mapper.OfferToResponseDto(created),
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<TransferOfferResponseDto>> WithdrawOfferAsync(
    Guid offerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club club = await _businessRules.GetClubByUserIdIfExistAsync(currentUserId, cancellationToken: cancellationToken);

    TransferOffer offer = await _businessRules.GetOfferIfExistAsync(
      offerId,
      include: _businessRules.OfferDetailInclude(),
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (offer.BuyingClubId != club.Id)
    {
      throw new ForbiddenException("Bu teklifi geri çekme yetkiniz bulunmamaktadır.");
    }

    _businessRules.OfferMustBePending(offer);

    offer.Status = TransferOfferStatus.Withdrawn;
    offer.UpdatedDate = DateTime.UtcNow;
    _transferOfferRepository.Update(offer);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<TransferOfferResponseDto>()
    {
      Success = true,
      Message = "Transfer teklifi başarıyla geri çekildi.",
      Data = _mapper.OfferToResponseDto(offer),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<TransferOfferResponseDto>> AcceptOfferAsync(
    Guid offerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club sellingClub = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    TransferOffer offer = await _businessRules.GetOfferIfExistAsync(
      offerId,
      include: _businessRules.OfferDetailInclude(),
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (offer.TransferListing.ClubId != sellingClub.Id)
    {
      throw new ForbiddenException("Bu teklifi kabul etme yetkiniz bulunmamaktadır.");
    }

    _businessRules.OfferMustBePending(offer);
    _businessRules.ListingMustBeActive(offer.TransferListing);

    Club buyingClub = await _businessRules.GetClubIfExistAsync(
      offer.BuyingClubId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    PlayerInstance player = await _businessRules.GetPlayerIfExistAsync(
      offer.TransferListing.PlayerInstanceId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.PlayerMustBelongToClub(player, sellingClub.Id);
    await _businessRules.EnsureSellerKeepsMinimumSquadAsync(sellingClub.Id, cancellationToken);
    _businessRules.BuyerMustAffordFee(buyingClub, offer.OfferFee);
    await _businessRules.BuyerMustAffordWageAsync(buyingClub, offer.ProposedWage, cancellationToken);

    buyingClub.Cash -= offer.OfferFee;
    sellingClub.Cash += offer.OfferFee;

    player.ClubId = buyingClub.Id;
    player.Wage = offer.ProposedWage;
    player.UpdatedDate = DateTime.UtcNow;

    offer.Status = TransferOfferStatus.Accepted;
    offer.UpdatedDate = DateTime.UtcNow;

    TransferListing listing = offer.TransferListing;
    listing.Status = TransferListingStatus.Completed;
    listing.UpdatedDate = DateTime.UtcNow;

    foreach (TransferOffer otherOffer in listing.Offers.Where(o =>
      o.Id != offer.Id && o.Status == TransferOfferStatus.Pending))
    {
      otherOffer.Status = TransferOfferStatus.Cancelled;
      otherOffer.UpdatedDate = DateTime.UtcNow;
      _transferOfferRepository.Update(otherOffer);
    }

    await RemovePlayerFromSellerLineupAsync(player.Id, cancellationToken);

    _clubRepository.Update(buyingClub);
    _clubRepository.Update(sellingClub);
    _playerInstanceRepository.Update(player);
    _transferOfferRepository.Update(offer);
    _transferListingRepository.Update(listing);

    await _unitOfWork.SaveChangesAsync(cancellationToken);

    TransferOffer accepted = await _businessRules.GetOfferIfExistAsync(
      offer.Id,
      include: _businessRules.OfferDetailInclude(),
      cancellationToken: cancellationToken);

    return new ReturnModel<TransferOfferResponseDto>()
    {
      Success = true,
      Message = "Transfer teklifi kabul edildi. Oyuncu yeni kulübüne transfer edildi.",
      Data = _mapper.OfferToResponseDto(accepted),
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<TransferOfferResponseDto>> RejectOfferAsync(
    Guid offerId,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    Club sellingClub = await _businessRules.GetClubByUserIdIfExistAsync(
      currentUserId,
      cancellationToken: cancellationToken);

    TransferOffer offer = await _businessRules.GetOfferIfExistAsync(
      offerId,
      include: _businessRules.OfferDetailInclude(),
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (offer.TransferListing.ClubId != sellingClub.Id)
    {
      throw new ForbiddenException("Bu teklifi reddetme yetkiniz bulunmamaktadır.");
    }

    _businessRules.OfferMustBePending(offer);

    offer.Status = TransferOfferStatus.Rejected;
    offer.UpdatedDate = DateTime.UtcNow;
    _transferOfferRepository.Update(offer);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<TransferOfferResponseDto>()
    {
      Success = true,
      Message = "Transfer teklifi reddedildi.",
      Data = _mapper.OfferToResponseDto(offer),
      StatusCode = 200
    };
  }

  private async Task RemovePlayerFromSellerLineupAsync(
    Guid playerInstanceId,
    CancellationToken cancellationToken)
  {
    List<ClubLineupSelection> selections = await _clubLineupSelectionRepository.GetAllAsync(
      filter: s => s.PlayerInstanceId == playerInstanceId,
      enableTracking: true,
      cancellationToken: cancellationToken);

    if (selections.Count == 0)
    {
      return;
    }

    _clubLineupSelectionRepository.DeleteRange(selections);
  }

  private static IEnumerable<TransferListing> ApplyMarketSort(
    IEnumerable<TransferListing> listings,
    TransferMarketQuery query)
  {
    string sortBy = query.SortBy?.Trim().ToLowerInvariant() ?? "askingprice";

    Func<TransferListing, object> keySelector = sortBy switch
    {
      "wage" => l => l.PlayerInstance.Wage,
      "age" => l => l.PlayerInstance.Age,
      "overall" or "rating" => l => PlayerInstanceRatingCalculator.Calculate(l.PlayerInstance),
      "marketvalue" or "value" => l => l.PlayerInstance.MarketValue,
      "name" => l => l.PlayerInstance.LastName,
      _ => l => l.AskingPrice
    };

    return query.SortDescending
      ? listings.OrderByDescending(keySelector)
      : listings.OrderBy(keySelector);
  }
}
