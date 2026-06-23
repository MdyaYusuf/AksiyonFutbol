using Api.Core.Options;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Api.Features.Matches;

public class CreateMatchRequestValidator : AbstractValidator<CreateMatchRequest>
{
  public CreateMatchRequestValidator(IOptions<GameOptions> gameOptions)
  {
    RuleFor(m => m.DivisionId)
      .GreaterThan(0).WithMessage("Geçersiz lig ID.");

    RuleFor(m => m.MatchWeek)
      .InclusiveBetween(gameOptions.Value.MinimumMatchWeek, gameOptions.Value.MaximumMatchWeek)
      .WithMessage($"Maç haftası {gameOptions.Value.MinimumMatchWeek} ile {gameOptions.Value.MaximumMatchWeek} arasında olmalıdır.");

    RuleFor(m => m.HomeClubId)
      .NotEmpty().WithMessage("Geçersiz ev sahibi kulüp ID.");

    RuleFor(m => m.AwayClubId)
      .NotEmpty().WithMessage("Geçersiz deplasman kulübü ID.");

    RuleFor(m => m.AwayClubId)
      .NotEqual(m => m.HomeClubId).WithMessage("Ev sahibi ve deplasman kulübü aynı olamaz.");

    RuleFor(m => m.RefereeId)
      .GreaterThan(0).When(m => m.RefereeId.HasValue)
      .WithMessage("Geçersiz hakem ID.");

    RuleFor(m => m.MatchDate)
      .NotEmpty().WithMessage("Maç tarihi zorunludur.");
  }
}

public class UpdateMatchScheduleRequestValidator : AbstractValidator<UpdateMatchScheduleRequest>
{
  public UpdateMatchScheduleRequestValidator(IOptions<GameOptions> gameOptions)
  {
    RuleFor(m => m.Id)
      .NotEmpty().WithMessage("Geçersiz maç ID.");

    RuleFor(m => m.DivisionId)
      .GreaterThan(0).WithMessage("Geçersiz lig ID.");

    RuleFor(m => m.MatchWeek)
      .InclusiveBetween(gameOptions.Value.MinimumMatchWeek, gameOptions.Value.MaximumMatchWeek)
      .WithMessage($"Maç haftası {gameOptions.Value.MinimumMatchWeek} ile {gameOptions.Value.MaximumMatchWeek} arasında olmalıdır.");

    RuleFor(m => m.HomeClubId)
      .NotEmpty().WithMessage("Geçersiz ev sahibi kulüp ID.");

    RuleFor(m => m.AwayClubId)
      .NotEmpty().WithMessage("Geçersiz deplasman kulübü ID.");

    RuleFor(m => m.AwayClubId)
      .NotEqual(m => m.HomeClubId).WithMessage("Ev sahibi ve deplasman kulübü aynı olamaz.");

    RuleFor(m => m.RefereeId)
      .GreaterThan(0).When(m => m.RefereeId.HasValue)
      .WithMessage("Geçersiz hakem ID.");

    RuleFor(m => m.MatchDate)
      .NotEmpty().WithMessage("Maç tarihi zorunludur.");
  }
}
