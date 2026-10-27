using Microsoft.EntityFrameworkCore;
using TeamGondal.Api.Data;

namespace TeamGondal.Api.Endpoints;

public record CreateDriverRequest(string DisplayName, int? RaceNumber, string? Country);

public static class DriverEndpoints
{
    public static RouteGroupBuilder MapDriverEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/drivers").WithTags("Drivers");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Drivers.AsNoTracking().OrderBy(d => d.DisplayName).Take(500).ToListAsync());

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
            await db.Drivers.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id) is { } driver
                ? Results.Ok(driver)
                : Results.NotFound());

        group.MapPost("/", async (CreateDriverRequest req, AppDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(req.DisplayName))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["displayName"] = ["Display name is required."],
                });
            }

            var driver = new Driver
            {
                DisplayName = req.DisplayName.Trim(),
                RaceNumber = req.RaceNumber,
                Country = req.Country,
            };

            db.Drivers.Add(driver);
            await db.SaveChangesAsync();
            return Results.Created($"/api/drivers/{driver.Id}", driver);
        }).AddEndpointFilter<AdminKeyFilter>();

        return group;
    }
}
