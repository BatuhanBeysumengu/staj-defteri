using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StajDefteri.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(Options => Options.UseSqlite("Data source=stajdefteri.db"));
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

app.UseCors("FrontendIzni");   

app.MapControllers();        

app.Run();                      