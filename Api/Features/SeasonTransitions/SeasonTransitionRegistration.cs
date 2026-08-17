namespace Api.Features.SeasonTransitions;

public static class SeasonTransitionRegistration
{
  public static IServiceCollection AddSeasonTransitionDependencies(this IServiceCollection services)
  {
    services.AddScoped<SeasonTransitionBusinessRules>();
    services.AddScoped<ISeasonTransitionService, SeasonTransitionService>();
    services.AddScoped<ICompetitiveSeasonEndService, SeasonTransitionService>();
    services.AddHostedService<SeasonTransitionBackgroundService>();

    return services;
  }
}
