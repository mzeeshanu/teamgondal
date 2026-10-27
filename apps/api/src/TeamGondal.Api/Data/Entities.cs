namespace TeamGondal.Api.Data;

/// <summary>A member of the Team Gondal community who races.</summary>
public class Driver
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Public display name shown on results and profiles.</summary>
    public required string DisplayName { get; set; }

    /// <summary>Discord user id, filled in once Discord sign in is added.</summary>
    public string? DiscordId { get; set; }

    /// <summary>Preferred race number, if the driver has one.</summary>
    public int? RaceNumber { get; set; }

    public string? Country { get; set; }

    public DateTimeOffset JoinedAt { get; set; } = DateTimeOffset.UtcNow;
}

/// <summary>A scheduled race night, league round or open lobby.</summary>
public class RaceEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Title { get; set; }

    public string? Description { get; set; }

    /// <summary>Sim title, for example "Assetto Corsa".</summary>
    public required string Game { get; set; }

    public required string Track { get; set; }

    public string? CarClass { get; set; }

    public DateTimeOffset StartsAt { get; set; }

    /// <summary>Optional server name or join link for the lobby.</summary>
    public string? ServerInfo { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
