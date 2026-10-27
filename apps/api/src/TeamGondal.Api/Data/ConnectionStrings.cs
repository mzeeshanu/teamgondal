namespace TeamGondal.Api.Data;

public static class ConnectionStrings
{
    /// <summary>
    /// Resolves the Postgres connection string. Railway exposes DATABASE_URL as a
    /// postgresql:// URI, which Npgsql does not accept directly, so it is converted.
    /// A ConnectionStrings:Default value in configuration wins when present.
    /// </summary>
    public static string? Resolve(IConfiguration config)
    {
        var configured = config.GetConnectionString("Default");
        if (!string.IsNullOrWhiteSpace(configured))
        {
            return configured;
        }

        var url = config["DATABASE_URL"];
        return string.IsNullOrWhiteSpace(url) ? null : FromUrl(url);
    }

    public static string FromUrl(string url)
    {
        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':', 2);
        var user = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
        var database = uri.AbsolutePath.Trim('/');
        var port = uri.Port > 0 ? uri.Port : 5432;

        return $"Host={uri.Host};Port={port};Database={database};Username={user};Password={password}";
    }
}
