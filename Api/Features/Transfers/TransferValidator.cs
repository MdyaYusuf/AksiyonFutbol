using FluentValidation;

namespace Api.Features.Transfers;

public class CreateTransferListingRequestValidator : AbstractValidator<CreateTransferListingRequest>
{
  public CreateTransferListingRequestValidator()
  {
    RuleFor(x => x.PlayerInstanceId)
      .NotEmpty()
      .WithMessage("Oyuncu seçimi zorunludur.");

    RuleFor(x => x.AskingPrice)
      .GreaterThan(0)
      .WithMessage("İstenen transfer bedeli 0'dan büyük olmalıdır.");
  }
}

public class CreateTransferOfferRequestValidator : AbstractValidator<CreateTransferOfferRequest>
{
  public CreateTransferOfferRequestValidator()
  {
    RuleFor(x => x.TransferListingId)
      .NotEmpty()
      .WithMessage("İlan seçimi zorunludur.");

    RuleFor(x => x.OfferFee)
      .GreaterThan(0)
      .WithMessage("Teklif bedeli 0'dan büyük olmalıdır.");

    RuleFor(x => x.ProposedWage)
      .GreaterThanOrEqualTo(0)
      .WithMessage("Önerilen maaş negatif olamaz.");
  }
}
