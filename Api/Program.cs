using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Core.Middlewares;
using Api.Core.Options;
using Api.Core.Security;
using Api.Core.Serialization;
using Api.Data;
using Api.Features.Authentication;
using Api.Features.BasePlayers;
using Api.Features.BaseBotClubs;
using Api.Features.ClubDrafts;
using Api.Features.ClubLineups;
using Api.Features.ClubPresidents;
using Api.Features.Clubs;
using Api.Features.CompetitiveSeating;
using Api.Features.LeagueDivisions;
using Api.Features.Matches;
using Api.Features.PlayerInstances;
using Api.Features.Referees;
using Api.Features.Roles;
using Api.Features.Transfers;
using Api.Features.Bribery;
using Api.Features.Actions;
using Api.Features.Facilities;
using Api.Features.SeasonTransitions;
using Api.Features.Users;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
  options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
  options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
  options.JsonSerializerOptions.Converters.Add(new UtcDateTimeJsonConverter());
  options.JsonSerializerOptions.Converters.Add(new UtcNullableDateTimeJsonConverter());
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
builder.Services.AddBaseBotClubDependencies();
builder.Services.AddClubDraftDependencies();
builder.Services.AddPlayerInstanceDependencies();
builder.Services.AddClubLineupDependencies();
builder.Services.AddTransferDependencies();
builder.Services.AddRefereeDependencies();
builder.Services.AddMatchDependencies();
builder.Services.AddBriberyDependencies();
builder.Services.AddActionsDependencies();
builder.Services.AddFacilitiesDependencies();
builder.Services.AddSeasonTransitionDependencies();
builder.Services.AddCompetitiveSeatingDependencies();
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
builder.Services.AddGameOptions(builder.Configuration);

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