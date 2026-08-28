namespace Api.Features.LeaguePress;

public static class LeaguePressRegistration
{
  public static IServiceCollection AddLeaguePressDependencies(this IServiceCollection services)
  {
    services.AddSingleton<ILeaguePressEventPublisher, NullLeaguePressEventPublisher>();

    return services;
  }
}
