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
public class YorumController : ControllerBase
{
    private readonly AppDbContext _db;

    public YorumController(AppDbContext db)
    {
        _db = db;
    }
    [HttpGet("{kayitId}")]
    public async Task<IActionResult> Listele(int kayitId)
    {
        var yorumlar = await _db.Yorumlar
            .Where(y => y.KayitId == kayitId)
            .OrderBy(y => y.Tarih)
            .ToListAsync();

        var kullaniciIdler = yorumlar.Select(y => y.KullaniciId).Distinct().ToList();
        var adlar = await _db.Kullanicilar
            .Where(k => kullaniciIdler.Contains(k.Id))
            .ToDictionaryAsync(k => k.Id, k => k.Ad);

        var cevap = yorumlar.Select(y => new YorumCevabi(
            y.Id,
            y.KullaniciId,
            adlar.ContainsKey(y.KullaniciId) ? adlar[y.KullaniciId] : "Bilinmeyen",
            y.Icerik,
            y.Tarih
        )).ToList();

        return Ok(cevap);
    }
    [HttpPost("{kayitId}")]
    public async Task<IActionResult> Ekle(int kayitId, YorumIstegi istek)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        if (string.IsNullOrWhiteSpace(istek.Icerik))
            return BadRequest(new { mesaj = "Yorum boş olamaz" });

        var yeni = new Yorum
        {
            KayitId = kayitId,
            KullaniciId = kullaniciId,
            Icerik = istek.Icerik,
            Tarih = DateTime.Now
        };

        _db.Yorumlar.Add(yeni);
        await _db.SaveChangesAsync();

        return Ok(new { yeni.Id });
    }
    [HttpDelete("{yorumId}")]
    public async Task<IActionResult> Sil(int yorumId)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var yorum = await _db.Yorumlar.FindAsync(yorumId);
        if (yorum is null) return NotFound();
        if (yorum.KullaniciId != kullaniciId)
            return Forbid();

        _db.Yorumlar.Remove(yorum);
        await _db.SaveChangesAsync();
        return Ok(new { mesaj = "Yorum silindi" });
    }
}