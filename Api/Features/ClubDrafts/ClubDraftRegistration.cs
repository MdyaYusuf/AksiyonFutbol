namespace Api.Features.ClubDrafts;

public static class ClubDraftRegistration
{
  public static IServiceCollection AddClubDraftDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubDraftPickRepository, EfClubDraftPickRepository>();
    services.AddScoped<ClubDraftBusinessRules>();
    services.AddScoped<IClubDraftService, ClubDraftService>();

    return services;
  }
}
