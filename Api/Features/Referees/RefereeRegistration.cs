namespace Api.Features.Referees;

public static class RefereeRegistration
{
  public static IServiceCollection AddRefereeDependencies(this IServiceCollection services)
  {
    services.AddScoped<IRefereeRepository, EfRefereeRepository>();
    services.AddScoped<RefereeBusinessRules>();
    services.AddScoped<IRefereeService, RefereeService>();
    services.AddSingleton<RefereeMapper>();

    return services;
  }
}
