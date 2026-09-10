namespace Api.Features.Objectives;

public static class ObjectivesRegistration
{
  public static IServiceCollection AddObjectivesDependencies(this IServiceCollection services)
  {
    services.AddScoped<IClubObjectiveProgressRepository, EfClubObjectiveProgressRepository>();
    services.AddScoped<IPresidentTitleUnlockRepository, EfPresidentTitleUnlockRepository>();
    services.AddScoped<ObjectivesBusinessRules>();
    services.AddScoped<IObjectivesProgressSettler, ObjectivesProgressSettler>();
    services.AddScoped<IObjectivesService, ObjectivesService>();
    services.AddSingleton<ObjectivesMapper>();

    return services;
  }
}
