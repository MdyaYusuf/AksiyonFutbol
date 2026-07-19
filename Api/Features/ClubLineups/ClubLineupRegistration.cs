namespace Api.Features.ClubLineups;

public static class ClubLineupRegistration
{
  public static IServiceCollection AddClubLineupDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubLineupRepository, EfClubLineupRepository>();
    services.AddScoped<IClubLineupSelectionRepository, EfClubLineupSelectionRepository>();
    services.AddScoped<ClubLineupBusinessRules>();
    services.AddScoped<IDefaultClubLineupService, DefaultClubLineupService>();
    services.AddScoped<IClubLineupService, ClubLineupService>();
    services.AddScoped<IMatchDaySquadResolver, MatchDaySquadResolver>();
    services.AddSingleton<ClubLineupMapper>();

    return services;
  }
}
