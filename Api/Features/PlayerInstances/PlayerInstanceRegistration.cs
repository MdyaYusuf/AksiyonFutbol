namespace Api.Features.PlayerInstances;

public static class PlayerInstanceRegistration
{
  public static IServiceCollection AddPlayerInstanceDependencies(this IServiceCollection services)
  {
    services.AddScoped<IPlayerInstanceRepository, EfPlayerInstanceRepository>();
    services.AddScoped<PlayerInstanceBusinessRules>();
    services.AddScoped<IPlayerInstanceService, PlayerInstanceService>();
    services.AddSingleton<PlayerInstanceMapper>();

    return services;
  }
}
