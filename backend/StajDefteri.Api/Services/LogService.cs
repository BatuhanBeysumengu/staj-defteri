using StajDefteri.Api.Data;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Services;

public class LogService
{
    private readonly AppDbContext _db;

    public LogService(AppDbContext db)
    {
        _db = db;
    }

    public async Task Kaydet(int kullaniciId, string kullaniciAd, string islem, string detay)
    {
        var log = new IslemLog
        {
            KullaniciId = kullaniciId,
            KullaniciAd = kullaniciAd,
            Islem = islem,
            Detay = detay,
            Tarih = DateTime.Now
        };

        _db.IslemLoglari.Add(log);
        await _db.SaveChangesAsync();
    }
}