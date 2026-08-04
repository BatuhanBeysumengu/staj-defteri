using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Dtos;
using StajDefteri.Api.Services;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;
    private readonly LogService _logService;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, TokenService tokenService, LogService logService, IConfiguration config)
    {
        _db = db;
        _tokenService = tokenService;
        _logService = logService;
        _config = config;
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
    [HttpPost("kayit")]
    public async Task<IActionResult> Kayit(KayitIstegi istek)
    {
        if (string.IsNullOrWhiteSpace(istek.Ad) ||
            string.IsNullOrWhiteSpace(istek.Email) ||
            string.IsNullOrWhiteSpace(istek.Sifre))
            return BadRequest(new { mesaj = "Tüm alanları doldurun" });

        bool varMi = await _db.Kullanicilar.AnyAsync(k => k.Email == istek.Email);
        if (varMi)
            return Conflict(new { mesaj = "Bu e-posta zaten kayıtlı" });

        var dogruKod = _config["YetkiliDavetKodu"];
        string rol = (!string.IsNullOrWhiteSpace(istek.DavetKodu) && istek.DavetKodu == dogruKod)
            ? "yetkili"
            : "ogrenci";

        var yeni = new Kullanici
        {
            Ad = istek.Ad,
            Email = istek.Email,
            Rol = rol,
            YetkiliId = null,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(istek.Sifre)
        };

        _db.Kullanicilar.Add(yeni);
        await _db.SaveChangesAsync();

        var token = _tokenService.TokenUret(yeni);

        return Ok(new
        {
            token,
            kullanici = new { yeni.Id, yeni.Ad, yeni.Email, yeni.Rol }
        });
    }
}