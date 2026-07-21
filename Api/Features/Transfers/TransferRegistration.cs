namespace Api.Features.Transfers;

public static class TransferRegistration
{
  public static IServiceCollection AddTransferDependencies(this IServiceCollection services)
  {
    services.AddScoped<ITransferListingRepository, EfTransferListingRepository>();
    services.AddScoped<ITransferOfferRepository, EfTransferOfferRepository>();
    services.AddScoped<TransferBusinessRules>();
    services.AddScoped<ITransferService, TransferService>();
    services.AddSingleton<TransferMapper>();

    return services;
  }
}
