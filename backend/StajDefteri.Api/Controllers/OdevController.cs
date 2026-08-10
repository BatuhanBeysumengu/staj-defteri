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
public class OdevController : ControllerBase
{
    private readonly AppDbContext _db;

    public OdevController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("ver")]
    public async Task<IActionResult> Ver(OdevVerIstegi istek)
    {
        var verenId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        if (rol != "yetkili")
            return Forbid();

        if (string.IsNullOrWhiteSpace(istek.Baslik))
            return BadRequest(new { mesaj = "Başlık boş olamaz" });

        var ogrenci = await _db.Kullanicilar.FindAsync(istek.OgrenciId);
        if (ogrenci is null || ogrenci.Rol != "ogrenci")
            return BadRequest(new { mesaj = "Geçerli bir öğrenci seçin" });

        var odev = new Odev
        {
            Baslik = istek.Baslik,
            Aciklama = istek.Aciklama ?? "",
            SonTeslimTarihi = istek.SonTeslimTarihi,
            OgrenciId = istek.OgrenciId,
            VerenId = verenId,
            Durum = "bekliyor",
            OlusturmaTarihi = DateTime.Now
        };

        _db.Odevler.Add(odev);
        await _db.SaveChangesAsync();

        return Ok(new { odev.Id });
    }

    [HttpGet("benim")]
    public async Task<IActionResult> Benim()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        List<Odev> odevler;

        if (rol == "yetkili")
        {
            odevler = await _db.Odevler
                .Where(o => o.VerenId == kullaniciId)
                .OrderBy(o => o.SonTeslimTarihi)
                .ToListAsync();
        }
        else
        {
            odevler = await _db.Odevler
                .Where(o => o.OgrenciId == kullaniciId)
                .OrderBy(o => o.SonTeslimTarihi)
                .ToListAsync();
        }

        var kisiIdler = odevler
            .Select(o => rol == "yetkili" ? o.OgrenciId : o.VerenId)
            .Distinct()
            .ToList();

        var adlar = await _db.Kullanicilar
            .Where(k => kisiIdler.Contains(k.Id))
            .ToDictionaryAsync(k => k.Id, k => k.Ad);

        var cevap = odevler.Select(o =>
        {
            var kisiId = rol == "yetkili" ? o.OgrenciId : o.VerenId;
            return new OdevCevabi(
                o.Id,
                o.Baslik,
                o.Aciklama,
                o.SonTeslimTarihi,
                o.Durum,
                kisiId,
                adlar.ContainsKey(kisiId) ? adlar[kisiId] : "Bilinmeyen",
                o.TeslimNotu,
                o.TeslimDosyaYolu,
                o.RedAciklamasi
            );
        }).ToList();

        return Ok(cevap);
    }

    [HttpPut("{id}/teslim")]
    public async Task<IActionResult> Teslim(int id, OdevTeslimIstegi istek)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var odev = await _db.Odevler.FindAsync(id);
        if (odev is null) return NotFound();

        if (odev.OgrenciId != kullaniciId)
            return Forbid();

        odev.Durum = "teslim_edildi";
        odev.TeslimNotu = istek.TeslimNotu;
        odev.RedAciklamasi = null;
        await _db.SaveChangesAsync();

        return Ok(new { odev.Durum });
    }

    [HttpPut("{id}/geri-al")]
    public async Task<IActionResult> GeriAl(int id)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var odev = await _db.Odevler.FindAsync(id);
        if (odev is null) return NotFound();

        if (odev.OgrenciId != kullaniciId)
            return Forbid();

        odev.Durum = "bekliyor";
        odev.TeslimNotu = null;
        odev.TeslimDosyaYolu = null;
        await _db.SaveChangesAsync();

        return Ok(new { odev.Durum });
    }
    [HttpPut("{id}/onayla")]
public async Task<IActionResult> Onayla(int id)
{
    var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

    var odev = await _db.Odevler.FindAsync(id);
    if (odev is null) return NotFound();

    if (odev.VerenId != kullaniciId)
        return Forbid();

    odev.Durum = "onaylandi";
    await _db.SaveChangesAsync();

    return Ok(new { odev.Durum });
}

[HttpPut("{id}/reddet")]
public async Task<IActionResult> Reddet(int id, OdevRedIstegi istek)
{
    var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

    var odev = await _db.Odevler.FindAsync(id);
    if (odev is null) return NotFound();

    if (odev.VerenId != kullaniciId)
        return Forbid();

    odev.Durum = "reddedildi";
    odev.RedAciklamasi = istek.Aciklama;
    await _db.SaveChangesAsync();

    return Ok(new { odev.Durum });
}

    [HttpPost("{id}/dosya")]
    public async Task<IActionResult> DosyaYukle(int id, IFormFile dosya)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var odev = await _db.Odevler.FindAsync(id);
        if (odev is null) return NotFound();

        if (odev.OgrenciId != kullaniciId)
            return Forbid();

        if (dosya is null || dosya.Length == 0)
            return BadRequest(new { mesaj = "Dosya seçilmedi" });

        var klasor = Path.Combine("wwwroot", "odevler");
        Directory.CreateDirectory(klasor);

        var dosyaAdi = $"{Guid.NewGuid()}{Path.GetExtension(dosya.FileName)}";
        var tamYol = Path.Combine(klasor, dosyaAdi);

        using (var stream = new FileStream(tamYol, FileMode.Create))
        {
            await dosya.CopyToAsync(stream);
        }

        odev.TeslimDosyaYolu = $"/odevler/{dosyaAdi}";
        await _db.SaveChangesAsync();

        return Ok(new { dosyaYolu = odev.TeslimDosyaYolu });
    }
    
}
