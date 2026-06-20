using FluentValidation;

namespace Api.Features.ClubPresidents;

public class CreateClubPresidentRequestValidator : AbstractValidator<CreateClubPresidentRequest>
{
  public CreateClubPresidentRequestValidator()
  {
    RuleFor(cp => cp.Name)
      .NotEmpty().WithMessage("Başkan adı boş olamaz.")
      .MinimumLength(3).WithMessage("Başkan adı en az 3 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Başkan adı 100 karakterden uzun olamaz.");

    RuleFor(cp => cp.Title)
      .MaximumLength(50).WithMessage("Başkan unvanı 50 karakterden uzun olamaz.");
  }
}

public class UpdateClubPresidentRequestValidator : AbstractValidator<UpdateClubPresidentRequest>
{
  public UpdateClubPresidentRequestValidator()
  {
    RuleFor(cp => cp.Id)
      .NotEmpty().WithMessage("Geçersiz başkan ID.");

    RuleFor(cp => cp.Name)
      .NotEmpty().WithMessage("Başkan adı boş olamaz.")
      .MinimumLength(3).WithMessage("Başkan adı en az 3 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Başkan adı 100 karakterden uzun olamaz.");

    RuleFor(cp => cp.Title)
      .MaximumLength(50).WithMessage("Başkan unvanı 50 karakterden uzun olamaz.");
  }
}

public class UpdateClubPresidentReputationRequestValidator : AbstractValidator<UpdateClubPresidentReputationRequest>
{
  public UpdateClubPresidentReputationRequestValidator()
  {
    RuleFor(cp => cp.Id)
      .NotEmpty().WithMessage("Geçersiz başkan ID.");

    RuleFor(cp => cp.ReputationPoints)
      .GreaterThanOrEqualTo(0).WithMessage("İtibar puanı negatif olamaz.");
  }
}
