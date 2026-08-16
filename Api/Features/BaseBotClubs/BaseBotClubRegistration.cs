namespace Api.Features.BaseBotClubs;

public static class BaseBotClubRegistration
{
  public static IServiceCollection AddBaseBotClubDependencies(this IServiceCollection services)
  {
    services.AddScoped<IBaseBotClubRepository, EfBaseBotClubRepository>();

    return services;
  }
}
