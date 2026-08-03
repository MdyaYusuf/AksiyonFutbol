using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Core.Serialization;

/// <summary>
/// Ensures DateTime values are exchanged as UTC with a trailing Z.
/// EF often returns Unspecified Kind for datetime2; without this, browsers
/// treat timezone-less ISO strings as local time and shift display (e.g. UTC+3).
/// </summary>
public sealed class UtcDateTimeJsonConverter : JsonConverter<DateTime>
{
  private const string UtcFormat = "yyyy-MM-dd'T'HH:mm:ss.fffffff'Z'";

  public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    if (reader.TokenType == JsonTokenType.String)
    {
      string? raw = reader.GetString();

      if (string.IsNullOrWhiteSpace(raw))
      {
        throw new JsonException("DateTime string was empty.");
      }

      if (DateTime.TryParse(
            raw,
            CultureInfo.InvariantCulture,
            DateTimeStyles.RoundtripKind,
            out DateTime parsed))
      {
        return ToUtc(parsed);
      }
    }

    return ToUtc(reader.GetDateTime());
  }

  public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
  {
    writer.WriteStringValue(ToUtc(value).ToString(UtcFormat, CultureInfo.InvariantCulture));
  }

  internal static DateTime ToUtc(DateTime value) => value.Kind switch
  {
    DateTimeKind.Utc => value,
    DateTimeKind.Local => value.ToUniversalTime(),
    _ => DateTime.SpecifyKind(value, DateTimeKind.Utc),
  };
}

public sealed class UtcNullableDateTimeJsonConverter : JsonConverter<DateTime?>
{
  private readonly UtcDateTimeJsonConverter _inner = new();

  public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    if (reader.TokenType == JsonTokenType.Null)
    {
      return null;
    }

    return _inner.Read(ref reader, typeof(DateTime), options);
  }

  public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
  {
    if (value is null)
    {
      writer.WriteNullValue();
      return;
    }

    _inner.Write(writer, value.Value, options);
  }
}
