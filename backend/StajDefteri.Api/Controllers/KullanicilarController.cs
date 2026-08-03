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
}