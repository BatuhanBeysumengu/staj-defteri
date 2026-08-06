using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;
using StajDefteri.Api.Dtos;
using StajDefteri.Api.Services;

namespace StajDefteri.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KayitlarController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly LogService _logService;
    private readonly OcrService _ocrService;
    private readonly PdfService _pdfService;

    public KayitlarController(AppDbContext db, LogService logService, OcrService ocrService, PdfService pdfService)
    {
        _db = db;
        _logService = logService;
        _ocrService = ocrService;
        _pdfService = pdfService;
    }

    [HttpGet("benim")]
    public async Task<IActionResult> BenimKayitlarim()
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);
        var rol = User.FindFirst("rol")!.Value;

        List<DefterKaydi> hamKayitlar;

        if (rol == "yetkili")
        {
            var ogrenciIdleri = await _db.Kullanicilar
                .Where(k => k.YetkiliId == kullaniciId)
                .Select(k => k.Id)
                .ToListAsync();

            hamKayitlar = await _db.DefterKayitlari
                .Where(k => ogrenciIdleri.Contains(k.OgrenciId))
                .OrderByDescending(k => k.Tarih)
                .ToListAsync();
        }
        else
        {
            hamKayitlar = await _db.DefterKayitlari
                .Where(k => k.OgrenciId == kullaniciId)
                .OrderByDescending(k => k.Tarih)
                .ToListAsync();
        }

        var reddedenIdler = hamKayitlar
            .Where(k => k.ReddedenId != null)
            .Select(k => k.ReddedenId!.Value)
            .Distinct()
            .ToList();

        var isimler = await _db.Kullanicilar
            .Where(k => reddedenIdler.Contains(k.Id))
            .ToDictionaryAsync(k => k.Id, k => k.Ad);

        var cevap = hamKayitlar.Select(k => new KayitCevabi(
            k.Id,
            k.Tarih,
            k.Icerik,
            k.Durum,
            k.OgrenciId,
            k.RedAciklamasi,
            k.RedTarihi,
            k.ReddedenId != null && isimler.ContainsKey(k.ReddedenId.Value)
                ? isimler[k.ReddedenId.Value]
                : null
        )).ToList();

        return Ok(cevap);
    }

    [HttpGet("kullanici/{kullaniciId}")]
    public async Task<IActionResult> KullaniciKayitlari(int kullaniciId)
    {
        var bakanId = int.Parse(User.FindFirst("id")!.Value);

        var kayitlar = await _db.DefterKayitlari
            .Where(k => k.OgrenciId == kullaniciId)
            .OrderByDescending(k => k.Tarih)
            .ToListAsync();

        bool arkadasMi = await _db.Arkadasliklar.AnyAsync(a =>
            a.Durum == "kabul" &&
            ((a.GonderenId == bakanId && a.AliciId == kullaniciId) ||
             (a.GonderenId == kullaniciId && a.AliciId == bakanId)));

        bool kendisiMi = bakanId == kullaniciId;

        var gorunenler = kayitlar.Where(k =>
            kendisiMi ||
            k.Gorunurluk == "public" ||
            (k.Gorunurluk == "friends" && arkadasMi)
        ).ToList();

        return Ok(gorunenler.Select(k => new
        {
            k.Id, k.Tarih, k.Icerik, k.Durum, k.Gorunurluk
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Ekle(KayitEkleIstegi istek)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var gecerliler = new[] { "public", "friends", "private" };
        var gorunurluk = gecerliler.Contains(istek.Gorunurluk) ? istek.Gorunurluk : "private";

        var yeniKayit = new DefterKaydi
        {
            Icerik = istek.Icerik,
            OgrenciId = kullaniciId,
            Tarih = DateOnly.FromDateTime(DateTime.Now),
            Durum = "bekliyor",
            Gorunurluk = gorunurluk
        };

        _db.DefterKayitlari.Add(yeniKayit);
        await _db.SaveChangesAsync();

        return Ok(yeniKayit);
    }

    [HttpPut("{id}/onayla")]
    public async Task<IActionResult> Onayla(int id)
    {
        var kayit = await _db.DefterKayitlari.FindAsync(id);
        if (kayit is null) return NotFound();

        kayit.Durum = "onaylandi";
        await _db.SaveChangesAsync();

        var yapanId = int.Parse(User.FindFirst("id")!.Value);
        var yapanAd = User.FindFirst("ad")!.Value;
        await _logService.Kaydet(yapanId, yapanAd, "onay", $"{id} numaralı kayıt onaylandı");
        Serilog.Log.Information("Onay: {Ad} → kayıt {Id}", yapanAd, id);

        return Ok(kayit);
    }

    [HttpPut("{id}/reddet")]
    public async Task<IActionResult> Reddet(int id, RedIstegi istek)
    {
        var kayit = await _db.DefterKayitlari.FindAsync(id);
        if (kayit is null) return NotFound();

        var reddedenId = int.Parse(User.FindFirst("id")!.Value);
        var reddedenAd = User.FindFirst("ad")!.Value;

        kayit.Durum = "reddedildi";
        kayit.RedAciklamasi = istek.Aciklama;
        kayit.RedTarihi = DateTime.Now;
        kayit.ReddedenId = reddedenId;

        await _db.SaveChangesAsync();

        await _logService.Kaydet(reddedenId, reddedenAd, "ret", $"{id} numaralı kayıt reddedildi: {istek.Aciklama}");
        Serilog.Log.Information("Ret: {Ad} → kayıt {Id}", reddedenAd, id);

        return Ok(kayit);
    }

    [HttpPut("{id}/gorunurluk")]
    public async Task<IActionResult> GorunurlukGuncelle(int id, GorunurlukIstegi istek)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);

        var kayit = await _db.DefterKayitlari.FindAsync(id);
        if (kayit is null) return NotFound();

        if (kayit.OgrenciId != kullaniciId)
            return Forbid();

        var gecerliler = new[] { "public", "friends", "private" };
        if (!gecerliler.Contains(istek.Gorunurluk))
            return BadRequest(new { mesaj = "Geçersiz görünürlük" });

        kayit.Gorunurluk = istek.Gorunurluk;
        await _db.SaveChangesAsync();

        return Ok(new { mesaj = "Görünürlük güncellendi" });
    }

    [HttpPost("ocr")]
    public async Task<IActionResult> FotograftanMetin(IFormFile dosya)
    {
        if (dosya is null || dosya.Length == 0)
            return BadRequest(new { mesaj = "Dosya seçilmedi" });

        var klasor = Path.Combine("wwwroot", "yuklenenler");
        Directory.CreateDirectory(klasor);

        var dosyaAdi = $"{Guid.NewGuid()}{Path.GetExtension(dosya.FileName)}";
        var tamYol = Path.Combine(klasor, dosyaAdi);

        using (var stream = new FileStream(tamYol, FileMode.Create))
        {
            await dosya.CopyToAsync(stream);
        }

        var metin = _ocrService.MetinCikar(tamYol);

        return Ok(new { metin, dosyaYolu = $"/yuklenenler/{dosyaAdi}" });
    }

    [HttpPost("pdf")]
    public async Task<IActionResult> Pdf(PdfIstegi istek)
    {
        var kullaniciId = int.Parse(User.FindFirst("id")!.Value);
        var kullaniciAd = User.FindFirst("ad")!.Value;

        var kayitlar = await _db.DefterKayitlari
            .Where(k => k.OgrenciId == kullaniciId && istek.KayitIdler.Contains(k.Id))
            .OrderByDescending(k => k.Tarih)
            .ToListAsync();

        if (kayitlar.Count == 0)
            return BadRequest(new { mesaj = "Seçili kayıt bulunamadı" });

        var pdfBytes = _pdfService.KayitlarPdf(kullaniciAd, kayitlar);
        return File(pdfBytes, "application/pdf", "staj-defteri.pdf");
    }
}