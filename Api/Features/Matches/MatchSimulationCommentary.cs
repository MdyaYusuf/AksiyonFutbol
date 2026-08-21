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
    "{club} recycles possession patiently.",
    "Little happening as {club} keep the ball with {player}.",
    "{player} takes a touch and surveys the pitch for {club}.",
    "{club} slow the tempo; {player} is on the ball."
  ];

  private static readonly string[] BuildUpTemplates =
  [
    "{club} builds from the back through {player}.",
    "{player} drives {club} forward in a patient build-up.",
    "{club} progresses the ball into midfield.",
    "{player} knits play together for {club}.",
    "From deep, {player} starts a move for {club}.",
    "{club} work it out from defence — {player} takes responsibility."
  ];

  private static readonly string[] AttackLeftTemplates =
  [
    "{club} attacks down the left. {player} stretches the defense.",
    "Danger on the left for {club} as {player} surges forward.",
    "{player} opens up the left flank for {club}.",
    "Overlap on the left — {player} is away for {club}!",
    "{club} switch it left and {player} has space to run into."
  ];

  private static readonly string[] AttackCenterTemplates =
  [
    "{club} pushes through the middle with {player}.",
    "Central overload from {club}. {player} looks for a gap.",
    "{player} carries the ball toward the box for {club}.",
    "{player} drives into the area for {club} — this is promising.",
    "Straight through the middle! {player} is in for {club}."
  ];

  private static readonly string[] AttackRightTemplates =
  [
    "{club} swings play to the right. {player} is unmarked.",
    "Right-side pressure from {club} led by {player}.",
    "{player} races down the right wing for {club}.",
    "Width on the right — {player} isolates the full-back for {club}.",
    "{club} work it right and {player} attacks the byline."
  ];

  private static readonly string[] CrossTemplates =
  [
    "{player} whips in a cross for {club}.",
    "Delivery from the flank by {player}.",
    "{club} hangs a ball into the box from {player}.",
    "Dangerous ball in from {player} — {club} are loading the box!",
    "{player} floats a teasing cross toward the far post."
  ];

  private static readonly string[] ThroughBallTemplates =
  [
    "{player} slides a through ball for {club}.",
    "Incisive pass from {player} splits the lines.",
    "{club} plays {player} in behind with a clever ball.",
    "Weighted perfectly — {player} puts a teammate clean through for {club}!",
    "Thread the needle! {player}'s pass opens {club} up."
  ];

  private static readonly string[] ShotTemplates =
  [
    "{player} lets fly for {club}!",
    "Shot from {player} — {club} looking for the breakthrough.",
    "{player} strikes at goal for {club}.",
    "{player} shapes the shot... and hits it!",
    "Here comes the strike from {player}!"
  ];

  private static readonly string[] BigChanceShotTemplates =
  [
    "Big chance! {player} is through for {club}!",
    "Huge opportunity — {player} must score for {club}.",
    "Big chance for {club} as {player} shapes to shoot!",
    "One-on-one! {player} has to bury this for {club}!",
    "Gift-wrapped chance — {player} pulls the trigger for {club}!"
  ];

  private static readonly string[] SaveTemplates =
  [
    "Brilliant save! {player} keeps it out.",
    "{player} pushes the shot away.",
    "Saved — {player} denies the attackers.",
    "What a stop from {player}!",
    "{player} gets down quickly and smothers it."
  ];

  private static readonly string[] BlockTemplates =
  [
    "Blocked! {player} throws themselves in the way.",
    "{player} charges down the strike.",
    "A vital block from {player} stops the attack.",
    "In the way! {player} throws a body on the line.",
    "{player} closes the angle and blocks it."
  ];

  private static readonly string[] MissTemplates =
  [
    "{player} fires over the bar.",
    "Wide! {player} cannot find the target for {club}.",
    "{player}'s shot skims past the post.",
    "How did that stay out? {player} misses for {club}.",
    "{player} snatches at it — over the top."
  ];

  private static readonly string[] GoalKickTemplates =
  [
    "Shot from {shooter} goes out. Goal kick for {club}.",
    "{shooter} sends it behind — goal kick to {club}.",
    "Over the bar from {shooter}. {club} will restart with a goal kick.",
    "Wide and out from {shooter}. Goal kick for {club} now.",
    "{shooter}'s effort flies past the post. Goal kick to {club}."
  ];

  private static readonly string[] CornerTemplates =
  [
    "Corner to {club}.",
    "{club} wins a corner after pressure from {player}.",
    "Flag up for a corner — {club} will take it.",
    "Deflected behind — corner for {club}.",
    "{player} forces a corner for {club}."
  ];

  private static readonly string[] FreeKickTemplates =
  [
    "Free kick for {club}.",
    "Foul given — {club} has a free kick.",
    "{player} stands over the free kick for {club}.",
    "Referee points to the spot of the foul — free kick, {club}.",
    "{club} will take a free kick; {player} is interested."
  ];

  private static readonly string[] TackleTemplates =
  [
    "Strong tackle from {player}! {club} wins the ball.",
    "{player} steps in cleanly and stops the attack.",
    "Nipped away by {player} — {club} regain possession.",
    "Timing! {player} wins it for {club}.",
    "{player} slides in and {club} break up the move."
  ];

  private static readonly string[] InterceptionTemplates =
  [
    "{player} reads the pass and intercepts for {club}.",
    "Cut out by {player}. {club} snuffs out the move.",
    "{player} intercepts and {club} reset.",
    "Anticipation from {player} — {club} steal it.",
    "{player} steps into the lane and cuts it out."
  ];

  private static readonly string[] ClearanceTemplates =
  [
    "{player} hacks it clear for {club}.",
    "Important clearance from {player}.",
    "{club} breathe again as {player} boots it away.",
    "Safety first — {player} clears the danger.",
    "{player} puts it into Row Z for {club}."
  ];

  private static readonly string[] LooseBallTemplates =
  [
    "Loose ball! {player} reacts first for {club}.",
    "Scramble in midfield — {player} claims it for {club}.",
    "Second ball falls to {player} ({club}).",
    "It squirts free and {player} is onto it for {club}.",
    "Fifty-fifty — {player} wins the bounce for {club}."
  ];

  private static readonly string[] FoulTemplates =
  [
    "Foul by {player}. The referee blows.",
    "{player} brings the attacker down.",
    "Free kick coming — {player} is penalised for {club}.",
    "Late from {player}. Foul given against {club}.",
    "The whistle goes — {player} caught the man."
  ];

  private static readonly string[] ThrowInTemplates =
  [
    "Throw-in to {club}. {player} will take it.",
    "{club} restart with a throw-in from {player}.",
    "Throw-in for {club}.",
    "{player} prepares the throw for {club}.",
    "Quick throw? {player} has it for {club}."
  ];

  private static readonly string[] ThrowInRestartTemplates =
  [
    "{outPlayer} puts it into touch. Throw-in for {throwClub}.",
    "Wayward from {outPlayer} — out of play. {throwClub} restart with a throw-in.",
    "{outClub} concede a throw. {throwPlayer} will take it for {throwClub}.",
    "Into touch from {outPlayer}. Throw-in to {throwClub}.",
    "Sloppy from {outPlayer}. {throwClub} have the throw-in."
  ];

  private static readonly string[] FoulFreeKickTemplates =
  [
    "Foul by {foulPlayer}. Free-kick to {fkClub}.",
    "{foulPlayer} brings the man down — free-kick for {fkClub}.",
    "Whistle goes against {foulClub}. {fkPlayer} stands over the free-kick for {fkClub}.",
    "Late from {foulPlayer}. Free-kick awarded to {fkClub}.",
    "{foulPlayer} fouls. {fkClub} have a free-kick."
  ];

  private static readonly string[] YellowCardTemplates =
  [
    "Yellow card! {player} is booked.",
    "The referee shows {player} a yellow card.",
    "{player} goes into the book for {club}.",
    "Caution for {player}.",
    "That's a yellow — {player} can have no complaints."
  ];

  private static readonly string[] InjuryTemplates =
  [
    "{player} goes down injured.",
    "Concern for {club} as {player} needs treatment.",
    "{player} is receiving medical attention.",
    "Play stops — {player} is hurt.",
    "{club} look worried as {player} stays down."
  ];

  private static readonly string[] GoalTemplates =
  [
    "GOOOL! {player} finishes it for {club} in the {minute}. minute!",
    "{minute}' — {club} score! {player} with the finish!",
    "It's in! {player} converts for {club} ({minute}').",
    "Clinical! {player} makes it count for {club} at {minute}'.",
    "{club} break through! {player} finds the net ({minute}').",
    "{minute}. dakikada {club} golü buldu. Gol: {player}."
  ];

  public static string Format(
    MatchEventType type,
    Club club,
    PlayerInstance? player,
    int minute,
    bool isBigChance = false)
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
      MatchEventType.Shot => isBigChance ? BigChanceShotTemplates : ShotTemplates,
      MatchEventType.Save => SaveTemplates,
      MatchEventType.Block => BlockTemplates,
      MatchEventType.Miss => MissTemplates,
      MatchEventType.Corner => CornerTemplates,
      MatchEventType.FreeKick => FreeKickTemplates,
      MatchEventType.Tackle => TackleTemplates,
      MatchEventType.Interception => InterceptionTemplates,
      MatchEventType.Clearance => ClearanceTemplates,
      MatchEventType.LooseBall => LooseBallTemplates,
      MatchEventType.Foul => FoulTemplates,
      MatchEventType.ThrowIn => ThrowInTemplates,
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
      .Replace("{club}", club.DisplayName, StringComparison.Ordinal)
      .Replace("{player}", playerName, StringComparison.Ordinal)
      .Replace("{minute}", minute.ToString(), StringComparison.Ordinal);
  }

  public static string FormatGoalKick(
    Club defendingClub,
    PlayerInstance? shooter)
  {
    string template = GoalKickTemplates[Random.Shared.Next(GoalKickTemplates.Length)];
    return template
      .Replace("{club}", defendingClub.DisplayName, StringComparison.Ordinal)
      .Replace("{shooter}", PlayerLabel(shooter), StringComparison.Ordinal);
  }

  public static string FormatThrowInRestart(
    Club outClub,
    PlayerInstance? outPlayer,
    Club throwClub,
    PlayerInstance? throwPlayer)
  {
    string template = ThrowInRestartTemplates[Random.Shared.Next(ThrowInRestartTemplates.Length)];
    return template
      .Replace("{outClub}", outClub.DisplayName, StringComparison.Ordinal)
      .Replace("{outPlayer}", PlayerLabel(outPlayer), StringComparison.Ordinal)
      .Replace("{throwClub}", throwClub.DisplayName, StringComparison.Ordinal)
      .Replace("{throwPlayer}", PlayerLabel(throwPlayer), StringComparison.Ordinal);
  }

  public static string FormatFoulFreeKick(
    Club foulClub,
    PlayerInstance? foulPlayer,
    Club freeKickClub,
    PlayerInstance? freeKickPlayer)
  {
    string template = FoulFreeKickTemplates[Random.Shared.Next(FoulFreeKickTemplates.Length)];
    return template
      .Replace("{foulClub}", foulClub.DisplayName, StringComparison.Ordinal)
      .Replace("{foulPlayer}", PlayerLabel(foulPlayer), StringComparison.Ordinal)
      .Replace("{fkClub}", freeKickClub.DisplayName, StringComparison.Ordinal)
      .Replace("{fkPlayer}", PlayerLabel(freeKickPlayer), StringComparison.Ordinal);
  }

  private static string PlayerLabel(PlayerInstance? player)
  {
    if (player is null)
    {
      return "a teammate";
    }

    return $"{player.FirstName} {player.LastName}";
  }
}
