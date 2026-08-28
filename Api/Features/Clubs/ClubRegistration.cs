namespace Api.Features.Clubs;

public static class ClubRegistration
{
  public static IServiceCollection AddClubDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubRepository, EfClubRepository>();
    services.AddScoped<ClubBusinessRules>();
    services.AddScoped<IStarterSquadService, StarterSquadService>();
    services.AddScoped<IClubService, ClubService>();
    services.AddScoped<IClubScandalSettler, ClubScandalSettler>();
    services.AddSingleton<ClubMapper>();

    return services;
  }
}
