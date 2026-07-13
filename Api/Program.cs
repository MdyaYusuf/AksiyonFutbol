using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using Api.Core.Middlewares;
using Api.Core.Options;
using Api.Core.Security;
using Api.Data;
using Api.Features.Authentication;
using Api.Features.BasePlayers;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Api.Features.Referees;
using Api.Features.Roles;
using Api.Features.Users;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
  options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddProblemDetails();
builder.Services.AddHybridCache(options =>
{
  options.DefaultEntryOptions = new HybridCacheEntryOptions
  {
    Expiration = TimeSpan.FromMinutes(10),
    LocalCacheExpiration = TimeSpan.FromMinutes(5)
  };
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
  options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddDataDependencies(builder.Configuration);
builder.Services.AddAuthenticationDependencies();
builder.Services.AddUserDependencies();
builder.Services.AddRoleDependencies();
builder.Services.AddClubPresidentDependencies();
builder.Services.AddLeagueDivisionDependencies();
builder.Services.AddClubDependencies();
builder.Services.AddBasePlayerDependencies();
builder.Services.AddPlayerInstanceDependencies();
builder.Services.AddRefereeDependencies();
builder.Services.AddMatchDependencies();
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", policy =>
  {
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
  });
});

builder.Services.Configure<TokenOptions>(builder.Configuration.GetSection("TokenOptions"));
builder.Services.AddOptions<GameOptions>()
  .Bind(builder.Configuration.GetSection(GameOptions.SectionName))
  .Validate(options => options.StartingCash >= 0, "StartingCash negatif olamaz.")
  .Validate(options => options.StartingWageBudget >= 0, "StartingWageBudget negatif olamaz.")
  .Validate(options => options.StartingClubStatus >= 0 && options.StartingClubStatus <= 100, "StartingClubStatus 0 ile 100 arasında olmalıdır.")
  .Validate(options => options.MaximumClubsPerDivision > 0, "MaximumClubsPerDivision 0'dan büyük olmalıdır.")
  .Validate(options => options.MinimumMatchWeek > 0, "MinimumMatchWeek 0'dan büyük olmalıdır.")
  .Validate(options => options.MaximumMatchWeek >= options.MinimumMatchWeek, "MaximumMatchWeek, MinimumMatchWeek değerinden küçük olamaz.")
  .Validate(options => options.StarterSquadGoalkeepers >= 1, "StarterSquadGoalkeepers en az 1 olmalıdır.")
  .Validate(options => options.StarterSquadDefenders >= 0, "StarterSquadDefenders negatif olamaz.")
  .Validate(options => options.StarterSquadMidfielders >= 0, "StarterSquadMidfielders negatif olamaz.")
  .Validate(options => options.StarterSquadForwards >= 0, "StarterSquadForwards negatif olamaz.")
  .Validate(
    options =>
      options.StarterSquadGoalkeepers +
      options.StarterSquadDefenders +
      options.StarterSquadMidfielders +
      options.StarterSquadForwards > 0,
    "Başlangıç kadrosu toplam oyuncu sayısı 0'dan büyük olmalıdır.")
  .Validate(options => options.StarterMarketValuePerOverall >= 0, "StarterMarketValuePerOverall negatif olamaz.")
  .Validate(options => options.StarterWagePerOverall >= 0, "StarterWagePerOverall negatif olamaz.")
  .ValidateOnStart();

var tokenOptions = builder.Configuration.GetSection("TokenOptions").Get<TokenOptions>() ?? throw new InvalidOperationException("TokenOptions bölümü yapılandırma dosyasında appsettings bulunamadı.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidIssuer = tokenOptions.Issuer,
      ValidAudience = tokenOptions.Audience,
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.SecurityKey)),
      ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
      OnMessageReceived = context =>
      {
        if (string.IsNullOrEmpty(context.Token) && context.Request.Cookies.TryGetValue("accessToken", out var token))
        {
          context.Token = token;
        }
        return Task.CompletedTask;
      }
    };
  });

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

app.UseExceptionHandler();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();