using FluentValidation;

namespace Api.Features.Clubs;

public class CreateClubRequestValidator : AbstractValidator<CreateClubRequest>
{
  public CreateClubRequestValidator()
  {
    RuleFor(c => c.Name)
      .NotEmpty().WithMessage("Kulüp adı boş olamaz.")
      .MinimumLength(2).WithMessage("Kulüp adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Kulüp adı 100 karakterden uzun olamaz.");
  }
}

public class CreateBotClubRequestValidator : AbstractValidator<CreateBotClubRequest>
{
  public CreateBotClubRequestValidator()
  {
    RuleFor(c => c.Name)
      .NotEmpty().WithMessage("Kulüp adı boş olamaz.")
      .MinimumLength(2).WithMessage("Kulüp adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Kulüp adı 100 karakterden uzun olamaz.");

    RuleFor(c => c.DivisionId)
      .GreaterThan(0).WithMessage("Geçersiz lig ID.");

    RuleFor(c => c.Cash)
      .GreaterThanOrEqualTo(0).WithMessage("Kulüp kasası negatif olamaz.");

    RuleFor(c => c.WageBudget)
      .GreaterThanOrEqualTo(0).WithMessage("Maaş bütçesi negatif olamaz.");

    RuleFor(c => c.Morale)
      .InclusiveBetween(0, 100).WithMessage("Moral 0 ile 100 arasında olmalıdır.");

    RuleFor(c => c.Chemistry)
      .InclusiveBetween(0, 100).WithMessage("Takım uyumu 0 ile 100 arasında olmalıdır.");

    RuleFor(c => c.Discipline)
      .InclusiveBetween(0, 100).WithMessage("Disiplin 0 ile 100 arasında olmalıdır.");
  }
}

public class UpdateClubRequestValidator : AbstractValidator<UpdateClubRequest>
{
  public UpdateClubRequestValidator()
  {
    RuleFor(c => c.Id)
      .NotEmpty().WithMessage("Geçersiz kulüp ID.");

    RuleFor(c => c.Name)
      .NotEmpty().WithMessage("Kulüp adı boş olamaz.")
      .MinimumLength(2).WithMessage("Kulüp adı en az 2 karakter olmalıdır.")
      .MaximumLength(100).WithMessage("Kulüp adı 100 karakterden uzun olamaz.");
  }
}

public class UpdateClubFinancesRequestValidator : AbstractValidator<UpdateClubFinancesRequest>
{
  public UpdateClubFinancesRequestValidator()
  {
    RuleFor(c => c.Id)
      .NotEmpty().WithMessage("Geçersiz kulüp ID.");

    RuleFor(c => c.Cash)
      .GreaterThanOrEqualTo(0).WithMessage("Kulüp kasası negatif olamaz.");

    RuleFor(c => c.WageBudget)
      .GreaterThanOrEqualTo(0).WithMessage("Maaş bütçesi negatif olamaz.");
  }
}

public class UpdateClubStatusRequestValidator : AbstractValidator<UpdateClubStatusRequest>
{
  public UpdateClubStatusRequestValidator()
  {
    RuleFor(c => c.Id)
      .NotEmpty().WithMessage("Geçersiz kulüp ID.");

    RuleFor(c => c.Morale)
      .InclusiveBetween(0, 100).WithMessage("Moral 0 ile 100 arasında olmalıdır.");

    RuleFor(c => c.Chemistry)
      .InclusiveBetween(0, 100).WithMessage("Takım uyumu 0 ile 100 arasında olmalıdır.");

    RuleFor(c => c.Discipline)
      .InclusiveBetween(0, 100).WithMessage("Disiplin 0 ile 100 arasında olmalıdır.");
  }
}
