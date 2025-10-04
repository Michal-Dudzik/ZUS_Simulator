using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using ZusSimulator.Services.Models;
using ZusSimulator.Utilities;

namespace ZusSimulator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthorizationCredentialsOptions authorizationOptions;

        public AccountController(IOptions<AuthorizationCredentialsOptions> authorizationOptions)
        {
            this.authorizationOptions = authorizationOptions.Value;
        }

        [Route("Login")]
        [HttpPost]
        public async Task<IActionResult> LoginPost(LoginViewModel model)
        {
            if (model.Login != authorizationOptions.Login || authorizationOptions.Password != "admin") return Redirect("/");
            var claims = new List<Claim>
        {
            new(ClaimTypes.Name, "admin"),
            new("FullName", "admin"),
            new(ClaimTypes.Role, "Administrator")
        };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,

                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),

                IsPersistent = true
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
            return Redirect("/");
        }

        [Route("Logout")]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect("/");
        }
    }
}
