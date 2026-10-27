using System.Net;
using System.Net.Http.Json;
using TeamGondal.Api.Data;
using TeamGondal.Api.Endpoints;

namespace TeamGondal.Api.Tests;

public class ApiTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    [Fact]
    public async Task Health_returns_ok()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Creating_an_event_requires_the_admin_key()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/events", NewEvent());
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Created_event_shows_in_upcoming_list()
    {
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add(AdminKeyFilter.HeaderName, ApiFactory.AdminKey);

        var created = await client.PostAsJsonAsync("/api/events", NewEvent());
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);

        var events = await client.GetFromJsonAsync<List<RaceEvent>>("/api/events?upcoming=true");
        Assert.NotNull(events);
        Assert.Contains(events, e => e.Track == "Nordschleife");
    }

    [Fact]
    public void Railway_database_url_is_converted()
    {
        var cs = ConnectionStrings.FromUrl("postgresql://postgres:p%40ss@db.railway.internal:5432/railway");
        Assert.Equal("Host=db.railway.internal;Port=5432;Database=railway;Username=postgres;Password=p@ss", cs);
    }

    private static CreateEventRequest NewEvent() => new(
        Title: "Friday Night Race",
        Description: null,
        Game: "Assetto Corsa",
        Track: "Nordschleife",
        CarClass: "GT3",
        StartsAt: DateTimeOffset.UtcNow.AddDays(3),
        ServerInfo: null);
}
