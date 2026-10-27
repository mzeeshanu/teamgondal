using Microsoft.EntityFrameworkCore;
using TeamGondal.Api.Data;

namespace TeamGondal.Api.Endpoints;

public record CreateEventRequest(
    string Title,
    string? Description,
    string Game,
    string Track,
    string? CarClass,
    DateTimeOffset StartsAt,
    string? ServerInfo);

public static class EventEndpoints
{
    public static RouteGroupBuilder MapEventEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/events").WithTags("Events");

        group.MapGet("/", async (AppDbContext db, bool? upcoming) =>
        {
            var query = db.Events.AsNoTracking();
            if (upcoming == true)
            {
                var now = DateTimeOffset.UtcNow;
                query = query.Where(e => e.StartsAt >= now);
            }

            return await query.OrderBy(e => e.StartsAt).Take(100).ToListAsync();
        });

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
            await db.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id) is { } ev
                ? Results.Ok(ev)
                : Results.NotFound());

        group.MapPost("/", async (CreateEventRequest req, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.Game) || string.IsNullOrWhiteSpace(req.Track))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["event"] = ["Title, Game and Track are required."],
                });
            }

            var ev = new RaceEvent
            {
                Title = req.Title.Trim(),
                Description = req.Description,
                Game = req.Game.Trim(),
                Track = req.Track.Trim(),
                CarClass = req.CarClass,
                StartsAt = req.StartsAt,
                ServerInfo = req.ServerInfo,
            };

            db.Events.Add(ev);
            await db.SaveChangesAsync();
            return Results.Created($"/api/events/{ev.Id}", ev);
        }).AddEndpointFilter<AdminKeyFilter>();

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var ev = await db.Events.FindAsync(id);
            if (ev is null)
            {
                return Results.NotFound();
            }

            db.Events.Remove(ev);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).AddEndpointFilter<AdminKeyFilter>();

        return group;
    }
}
