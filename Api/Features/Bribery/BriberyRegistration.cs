namespace Api.Features.Bribery;

public static class BriberyRegistration
{
  public static IServiceCollection AddBriberyDependencies(this IServiceCollection services)
  {
    services.AddScoped<IBribeAttemptRepository, EfBribeAttemptRepository>();
    services.AddScoped<BriberyBusinessRules>();
    services.AddScoped<IBriberyService, BriberyService>();
    services.AddSingleton<BriberyMapper>();

    return services;
  }
}
