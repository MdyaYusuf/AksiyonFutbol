namespace Api.Features.Clubs;

public static class ClubRegistration
{
  public static IServiceCollection AddClubDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubRepository, EfClubRepository>();
    services.AddScoped<ClubBusinessRules>();
    services.AddScoped<IStarterSquadService, StarterSquadService>();
    services.AddScoped<IClubService, ClubService>();
    services.AddSingleton<ClubMapper>();

    return services;
  }
}
