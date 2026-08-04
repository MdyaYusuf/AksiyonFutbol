using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Api.Core.Options;

public static class GameOptionsRegistration
{
  public static IServiceCollection AddGameOptions(
    this IServiceCollection services,
    IConfiguration configuration)
  {
    services.AddSingleton<IValidateOptions<GameOptions>, GameOptionsValidator>();

    services.AddOptions<GameOptions>()
      .Bind(configuration.GetSection(GameOptions.SectionName))
      .ValidateOnStart();

    return services;
  }
}
