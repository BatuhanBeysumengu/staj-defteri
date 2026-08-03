using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Services;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Warning()                         
    .MinimumLevel.Override("StajDefteri", Serilog.Events.LogEventLevel.Information) 
    .WriteTo.File("Loglar/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();   
builder.Services.AddScoped<OcrService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<PdfService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=stajdefteri.db"));

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<LogService>(); 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendIzni", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendIzni");

app.UseAuthentication();  
app.UseAuthorization();   
app.UseStaticFiles();
app.MapControllers();

app.Run();