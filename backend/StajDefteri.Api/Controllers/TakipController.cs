using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Services;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TakipController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly BildirimServisi _bildirim;

    public TakipController(AppDbContext db, BildirimServisi bildirim)
    {
        _db = db;
        _bildirim = bildirim;
    }

    [HttpGet]
    public async Task<IActionResult> OgrenciTakip()
    {
        var yetkiliId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        if (rol != "yetkili")
            return Forbid();

        var ogrenciler = await _db.Kullanicilar
            .Where(k => k.YetkiliId == yetkiliId)
            .Select(k => new { k.Id, k.Ad })
            .ToListAsync();

        var ogrenciIdler = ogrenciler.Select(o => o.Id).ToList();

        var sonKayitlar = await _db.DefterKayitlari
            .Where(d => ogrenciIdler.Contains(d.OgrenciId))
            .GroupBy(d => d.OgrenciId)
            .Select(g => new { OgrenciId = g.Key, SonTarih = g.Max(x => x.Tarih) })
            .ToDictionaryAsync(x => x.OgrenciId, x => x.SonTarih);

        var bugun = DateOnly.FromDateTime(DateTime.Now);

        var sonuc = ogrenciler.Select(o =>
        {
            DateOnly? sonTarih = sonKayitlar.TryGetValue(o.Id, out var t) ? t : null;
            int? gunFarki = sonTarih.HasValue ? bugun.DayNumber - sonTarih.Value.DayNumber : null;

            return new
            {
                o.Id,
                o.Ad,
                SonTarih = sonTarih,
                GunFarki = gunFarki
            };
        }).ToList();

        return Ok(sonuc);
    }

    [HttpPost("hatirlat/{ogrenciId}")]
    public async Task<IActionResult> Hatirlat(int ogrenciId)
    {
        var yetkiliId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        if (rol != "yetkili")
            return Forbid();

        var ogrenci = await _db.Kullanicilar.FindAsync(ogrenciId);
        if (ogrenci is null || ogrenci.YetkiliId != yetkiliId)
            return BadRequest(new { mesaj = "Bu öğrenci size bağlı değil" });

        var yetkili = await _db.Kullanicilar.FindAsync(yetkiliId);
        await _bildirim.Ekle(
            ogrenciId,
            $"{yetkili?.Ad}: Staj defterine kayıt girmeyi unutma!",
            "takip"
        );

        return Ok(new { mesaj = "Hatırlatma gönderildi" });
    }
}