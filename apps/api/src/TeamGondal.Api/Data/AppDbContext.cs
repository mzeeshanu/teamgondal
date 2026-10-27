using Microsoft.EntityFrameworkCore;

namespace TeamGondal.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Driver> Drivers => Set<Driver>();

    public DbSet<RaceEvent> Events => Set<RaceEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Driver>(e =>
        {
            e.Property(d => d.DisplayName).HasMaxLength(64);
            e.Property(d => d.DiscordId).HasMaxLength(32);
            e.Property(d => d.Country).HasMaxLength(64);
            e.HasIndex(d => d.DiscordId).IsUnique();
        });

        modelBuilder.Entity<RaceEvent>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(120);
            e.Property(x => x.Game).HasMaxLength(64);
            e.Property(x => x.Track).HasMaxLength(120);
            e.Property(x => x.CarClass).HasMaxLength(64);
            e.Property(x => x.ServerInfo).HasMaxLength(256);
            e.HasIndex(x => x.StartsAt);
        });
    }
}
