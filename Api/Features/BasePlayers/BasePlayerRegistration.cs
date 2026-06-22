namespace Api.Features.BasePlayers;

public static class BasePlayerRegistration
{
  public static IServiceCollection AddBasePlayerDependencies(this IServiceCollection services)
  {
    services.AddScoped<IBasePlayerRepository, EfBasePlayerRepository>();
    services.AddScoped<BasePlayerBusinessRules>();
    services.AddScoped<IBasePlayerService, BasePlayerService>();
    services.AddSingleton<BasePlayerMapper>();

    return services;
  }
}
