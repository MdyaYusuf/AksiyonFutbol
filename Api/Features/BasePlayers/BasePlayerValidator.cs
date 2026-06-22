using FluentValidation;

namespace Api.Features.BasePlayers;

public class CreateBasePlayerRequestValidator : AbstractValidator<CreateBasePlayerRequest>
{
  public CreateBasePlayerRequestValidator()
  {
    RuleFor(bp => bp.DefaultFirstName)
      .NotEmpty().WithMessage("Oyuncu adı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu adı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu adı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.DefaultLastName)
      .NotEmpty().WithMessage("Oyuncu soyadı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu soyadı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu soyadı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Nationality)
      .MaximumLength(50).WithMessage("Uyruk 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Position)
      .IsInEnum().WithMessage("Geçersiz oyuncu pozisyonu.");

    RuleFor(bp => bp.Age)
      .InclusiveBetween(16, 40).WithMessage("Oyuncu yaşı 16 ile 40 arasında olmalıdır.");

    RuleFor(bp => bp.AttackPower)
      .InclusiveBetween(1, 100).WithMessage("Hücum gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(bp => bp.DefenseStrength)
      .InclusiveBetween(1, 100).WithMessage("Savunma gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(bp => bp.MidfieldControl)
      .InclusiveBetween(1, 100).WithMessage("Orta saha kontrolü 1 ile 100 arasında olmalıdır.");
  }
}

public class UpdateBasePlayerRequestValidator : AbstractValidator<UpdateBasePlayerRequest>
{
  public UpdateBasePlayerRequestValidator()
  {
    RuleFor(bp => bp.Id)
      .NotEmpty().WithMessage("Geçersiz oyuncu şablonu ID.");

    RuleFor(bp => bp.DefaultFirstName)
      .NotEmpty().WithMessage("Oyuncu adı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu adı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu adı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.DefaultLastName)
      .NotEmpty().WithMessage("Oyuncu soyadı boş olamaz.")
      .MinimumLength(2).WithMessage("Oyuncu soyadı en az 2 karakter olmalıdır.")
      .MaximumLength(50).WithMessage("Oyuncu soyadı 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Nationality)
      .MaximumLength(50).WithMessage("Uyruk 50 karakterden uzun olamaz.");

    RuleFor(bp => bp.Position)
      .IsInEnum().WithMessage("Geçersiz oyuncu pozisyonu.");

    RuleFor(bp => bp.Age)
      .InclusiveBetween(16, 40).WithMessage("Oyuncu yaşı 16 ile 40 arasında olmalıdır.");

    RuleFor(bp => bp.AttackPower)
      .InclusiveBetween(1, 100).WithMessage("Hücum gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(bp => bp.DefenseStrength)
      .InclusiveBetween(1, 100).WithMessage("Savunma gücü 1 ile 100 arasında olmalıdır.");

    RuleFor(bp => bp.MidfieldControl)
      .InclusiveBetween(1, 100).WithMessage("Orta saha kontrolü 1 ile 100 arasında olmalıdır.");
  }
}
