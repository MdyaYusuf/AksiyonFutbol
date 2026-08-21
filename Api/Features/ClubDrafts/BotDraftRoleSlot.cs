using Api.Features.BasePlayers;

namespace Api.Features.ClubDrafts;

public readonly record struct BotDraftRoleSlot(PlayerPosition Position, BotDraftRole Role);
