using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;
using StajDefteri.Api.Dtos;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BaglantiController : ControllerBase
{
    private readonly AppDbContext _db;

    public BaglantiController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("gonder")]
    public async Task<IActionResult> Gonder(BaglantiIstegiGonder istek)
    {
        var ogrenciId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        if (rol != "ogrenci")
            return BadRequest(new { mesaj = "Yalnızca öğrenciler istek gönderebilir" });

        var hoca = await _db.Kullanicilar.FindAsync(istek.YetkiliId);
        if (hoca is null || hoca.Rol != "yetkili")
            return BadRequest(new { mesaj = "Geçersiz yetkili" });
        var ogrenci = await _db.Kullanicilar.FindAsync(ogrenciId);
        if (ogrenci?.YetkiliId == istek.YetkiliId)
            return Conflict(new { mesaj = "Zaten bu hocaya bağlısınız" });
        bool zatenVar = await _db.BaglantiIstekleri.AnyAsync(b =>
            b.OgrenciId == ogrenciId &&
            b.YetkiliId == istek.YetkiliId &&
            b.Durum == "bekliyor");
        if (zatenVar)
            return Conflict(new { mesaj = "Bu hocaya zaten bekleyen bir isteğiniz var" });

        var yeni = new BaglantiIstegi
        {
            OgrenciId = ogrenciId,
            YetkiliId = istek.YetkiliId,
            Mesaj = istek.Mesaj,
            Durum = "bekliyor",
            Tarih = DateTime.Now
        };

        _db.BaglantiIstekleri.Add(yeni);
        await _db.SaveChangesAsync();

        return Ok(new { yeni.Id, mesaj = "İstek gönderildi" });
    }
    [HttpGet("gelenler")]
    public async Task<IActionResult> Gelenler()
    {
        var yetkiliId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        if (rol != "yetkili")
            return BadRequest(new { mesaj = "Yalnızca yetkililer istek görebilir" });

        var istekler = await _db.BaglantiIstekleri
            .Where(b => b.YetkiliId == yetkiliId && b.Durum == "bekliyor")
            .OrderByDescending(b => b.Tarih)
            .ToListAsync();
        var ogrenciIdler = istekler.Select(b => b.OgrenciId).Distinct().ToList();
        var adlar = await _db.Kullanicilar
            .Where(k => ogrenciIdler.Contains(k.Id))
            .ToDictionaryAsync(k => k.Id, k => k.Ad);

        var cevap = istekler.Select(b => new BaglantiIstegiCevabi(
            b.Id,
            b.OgrenciId,
            adlar.TryGetValue(b.OgrenciId, out var ad) ? ad : "Bilinmeyen",
            b.Mesaj,
            b.Durum,
            b.Tarih
        )).ToList();

        return Ok(cevap);
    }
    [HttpPut("{id}/kabul")]
    public async Task<IActionResult> Kabul(int id)
    {
        var yetkiliId = int.Parse(User.FindFirst("id")!.Value);

        var istek = await _db.BaglantiIstekleri.FindAsync(id);
        if (istek is null) return NotFound();
        if (istek.YetkiliId != yetkiliId)
            return Forbid();

        istek.Durum = "kabul";
        var ogrenci = await _db.Kullanicilar.FindAsync(istek.OgrenciId);
        if (ogrenci is not null)
            ogrenci.YetkiliId = yetkiliId;

        await _db.SaveChangesAsync();
        return Ok(new { mesaj = "İstek kabul edildi" });
    }
    [HttpPut("{id}/ret")]
    public async Task<IActionResult> Ret(int id)
    {
        var yetkiliId = int.Parse(User.FindFirst("id")!.Value);

        var istek = await _db.BaglantiIstekleri.FindAsync(id);
        if (istek is null) return NotFound();

        if (istek.YetkiliId != yetkiliId)
            return Forbid();

        istek.Durum = "ret";
        await _db.SaveChangesAsync();
        return Ok(new { mesaj = "İstek reddedildi" });
    }
}