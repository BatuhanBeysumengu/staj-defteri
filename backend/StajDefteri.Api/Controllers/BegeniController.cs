using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BegeniController : ControllerBase
{
    private readonly AppDbContext _db;

    public BegeniController(AppDbContext db)
    {
        _db = db;
    }
    [HttpPost("{kayitId}")]
    public async Task<IActionResult> Toggle(int kayitId)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var mevcut = await _db.Begeniler
            .FirstOrDefaultAsync(b => b.KayitId == kayitId && b.KullaniciId == kullaniciId);

        if (mevcut is not null)
        {
            _db.Begeniler.Remove(mevcut);
            await _db.SaveChangesAsync();
            return Ok(new { begendi = false });
        }
        _db.Begeniler.Add(new Begeni
        {
            KayitId = kayitId,
            KullaniciId = kullaniciId,
            Tarih = DateTime.Now
        });
        await _db.SaveChangesAsync();
        return Ok(new { begendi = true });
    }
    [HttpGet("{kayitId}")]
    public async Task<IActionResult> Durum(int kayitId)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var sayi = await _db.Begeniler.CountAsync(b => b.KayitId == kayitId);
        var benBegendim = await _db.Begeniler
            .AnyAsync(b => b.KayitId == kayitId && b.KullaniciId == kullaniciId);

        return Ok(new { sayi, benBegendim });
    }
}