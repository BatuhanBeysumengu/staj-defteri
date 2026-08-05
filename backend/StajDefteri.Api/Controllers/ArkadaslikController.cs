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
public class ArkadaslikController : ControllerBase
{
    private readonly AppDbContext _db;

    public ArkadaslikController(AppDbContext db)
    {
        _db = db;
    }
    [HttpPost("gonder/{aliciId}")]
    public async Task<IActionResult> Gonder(int aliciId)
    {
        var gonderenId = int.Parse(User.FindFirst("id")!.Value);

        if (gonderenId == aliciId)
            return BadRequest(new { mesaj = "Kendinize istek gönderemezsiniz" });

        var alici = await _db.Kullanicilar.FindAsync(aliciId);
        if (alici is null)
            return NotFound(new { mesaj = "Kullanıcı bulunamadı" });

        bool zatenVar = await _db.Arkadasliklar.AnyAsync(a =>
            (a.GonderenId == gonderenId && a.AliciId == aliciId) ||
            (a.GonderenId == aliciId && a.AliciId == gonderenId));
        if (zatenVar)
            return Conflict(new { mesaj = "Zaten bir istek veya arkadaşlık var" });

        var yeni = new Arkadaslik
        {
            GonderenId = gonderenId,
            AliciId = aliciId,
            Durum = "bekliyor",
            Tarih = DateTime.Now
        };

        _db.Arkadasliklar.Add(yeni);
        await _db.SaveChangesAsync();

        return Ok(new { mesaj = "İstek gönderildi" });
    }
    [HttpGet("gelenler")]
    public async Task<IActionResult> Gelenler()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var istekler = await _db.Arkadasliklar
            .Where(a => a.AliciId == kullaniciId && a.Durum == "bekliyor")
            .OrderByDescending(a => a.Tarih)
            .ToListAsync();

        var gonderenIdler = istekler.Select(a => a.GonderenId).Distinct().ToList();
        var adlar = await _db.Kullanicilar
            .Where(k => gonderenIdler.Contains(k.Id))
            .ToDictionaryAsync(k => k.Id, k => k.Ad);

        var cevap = istekler.Select(a => new ArkadaslikIstegiCevabi(
            a.Id,
            a.GonderenId,
            adlar.ContainsKey(a.GonderenId) ? adlar[a.GonderenId] : "Bilinmeyen",
            a.Tarih
        )).ToList();

        return Ok(cevap);
    }
    [HttpPut("{id}/kabul")]
    public async Task<IActionResult> Kabul(int id)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var istek = await _db.Arkadasliklar.FindAsync(id);
        if (istek is null) return NotFound();

        if (istek.AliciId != kullaniciId)
            return Forbid();

        istek.Durum = "kabul";
        await _db.SaveChangesAsync();
        return Ok(new { mesaj = "Arkadaşlık kabul edildi" });
    }
    [HttpPut("{id}/ret")]
    public async Task<IActionResult> Ret(int id)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var istek = await _db.Arkadasliklar.FindAsync(id);
        if (istek is null) return NotFound();

        if (istek.AliciId != kullaniciId)
            return Forbid();

        _db.Arkadasliklar.Remove(istek);
        await _db.SaveChangesAsync();
        return Ok(new { mesaj = "İstek reddedildi" });
    }

    [HttpGet("listem")]
    public async Task<IActionResult> Listem()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var arkadasliklar = await _db.Arkadasliklar
            .Where(a => a.Durum == "kabul" &&
                        (a.GonderenId == kullaniciId || a.AliciId == kullaniciId))
            .ToListAsync();

        var arkadasIdler = arkadasliklar
            .Select(a => a.GonderenId == kullaniciId ? a.AliciId : a.GonderenId)
            .ToList();

        var arkadaslar = await _db.Kullanicilar
            .Where(k => arkadasIdler.Contains(k.Id))
            .Select(k => new ArkadasCevabi(k.Id, k.Ad, k.Rol))
            .ToListAsync();

        return Ok(arkadaslar);
    }
    [HttpGet("durum/{digerId}")]
    public async Task<IActionResult> Durum(int digerId)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var iliski = await _db.Arkadasliklar.FirstOrDefaultAsync(a =>
            (a.GonderenId == kullaniciId && a.AliciId == digerId) ||
            (a.GonderenId == digerId && a.AliciId == kullaniciId));

        if (iliski is null)
            return Ok(new { durum = "yok" });

        if (iliski.Durum == "kabul")
            return Ok(new { durum = "arkadas" });

        if (iliski.GonderenId == kullaniciId)
            return Ok(new { durum = "gonderildi", istekId = iliski.Id });
        else
            return Ok(new { durum = "geldi", istekId = iliski.Id });
    }
}