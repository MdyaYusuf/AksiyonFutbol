using Api.Features.PlayerInstances;
using FluentValidation;
using Microsoft.Extensions.Options;
using Api.Core.Options;

namespace Api.Features.ClubLineups;

public class UpsertClubLineupRequestValidator : AbstractValidator<UpsertClubLineupRequest>
{
  public UpsertClubLineupRequestValidator(IOptions<GameOptions> gameOptions)
  {
    GameOptions options = gameOptions.Value;
    int starterCount = options.LineupStarterCount;
    int maxBench = options.LineupMaxBenchSize;

    RuleFor(x => x.Formation)
      .IsInEnum()
      .WithMessage("Geçersiz formasyon seçildi.");

    RuleFor(x => x.Mentality)
      .IsInEnum()
      .WithMessage("Geçersiz oyun anlayışı seçildi.");

    RuleFor(x => x.StarterPlayerIds)
      .NotNull()
      .WithMessage("İlk 11 listesi zorunludur.")
      .Must(ids => ids.Count == starterCount)
      .WithMessage($"İlk 11 tam olarak {starterCount} oyuncu içermelidir.")
      .Must(ids => ids.Distinct().Count() == ids.Count)
      .WithMessage("İlk 11 içinde aynı oyuncu birden fazla seçilemez.");

    RuleFor(x => x.BenchPlayerIds)
      .NotNull()
      .WithMessage("Yedek listesi zorunludur.")
      .Must(ids => ids.Count <= maxBench)
      .WithMessage($"Yedek kulübesi en fazla {maxBench} oyuncu olabilir.")
      .Must(ids => ids.Distinct().Count() == ids.Count)
      .WithMessage("Yedek listesinde aynı oyuncu birden fazla seçilemez.");

    RuleFor(x => x)
      .Must(x => x.StarterPlayerIds.Intersect(x.BenchPlayerIds).Count() == 0)
      .WithMessage("Aynı oyuncu hem ilk 11'de hem yedeklerde olamaz.");
  }
}
