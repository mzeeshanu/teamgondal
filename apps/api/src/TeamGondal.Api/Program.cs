using Microsoft.EntityFrameworkCore;
using TeamGondal.Api.Data;
using TeamGondal.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Railway injects PORT; fall back to 8080 for local Docker runs.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

var connectionString = ConnectionStrings.Resolve(builder.Configuration);
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (connectionString is not null)
    {
        options.UseNpgsql(connectionString);
    }
});

// The web app origin(s), comma separated, for browser calls. Server side fetches need no CORS.
var allowedOrigins = (builder.Configuration["CORS_ORIGINS"] ?? "http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

app.MapOpenApi();
app.MapHealthChecks("/health");
app.MapGet("/", () => Results.Ok(new { name = "Team Gondal API", status = "ok" })).ExcludeFromDescription();

app.MapEventEndpoints();
app.MapDriverEndpoints();

// Create the schema on startup. Switch to EF Core migrations once the model settles
// (dotnet ef migrations add Initial) and replace this with db.Database.MigrateAsync().
if (connectionString is null)
{
    app.Logger.LogWarning("No database configured. Set DATABASE_URL to enable data endpoints.");
}
else
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

app.Run();

public partial class Program { }
