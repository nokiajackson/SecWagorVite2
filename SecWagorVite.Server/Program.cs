using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using SecWagorVite.Server.Models;
using SecWagorVite.Server.Service;

var builder = WebApplication.CreateBuilder(args);

var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "https://localhost:5173"; // Default value

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins(frontendUrl)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});

// 配置日誌
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// 配置 AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "RequestVerificationToken"; // 組態防偽令牌的要求標頭名稱
});
builder.Services.AddControllers();

builder.Services.AddMvc();
builder.Services.AddHttpContextAccessor();
// Configuration
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("SecWagoreContext");
builder.Services.AddDbContext<SecDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<CampusService>();
builder.Services.AddScoped<CommonService>();
builder.Services.AddScoped<EntryLogService>();


// 增加 Session 服務
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

//增加驗證方式，使用 cookie 驗證
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//})
//    .AddCookie(options =>
//    {
//        //瀏覽器限制cookie 只能經由HTTP(S) 協定來存取
//        options.Cookie.HttpOnly = true;
//        //未登入時會自動導到登入頁
//        options.LoginPath = new PathString("/Home/Login");
//        //當權限不夠拒絕訪問會自動導到此路徑
//        options.AccessDeniedPath = new PathString("/Home/AccessDenied");
//    });

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}
app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
