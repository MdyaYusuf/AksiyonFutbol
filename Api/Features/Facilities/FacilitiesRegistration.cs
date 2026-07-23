namespace Api.Features.Facilities;

public static class FacilitiesRegistration
{
  public static IServiceCollection AddFacilitiesDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubFacilityRepository, EfClubFacilityRepository>();
    services.AddScoped<FacilitiesBusinessRules>();
    services.AddScoped<IFacilitiesService, FacilitiesService>();
    services.AddSingleton<FacilitiesMapper>();

    return services;
  }
}
