using Api.Core.Exceptions;

namespace Api.Core.Validation;

public static class RestrictedNameWords
{
  private static readonly HashSet<string> ExactMatchWords = new(StringComparer.Ordinal)
  {
    "admin",
    "administrator",
    "mod",
    "moderator",
    "support",
    "destek",
    "system",
    "root",
    "official",
    "resmi",
    "staff",
    "dev",
    "developer",
    "yonetici",
    "aksiyon",
    "aksiyonfutbol",
    "osm",
    "ofm",
  };

  private static readonly string[] ContainsMatchFragments =
  [
    "aksiyonfutbol",
    "onlinesoccermanager",
    "trophymanager",
    "kickoffboss",
    "onlinefootballmanager",
    "powerplaymanager",
    "goalunited",
    "finalwhistle",
    "hattrick",
  ];

  public static string Normalize(string value)
  {
    string folded = FoldTurkishChars(value.Trim().ToLowerInvariant());
    Span<char> buffer = stackalloc char[folded.Length];
    int length = 0;

    foreach (char character in folded)
    {
      if (character is ' ' or '.' or '_' or '-')
      {
        continue;
      }

      buffer[length] = character;
      length++;
    }

    return new string(buffer[..length]);
  }

  public static bool IsRestricted(string? value)
  {
    if (string.IsNullOrWhiteSpace(value))
    {
      return false;
    }

    string normalized = Normalize(value);

    if (ExactMatchWords.Contains(normalized))
    {
      return true;
    }

    foreach (string fragment in ContainsMatchFragments)
    {
      if (normalized.Contains(fragment, StringComparison.Ordinal))
      {
        return true;
      }
    }

    return false;
  }

  public static void EnsureIsNotRestricted(string? value, string fieldLabel)
  {
    if (!IsRestricted(value))
    {
      return;
    }

    throw new BusinessException(
      $"Seçtiğiniz {fieldLabel} sistem tarafından rezerve edilmiştir. Lütfen farklı bir ad belirleyiniz.");
  }

  private static string FoldTurkishChars(string value)
  {
    return value
      .Replace('ı', 'i')
      .Replace('İ', 'i')
      .Replace('ö', 'o')
      .Replace('Ö', 'o')
      .Replace('ü', 'u')
      .Replace('Ü', 'u')
      .Replace('ş', 's')
      .Replace('Ş', 's')
      .Replace('ç', 'c')
      .Replace('Ç', 'c')
      .Replace('ğ', 'g')
      .Replace('Ğ', 'g');
  }
}
