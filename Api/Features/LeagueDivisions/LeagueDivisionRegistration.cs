namespace Api.Features.LeagueDivisions;

public static class LeagueDivisionRegistration
{
  public static IServiceCollection AddLeagueDivisionDependencies(this IServiceCollection services)
  {
    services.AddScoped<ILeagueDivisionRepository, EfLeagueDivisionRepository>();
    services.AddScoped<LeagueDivisionBusinessRules>();
    services.AddScoped<ILeagueDivisionService, LeagueDivisionService>();
    services.AddSingleton<LeagueDivisionMapper>();

    return services;
  }
}
