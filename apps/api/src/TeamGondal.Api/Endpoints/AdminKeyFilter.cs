using System.Security.Cryptography;
using System.Text;

namespace TeamGondal.Api.Endpoints;

/// <summary>
/// Temporary protection for write endpoints until Discord sign in and roles land.
/// Requests must send the X-Admin-Key header matching the ADMIN_API_KEY variable.
/// With no key configured, writes are refused.
/// </summary>
public class AdminKeyFilter(IConfiguration config) : IEndpointFilter
{
    public const string HeaderName = "X-Admin-Key";

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var expected = config["ADMIN_API_KEY"];
        var provided = context.HttpContext.Request.Headers[HeaderName].ToString();

        if (string.IsNullOrEmpty(expected) || string.IsNullOrEmpty(provided) ||
            !CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(provided)))
        {
            return Results.Unauthorized();
        }

        return await next(context);
    }
}
