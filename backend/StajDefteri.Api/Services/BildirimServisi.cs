using StajDefteri.Api.Data;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Services;

public class BildirimServisi
{
    private readonly AppDbContext _db;

    public BildirimServisi(AppDbContext db)
    {
        _db = db;
    }

    public async Task Ekle(int kullaniciId, string metin, string tur, string? link = null)
    {
        var bildirim = new Bildirim
        {
            KullaniciId = kullaniciId,
            Metin = metin,
            Tur = tur,
            Link = link,
            Okundu = false,
            Tarih = DateTime.Now
        };

        _db.Bildirimler.Add(bildirim);
        await _db.SaveChangesAsync();
    }
}