using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Api.Features.Matches;

public static class MatchRegistration
{
  public static IServiceCollection AddMatchDependencies(this IServiceCollection services)
  {
    services.AddScoped<IMatchRepository, EfMatchRepository>();
    services.AddScoped<MatchBusinessRules>();
    services.AddScoped<IMatchSimulationService, MatchSimulationService>();
    services.AddScoped<IMatchService, MatchService>();
    services.TryAddScoped<IMatchBribeInfluenceProvider, NullMatchBribeInfluenceProvider>();
    services.AddSingleton<MatchMapper>();

    return services;
  }
}
