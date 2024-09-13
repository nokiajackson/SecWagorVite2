using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Antiforgery;

public sealed class ValidateAntiForgeryToken2Attribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(nameof(context));
        }

        var httpContext = context.HttpContext;
        var antiforgery = (IAntiforgery)httpContext.RequestServices.GetService(typeof(IAntiforgery));

        if (antiforgery == null)
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
            return;
        }

        // 驗證 Antiforgery Token
        try
        {
            antiforgery.ValidateRequestAsync(httpContext).Wait();
        }
        catch (AntiforgeryValidationException)
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
        }
    }
}
