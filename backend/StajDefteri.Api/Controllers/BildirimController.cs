using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BildirimController : ControllerBase
{
    private readonly AppDbContext _db;

    public BildirimController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Benim()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var bildirimler = await _db.Bildirimler
            .Where(b => b.KullaniciId == kullaniciId)
            .OrderByDescending(b => b.Tarih)
            .Take(30)
            .ToListAsync();

        return Ok(bildirimler);
    }

    [HttpGet("sayi")]
    public async Task<IActionResult> OkunmamisSayi()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var sayi = await _db.Bildirimler
            .CountAsync(b => b.KullaniciId == kullaniciId && !b.Okundu);

        return Ok(new { sayi });
    }

    [HttpPut("okundu")]
    public async Task<IActionResult> HepsiniOkunduYap()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var okunmamislar = await _db.Bildirimler
            .Where(b => b.KullaniciId == kullaniciId && !b.Okundu)
            .ToListAsync();

        foreach (var b in okunmamislar)
            b.Okundu = true;

        await _db.SaveChangesAsync();

        return Ok(new { guncellendi = okunmamislar.Count });
    }
}