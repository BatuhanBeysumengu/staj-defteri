using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Dtos;
using StajDefteri.Api.Services;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;
    private readonly LogService _logService;
    public AuthController(AppDbContext db, TokenService tokenService,LogService logService)
    {
        _db = db;
        _tokenService = tokenService;
         _logService = logService;
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(GirisIstegi istek)
    {
        var kullanici = await _db.Kullanicilar
            .FirstOrDefaultAsync(k => k.Email == istek.Email);

        if (kullanici is null)
            return Unauthorized(new { mesaj = "E-posta veya şifre hatalı" });

        bool sifreDogruMu = BCrypt.Net.BCrypt.Verify(istek.Sifre, kullanici.SifreHash);
        if (!sifreDogruMu)
            return Unauthorized(new { mesaj = "E-posta veya şifre hatalı" });

        var token = _tokenService.TokenUret(kullanici);
        await _logService.Kaydet(kullanici.Id, kullanici.Ad, "giris", $"{kullanici.Email} giriş yaptı");
Serilog.Log.Information("Giriş: {Ad} ({Email})", kullanici.Ad, kullanici.Email);

        return Ok(new
        {
            token,
            kullanici = new { kullanici.Id, kullanici.Ad, kullanici.Email, kullanici.Rol }
        });
    }
}