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
public class MesajController : ControllerBase
{
    private readonly AppDbContext _db;

    public MesajController(AppDbContext db)
    {
        _db = db;
    }
    private async Task<bool> ArkadasMi(int a, int b)
    {
        return await _db.Arkadasliklar.AnyAsync(x =>
            x.Durum == "kabul" &&
            ((x.GonderenId == a && x.AliciId == b) ||
             (x.GonderenId == b && x.AliciId == a)));
    }
    [HttpPost("gonder")]
    public async Task<IActionResult> Gonder(MesajGonder istek)
    {
        var gonderenId = int.Parse(User.FindFirst("id")!.Value);

        if (gonderenId == istek.AliciId)
            return BadRequest(new { mesaj = "Kendinize mesaj gönderemezsiniz" });
        if (!await ArkadasMi(gonderenId, istek.AliciId))
            return BadRequest(new { mesaj = "Sadece arkadaşlarınıza mesaj gönderebilirsiniz" });
        if (string.IsNullOrWhiteSpace(istek.Icerik) && istek.PaylasilanKayitId is null)
            return BadRequest(new { mesaj = "Mesaj boş olamaz" });

        var yeni = new Mesaj
        {
            GonderenId = gonderenId,
            AliciId = istek.AliciId,
            Icerik = istek.Icerik,
            PaylasilanKayitId = istek.PaylasilanKayitId,
            Tarih = DateTime.Now
        };

        _db.Mesajlar.Add(yeni);
        await _db.SaveChangesAsync();

        return Ok(new { yeni.Id });
    }
    [HttpGet("konusma/{digerId}")]
    public async Task<IActionResult> Konusma(int digerId)
    {
        var benId = int.Parse(User.FindFirst("id")!.Value);

        var mesajlar = await _db.Mesajlar
            .Where(m =>
                (m.GonderenId == benId && m.AliciId == digerId) ||
                (m.GonderenId == digerId && m.AliciId == benId))
            .OrderBy(m => m.Tarih)
            .ToListAsync();
        var kayitIdler = mesajlar
            .Where(m => m.PaylasilanKayitId != null)
            .Select(m => m.PaylasilanKayitId!.Value)
            .Distinct()
            .ToList();

        var kayitOnizleme = await _db.DefterKayitlari
            .Where(k => kayitIdler.Contains(k.Id))
            .ToDictionaryAsync(k => k.Id, k => k.Icerik);

        var cevap = mesajlar.Select(m => new MesajCevabi(
            m.Id,
            m.GonderenId,
            m.AliciId,
            m.Icerik,
            m.PaylasilanKayitId,
            m.PaylasilanKayitId != null && kayitOnizleme.ContainsKey(m.PaylasilanKayitId.Value)
                ? kayitOnizleme[m.PaylasilanKayitId.Value]
                : null,
            m.Tarih
        )).ToList();

        return Ok(cevap);
    }
   [HttpGet("kutu")]
public async Task<IActionResult> Kutu()
{
    var benId = int.Parse(User.FindFirst("id")!.Value);

    var mesajlar = await _db.Mesajlar
        .Where(m => m.GonderenId == benId || m.AliciId == benId)
        .OrderByDescending(m => m.Tarih)
        .ToListAsync();

    var konusmalar = mesajlar
        .GroupBy(m => m.GonderenId == benId ? m.AliciId : m.GonderenId)
        .Select(g => new { DigerId = g.Key, SonMesaj = g.OrderByDescending(x => x.Tarih).First() })
        .ToList();

    var digerIdler = konusmalar.Select(k => k.DigerId).ToList();
    var adlar = await _db.Kullanicilar
        .Where(k => digerIdler.Contains(k.Id))
        .ToDictionaryAsync(k => k.Id, k => k.Ad);

    var cevap = konusmalar.Select(k => new KonusmaOzeti(
        k.DigerId,
        adlar.ContainsKey(k.DigerId) ? adlar[k.DigerId] : "Bilinmeyen",
        k.SonMesaj.Icerik ?? "Kayit paylasildi",
        k.SonMesaj.Tarih
    )).OrderByDescending(k => k.SonTarih).ToList();

    return Ok(cevap);
}
}