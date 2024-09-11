using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecWagorVite.Server.Models;
using SecWagorVite.Server.Service;

var builder = WebApplication.CreateBuilder(args);

var frontendUrl = builder.Environment.IsDevelopment()
    ? Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "https://localhost:5173"  // �}�o�����q�{�ϥ� localhost
    : Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://http://192.168.0.66:8050"; // �o�G���ҨϥΥͲ�URL

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins(frontendUrl)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});

// �t�m��x
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// �t�m AutoMapper
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
    options.HeaderName = "RequestVerificationToken"; // �պA�����O�P���n�D���Y�W��
});
builder.Services.AddControllers();

builder.Services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);;
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


// �W�[ Session �A��
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

//�W�[���Ҥ覡�A�ϥ� cookie ����
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//})
//    .AddCookie(options =>
//    {
//        //�s��������cookie �u��g��HTTP(S) ��w�Ӧs��
//        options.Cookie.HttpOnly = true;
//        //���n�J�ɷ|�۰ʾɨ�n�J��
//        options.LoginPath = new PathString("/Home/Login");
//        //���v�������ڵ��X�ݷ|�۰ʾɨ즹���|
//        options.AccessDeniedPath = new PathString("/Home/AccessDenied");
//    });

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    //app.UseSwaggerUI();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
    });
}


//app.UseSwagger();
//app.UseSwaggerUI(c =>
//{
//    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
//});

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
