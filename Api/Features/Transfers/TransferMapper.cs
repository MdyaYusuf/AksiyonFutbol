using Api.Core.Options;
using Api.Features.BasePlayers;
using Api.Features.PlayerInstances;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Transfers;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class TransferMapper
{
  public FreeAgentMarketItemDto BasePlayerToFreeAgentMarketItemDto(
    BasePlayer basePlayer,
    GameOptions options)
  {
    int overall = BasePlayerRatingCalculator.Calculate(basePlayer);
    decimal estimatedWage = overall * options.StarterWagePerOverall;
    decimal estimatedMarketValue = overall * options.StarterMarketValuePerOverall;

    return new FreeAgentMarketItemDto
    {
      BasePlayerId = basePlayer.Id,
      FirstName = basePlayer.DefaultFirstName,
      LastName = basePlayer.DefaultLastName,
      Position = basePlayer.Position.ToString(),
      Age = basePlayer.Age,
      OverallRating = overall,
      DraftTier = basePlayer.DraftTier,
      SigningFee = basePlayer.DraftFee,
      EstimatedWage = estimatedWage,
      EstimatedMarketValue = estimatedMarketValue
    };
  }

  public TransferMarketItemDto ListingToMarketItemDto(TransferListing listing)
  {
    PlayerInstance player = listing.PlayerInstance;

    return new TransferMarketItemDto
    {
      ListingId = listing.Id,
      PlayerInstanceId = player.Id,
      FirstName = player.FirstName,
      LastName = player.LastName,
      Position = player.Position.ToString(),
      Age = player.Age,
      OverallRating = PlayerInstanceRatingCalculator.Calculate(player),
      MarketValue = player.MarketValue,
      Wage = player.Wage,
      IsInjured = player.IsInjured,
      AskingPrice = listing.AskingPrice,
      SellingClubId = listing.ClubId,
      SellingClubName = listing.Club.Name,
      ListedAt = listing.CreatedDate
    };
  }

  public TransferListingResponseDto ListingToResponseDto(TransferListing listing)
  {
    PlayerInstance player = listing.PlayerInstance;

    return new TransferListingResponseDto
    {
      Id = listing.Id,
      PlayerInstanceId = player.Id,
      FirstName = player.FirstName,
      LastName = player.LastName,
      Position = player.Position.ToString(),
      OverallRating = PlayerInstanceRatingCalculator.Calculate(player),
      MarketValue = player.MarketValue,
      AskingPrice = listing.AskingPrice,
      Status = listing.Status,
      ClubId = listing.ClubId,
      ClubName = listing.Club.Name,
      PendingOfferCount = listing.Offers.Count(o => o.Status == TransferOfferStatus.Pending),
      CreatedDate = listing.CreatedDate,
      UpdatedDate = listing.UpdatedDate
    };
  }

  public TransferOfferResponseDto OfferToResponseDto(TransferOffer offer)
  {
    TransferListing listing = offer.TransferListing;
    PlayerInstance player = listing.PlayerInstance;

    return new TransferOfferResponseDto
    {
      Id = offer.Id,
      TransferListingId = listing.Id,
      PlayerInstanceId = player.Id,
      FirstName = player.FirstName,
      LastName = player.LastName,
      Position = player.Position.ToString(),
      OverallRating = PlayerInstanceRatingCalculator.Calculate(player),
      AskingPrice = listing.AskingPrice,
      OfferFee = offer.OfferFee,
      ProposedWage = offer.ProposedWage,
      Status = offer.Status,
      SellingClubId = listing.ClubId,
      SellingClubName = listing.Club.Name,
      BuyingClubId = offer.BuyingClubId,
      BuyingClubName = offer.BuyingClub.Name,
      CreatedDate = offer.CreatedDate,
      UpdatedDate = offer.UpdatedDate
    };
  }
}
