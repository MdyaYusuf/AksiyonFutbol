namespace Api.Features.CompetitiveSeating;

public static class CompetitiveSeatingRegistration
{
  public static IServiceCollection AddCompetitiveSeatingDependencies(this IServiceCollection services)
  {
    services.AddScoped<ITutorialGraduationService, TutorialGraduationService>();
    services.AddScoped<ICompetitiveSeatingService, CompetitiveSeatingService>();
    services.AddHostedService<CompetitiveSeatingBackgroundService>();

    return services;
  }
}
