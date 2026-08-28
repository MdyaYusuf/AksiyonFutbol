namespace Api.Features.ClubPresidents;

public static class ClubPresidentRegistration
{
  public static IServiceCollection AddClubPresidentDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubPresidentRepository, EfClubPresidentRepository>();
    services.AddScoped<ClubPresidentBusinessRules>();
    services.AddScoped<ClubPresidentMoralityBusinessRules>();
    services.AddScoped<IPresidentMoralitySettler, PresidentMoralitySettler>();
    services.AddScoped<IPresidentMatchMoralitySettler, PresidentMatchMoralitySettler>();
    services.AddScoped<IClubPresidentService, ClubPresidentService>();
    services.AddSingleton<ClubPresidentMapper>();

    return services;
  }
}
