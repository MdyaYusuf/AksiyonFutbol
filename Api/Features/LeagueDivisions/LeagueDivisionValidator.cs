using Api.Core.Options;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Api.Features.LeagueDivisions;

public class CreateLeagueDivisionRequestValidator : AbstractValidator<CreateLeagueDivisionRequest>
{
  public CreateLeagueDivisionRequestValidator()
  {
    RuleFor(ld => ld.Name)
      .NotEmpty().WithMessage("Lig adı boş olamaz.")
      .MinimumLength(2).WithMessage("Lig adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Lig adı 100 karakterden uzun olamaz.");

    RuleFor(ld => ld.Tier)
      .GreaterThan(0).WithMessage("Lig seviyesi 1 veya daha büyük olmalıdır.");

    RuleFor(ld => ld.GroupNumber)
      .GreaterThan(0).WithMessage("Grup numarası 1 veya daha büyük olmalıdır.");
  }
}

public class UpdateLeagueDivisionRequestValidator : AbstractValidator<UpdateLeagueDivisionRequest>
{
  public UpdateLeagueDivisionRequestValidator()
  {
    RuleFor(ld => ld.Id)
      .GreaterThan(0).WithMessage("Geçersiz lig ID.");

    RuleFor(ld => ld.Name)
      .NotEmpty().WithMessage("Lig adı boş olamaz.")
      .MinimumLength(2).WithMessage("Lig adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Lig adı 100 karakterden uzun olamaz.");

    RuleFor(ld => ld.Tier)
      .GreaterThan(0).WithMessage("Lig seviyesi 1 veya daha büyük olmalıdır.");

    RuleFor(ld => ld.GroupNumber)
      .GreaterThan(0).WithMessage("Grup numarası 1 veya daha büyük olmalıdır.");
  }
}

public class UpdateLeagueDivisionMatchWeekRequestValidator : AbstractValidator<UpdateLeagueDivisionMatchWeekRequest>
{
  public UpdateLeagueDivisionMatchWeekRequestValidator(IOptions<GameOptions> gameOptions)
  {
    RuleFor(ld => ld.Id)
      .GreaterThan(0).WithMessage("Geçersiz lig ID.");

    RuleFor(ld => ld.CurrentMatchWeek)
      .InclusiveBetween(gameOptions.Value.MinimumMatchWeek, gameOptions.Value.MaximumMatchWeek)
      .WithMessage($"Maç haftası {gameOptions.Value.MinimumMatchWeek} ile {gameOptions.Value.MaximumMatchWeek} arasında olmalıdır.");
  }
}
