using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using SecWagorVite.Server.Helpers;
using SecWagorVite.Server.Controllers.Service;
using SecWagorVite.Server.Models;
using SecWagorVite.Server.Service;
using Swashbuckle.AspNetCore;
using System.Reflection;
using System.Security.Claims;
using System.Data.Entity.Infrastructure;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;


[Route("api/[controller]")]
[ApiController]
public class AccountController : Controller
{
    private readonly AccountService _accountService;
    CommonService _commonService;
    private readonly IAntiforgery _antiforgery;



    public AccountController(
        AccountService accountService,
        CommonService commonService,
        IAntiforgery antiforgery
        )
    {
        _accountService = accountService;
        _commonService = commonService;
        _antiforgery = antiforgery;
    }

    
    /// <summary>
    /// Get all campuses.
    /// </summary>
    /// <returns>A list of all campuses.</returns>
    [HttpGet("GetAllCampuses")]
    //[ProducesResponseType(typeof(List<Campus>), 200)]
    public IActionResult GetAllCampuses()
    {
        var campuses = _commonService.GetAllCampus();
        return Ok(campuses);
    }

    [HttpPost("CreateUser")]
    //[SwaggerResponse(200, type: typeof(Result<IActionResult>))]
    public Task<IActionResult> CreateUser(Account account)
    {
        _accountService.CreateUser(account);
        return Task.FromResult<IActionResult>(Ok("Account created successfully."));
    }

    /// <summary>
    /// 驗證圖
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route("Captcha")] // 如果您使用了自定義路由，請確保包括該路由
    //[SwaggerResponse(200, type: typeof(FileContentResult))]
    public IActionResult Captcha()
    {
        var code = CaptchaHelper.GetCode(6);
        TempData["captcha"] = code; // 將驗證碼存儲在 TempData 中


        var byteArray = CaptchaHelper.GetByteArray(code);
        return File(byteArray, "image/jpeg");
    }

    [HttpGet("{userName}")]
    //[SwaggerResponse(200, type: typeof(Result<IActionResult>))]
    public Task<IActionResult> GetAccountByName(string userName)
    {
        var account = _accountService.GetAccountByName(userName);
        if (account == null)
        {
            return Task.FromResult<IActionResult>(NotFound("Account not found."));
        }
        return Task.FromResult<IActionResult>(Ok(account));
    }

    [HttpGet("GetAntiForgeryToken")]
    public IActionResult GetAntiForgeryToken()
    {
        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
        return Ok(new { token = tokens.RequestToken });
    }

    [HttpPost("Login")]
    [ValidateAntiForgeryToken2]
    public async Task<IActionResult> Login(LoginModelVM model)
    {
        //model.Captcha = captcha;
        // 驗證用戶名和密碼
        bool isValid = _accountService.ValidateCredentials(model);
        if (isValid)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, model.Username),
                //new Claim(ClaimTypes.NameIdentifier, model.Campus)
            };

            // 登錄成功，設置用戶的身份驗證標識
            var campus = await _accountService.GetCampusByIdAsync(model.Campus);
            if (campus != null)
            {
                // 添加校區信息到Claim中
                claims.Add( new Claim("CampusName", campus.CampusName.ToString()));
                claims.Add( new Claim("CampusId", model.Campus.ToString()));
            }
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,  // 設置持續性
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30) // 設置過期時間
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                principal,
                authProperties);
                
            //ViewData["CurrentCampus"] = campus?.CampusName.ToString();
            // 先暫略過 後續再寫

            return Ok("Login successful.");
        }
        else
        {
            return Unauthorized("Invalid credentials.");
        }
    }

    [HttpPost("GetCampusInfo")]
    public async Task<Result<Campu>> GetCampusInfo()
    {
        if (!HttpContext.User.Identity.IsAuthenticated)
        {
            return ResultHelper.Failure<Campu>("未登入!", ResultHelper.StatusCode.Get);
        }

        var campusNameClaim = HttpContext.User.FindFirst("CampusName")?.Value ??"" ;
        var campusIdClaim = HttpContext.User.FindFirst("CampusId")?.Value ?? "";

        if (campusNameClaim != null && campusIdClaim != null)
        {
            Campu campus = new Campu
            {
                CampusName = campusNameClaim,
                CampusId = campusIdClaim
            };

            //return Ok(campus);
            return ResultHelper.Success<Campu>(campus, ResultHelper.StatusCode.Get);
        }
        return ResultHelper.Failure<Campu>("無法取得資訊!", ResultHelper.StatusCode.Get);
    }



    /// <summary>
    /// 登出
    /// </summary>
    /// <returns></returns>
    [HttpGet, HttpPost]
    [Route("Logout")]
    //[SwaggerResponse(200, type: typeof(Result<IActionResult>))]
    public IActionResult Logout()
    {
        // 清除 Cookies 或 Session
        HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        //HttpContext.Session.Clear();

        // 如果使用的是 Cookies 認證
        //HttpContext.SignOutAsync();
        //return Redirect("~/");
        return Ok(new { message = "Logout successful" });
    }

    

    void WriteLog(string message)
    {
        var path = Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().CodeBase).LocalPath);
        if (!Directory.Exists(path + "\\Logs\\"))
        {
            Directory.CreateDirectory(path + "\\Logs\\");
        }
        var logFile = path + "\\Logs\\" + string.Format("Portal_{0:D3}{1:D2}{2:D2}.log", DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
        using (StreamWriter sw = System.IO.File.AppendText(logFile))
        {
            sw.WriteLine(string.Format("{0:T}:{1} ", DateTime.Now, message));
        }
    }
}

public class Campu
{
    public string CampusName { get; set; }
    public string CampusId { get; set; }

}