namespace Api.Features.Clubs;

/// <summary>
/// Builds unique Club.Name values while keeping template labels as DisplayName.
/// </summary>
public static class BotClubInstanceNaming
{
  private const int NameMaxLength = 100;

  public static (string Name, string DisplayName) FromTemplate(string templateName)
  {
    string displayName = templateName.Trim();

    if (displayName.Length == 0)
    {
      displayName = "Bot";
    }

    if (displayName.Length > NameMaxLength)
    {
      displayName = displayName[..NameMaxLength];
    }

    string suffix = Guid.NewGuid().ToString("N")[..8];
    const string separator = " · ";
    int maxPrefixLength = NameMaxLength - separator.Length - suffix.Length;

    string prefix = displayName;

    if (prefix.Length > maxPrefixLength)
    {
      prefix = prefix[..maxPrefixLength];
    }

    string name = $"{prefix}{separator}{suffix}";

    return (name, displayName);
  }
}
