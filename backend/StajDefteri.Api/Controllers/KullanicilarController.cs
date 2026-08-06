using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;
using StajDefteri.Api.Dtos;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KullanicilarController : ControllerBase
{
    private readonly AppDbContext _db;

    public KullanicilarController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("ogrenci")]
    public async Task<IActionResult> OgrenciEkle(OgrenciEkleIstegi istek)
    {
        bool varMi = await _db.Kullanicilar.AnyAsync(k => k.Email == istek.Email);
        if (varMi)
            return Conflict(new { mesaj = "Bu e-posta zaten kayıtlı" });

        var yeniOgrenci = new Kullanici
        {
            Ad = istek.Ad,
            Email = istek.Email,
            Rol = "ogrenci",
            YetkiliId = istek.YetkiliId,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(istek.Sifre)
        };

        _db.Kullanicilar.Add(yeniOgrenci);
        await _db.SaveChangesAsync();
        return Ok(new { yeniOgrenci.Id, yeniOgrenci.Ad, yeniOgrenci.Email });
    }

    [Authorize]
    [HttpGet("profil/benim")]
    public async Task<IActionResult> BenimProfilim()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var kullanici = await _db.Kullanicilar.FindAsync(kullaniciId);
        if (kullanici is null) return NotFound();

        return Ok(new ProfilCevabi(
            kullanici.Id,
            kullanici.Ad,
            kullanici.Email,
            kullanici.Rol
        ));
    }

    [Authorize]
    [HttpGet("profil/{id}")]
    public async Task<IActionResult> Profil(int id)
    {
        var kullanici = await _db.Kullanicilar.FindAsync(id);
        if (kullanici is null) return NotFound();

        return Ok(new ProfilCevabi(
            kullanici.Id,
            kullanici.Ad,
            kullanici.Email,
            kullanici.Rol
        ));
    }

    [Authorize]
    [HttpGet("ara")]
    public async Task<IActionResult> Ara([FromQuery] string? q, [FromQuery] string? rol)
    {
        var sorgu = _db.Kullanicilar.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(q))
            sorgu = sorgu.Where(k => EF.Functions.Like(k.Ad, $"%{q}%"));

        if (!string.IsNullOrWhiteSpace(rol))
            sorgu = sorgu.Where(k => k.Rol == rol);

        var sonuclar = await sorgu
            .OrderBy(k => k.Ad)
            .Take(20)
            .Select(k => new ProfilCevabi(k.Id, k.Ad, k.Email, k.Rol))
            .ToListAsync();

        return Ok(sonuclar);
    }
} 