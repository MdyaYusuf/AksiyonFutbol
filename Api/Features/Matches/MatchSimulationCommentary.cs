using Api.Features.Clubs;
using Api.Features.PlayerInstances;

namespace Api.Features.Matches;

/// <summary>
/// Flavor commentary templates for match simulation. Not tactical truth.
/// </summary>
internal static class MatchSimulationCommentary
{
  private static readonly string[] PossessionTemplates =
  [
    "{club} midfield settles the ball.",
    "{player} looks for options in midfield for {club}.",
    "{club} recycles possession patiently."
  ];

  private static readonly string[] BuildUpTemplates =
  [
    "{club} builds from the back through {player}.",
    "{player} drives {club} forward in a patient build-up.",
    "{club} progresses the ball into the final third."
  ];

  private static readonly string[] AttackLeftTemplates =
  [
    "{club} attacks down the left. {player} stretches the defense.",
    "Danger on the left for {club} as {player} surges forward.",
    "{player} opens up the left flank for {club}."
  ];

  private static readonly string[] AttackCenterTemplates =
  [
    "{club} pushes through the middle with {player}.",
    "Central overload from {club}. {player} looks for a gap.",
    "{player} carries the ball into the heart of the box for {club}."
  ];

  private static readonly string[] AttackRightTemplates =
  [
    "{club} swings play to the right. {player} is unmarked.",
    "Right-side pressure from {club} led by {player}.",
    "{player} races down the right wing for {club}."
  ];

  private static readonly string[] CrossTemplates =
  [
    "{player} whips in a cross for {club}.",
    "Delivery from the flank by {player}.",
    "{club} hangs a ball into the box from {player}."
  ];

  private static readonly string[] ThroughBallTemplates =
  [
    "{player} slides a through ball for {club}.",
    "Incisive pass from {player} splits the lines.",
    "{club} plays {player} in behind with a clever ball."
  ];

  private static readonly string[] ShotTemplates =
  [
    "{player} lets fly for {club}!",
    "Shot from {player} — {club} looking for the breakthrough.",
    "{player} strikes at goal for {club}."
  ];

  private static readonly string[] SaveTemplates =
  [
    "Brilliant save! The keeper denies {player}.",
    "The shot from {player} is pushed away.",
    "Saved — {player}'s effort is kept out."
  ];

  private static readonly string[] BlockTemplates =
  [
    "Blocked! The defense throws itself in front of {player}'s shot.",
    "{player}'s strike is charged down.",
    "A vital block stops {club}'s attack."
  ];

  private static readonly string[] MissTemplates =
  [
    "{player} fires over the bar.",
    "Wide! {player} cannot find the target for {club}.",
    "{player}'s shot skims past the post."
  ];

  private static readonly string[] CornerTemplates =
  [
    "Corner to {club}.",
    "{club} wins a corner after pressure from {player}.",
    "Flag up for a corner — {club} will take it."
  ];

  private static readonly string[] FreeKickTemplates =
  [
    "Free kick for {club}.",
    "Foul given — {club} has a free kick in a dangerous area.",
    "{player} is brought down. Free kick to {club}."
  ];

  private static readonly string[] YellowCardTemplates =
  [
    "Yellow card! {player} is booked.",
    "The referee shows {player} a yellow card.",
    "{player} goes into the book for {club}."
  ];

  private static readonly string[] InjuryTemplates =
  [
    "{player} goes down injured.",
    "Concern for {club} as {player} needs treatment.",
    "{player} is receiving medical attention."
  ];

  private static readonly string[] GoalTemplates =
  [
    "{minute}. dakikada {club} golü buldu. Gol: {player}.",
    "GOOOL! {player} scores for {club} in the {minute}. minute.",
    "{club} takes the lead through {player} ({minute}')."
  ];

  public static string Format(
    MatchEventType type,
    Club club,
    PlayerInstance? player,
    int minute)
  {
    string[] pool = type switch
    {
      MatchEventType.Possession => PossessionTemplates,
      MatchEventType.BuildUp => BuildUpTemplates,
      MatchEventType.AttackLeft => AttackLeftTemplates,
      MatchEventType.AttackCenter => AttackCenterTemplates,
      MatchEventType.AttackRight => AttackRightTemplates,
      MatchEventType.Cross => CrossTemplates,
      MatchEventType.ThroughBall => ThroughBallTemplates,
      MatchEventType.Shot => ShotTemplates,
      MatchEventType.Save => SaveTemplates,
      MatchEventType.Block => BlockTemplates,
      MatchEventType.Miss => MissTemplates,
      MatchEventType.Corner => CornerTemplates,
      MatchEventType.FreeKick => FreeKickTemplates,
      MatchEventType.YellowCard => YellowCardTemplates,
      MatchEventType.Injury => InjuryTemplates,
      MatchEventType.Goal => GoalTemplates,
      _ => PossessionTemplates
    };

    string template = pool[Random.Shared.Next(pool.Length)];
    string playerName = player is null
      ? "a teammate"
      : $"{player.FirstName} {player.LastName}";

    return template
      .Replace("{club}", club.Name, StringComparison.Ordinal)
      .Replace("{player}", playerName, StringComparison.Ordinal)
      .Replace("{minute}", minute.ToString(), StringComparison.Ordinal);
  }
}
