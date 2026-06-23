using FluentValidation;

namespace Api.Features.Referees;

public class CreateRefereeRequestValidator : AbstractValidator<CreateRefereeRequest>
{
  public CreateRefereeRequestValidator()
  {
    RuleFor(r => r.Name)
      .NotEmpty().WithMessage("Hakem adı boş olamaz.")
      .MinimumLength(2).WithMessage("Hakem adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Hakem adı 100 karakterden uzun olamaz.");

    RuleFor(r => r.BriberyDifficulty)
      .InclusiveBetween(1, 100).WithMessage("Rüşvet zorluğu 1 ile 100 arasında olmalıdır.");

    RuleFor(r => r.PersonalityType)
      .IsInEnum().WithMessage("Geçersiz hakem karakter tipi.");

    RuleFor(r => r.Biography)
      .MaximumLength(1000).WithMessage("Hakem biyografisi 1000 karakterden uzun olamaz.");
  }
}

public class UpdateRefereeRequestValidator : AbstractValidator<UpdateRefereeRequest>
{
  public UpdateRefereeRequestValidator()
  {
    RuleFor(r => r.Id)
      .GreaterThan(0).WithMessage("Geçersiz hakem ID.");

    RuleFor(r => r.Name)
      .NotEmpty().WithMessage("Hakem adı boş olamaz.")
      .MinimumLength(2).WithMessage("Hakem adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Hakem adı 100 karakterden uzun olamaz.");

    RuleFor(r => r.BriberyDifficulty)
      .InclusiveBetween(1, 100).WithMessage("Rüşvet zorluğu 1 ile 100 arasında olmalıdır.");

    RuleFor(r => r.PersonalityType)
      .IsInEnum().WithMessage("Geçersiz hakem karakter tipi.");

    RuleFor(r => r.Biography)
      .MaximumLength(1000).WithMessage("Hakem biyografisi 1000 karakterden uzun olamaz.");
  }
}
