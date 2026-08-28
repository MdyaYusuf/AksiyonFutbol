namespace Api.Features.LeaguePress;

public static class LeaguePressRegistration
{
  public static IServiceCollection AddLeaguePressDependencies(this IServiceCollection services)
  {
    services.AddScoped<INewsArticleRepository, EfNewsArticleRepository>();
    services.AddScoped<LeaguePressBusinessRules>();
    services.AddScoped<LeaguePressArticleGenerator>();
    services.AddScoped<ILeaguePressService, LeaguePressService>();
    services.AddScoped<ILeaguePressEventPublisher, LeaguePressEventPublisher>();
    services.AddSingleton<LeaguePressMapper>();

    return services;
  }
}
