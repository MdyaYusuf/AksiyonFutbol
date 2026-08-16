using FluentValidation;

namespace Api.Features.ClubDrafts;

public class AddClubDraftPickRequestValidator : AbstractValidator<AddClubDraftPickRequest>
{
  public AddClubDraftPickRequestValidator()
  {
    RuleFor(r => r.BasePlayerId)
      .NotEmpty()
      .WithMessage("Geçersiz oyuncu şablonu ID.");
  }
}
