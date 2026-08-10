using Api.Features.Matches;

namespace Api.Features.Actions;

public static class ActionsRegistration
{
  public static IServiceCollection AddActionsDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubActionRepository, EfClubActionRepository>();
    services.AddScoped<ClubActionBusinessRules>();
    services.AddScoped<IClubActionService, ClubActionService>();
    services.AddSingleton<IClubActionProvider, ClubActionProvider>();
    services.AddSingleton<ClubActionMapper>();
    // Overrides Matches' NullMatchInfluenceProvider; folds bribery + ClubActions.
    services.AddScoped<IMatchInfluenceProvider, MatchInfluenceProvider>();

    return services;
  }
}
