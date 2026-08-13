using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Data;

namespace StajDefteri.Api.Services;

public class HatirlatmaScheduler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly TimeSpan _aralik = TimeSpan.FromHours(24);
    private const int GunEsigi = 3;

    public HatirlatmaScheduler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken durdurmaTokeni)
    {
        while (!durdurmaTokeni.IsCancellationRequested)
        {
            await HatirlatmalariGonder();
            await Task.Delay(_aralik, durdurmaTokeni);
        }
    }

    private async Task HatirlatmalariGonder()
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var bildirim = scope.ServiceProvider.GetRequiredService<BildirimServisi>();

        var ogrenciler = await db.Kullanicilar
            .Where(k => k.Rol == "ogrenci")
            .Select(k => new { k.Id })
            .ToListAsync();

        var ogrenciIdler = ogrenciler.Select(o => o.Id).ToList();

        var sonKayitlar = await db.DefterKayitlari
            .Where(d => ogrenciIdler.Contains(d.OgrenciId))
            .GroupBy(d => d.OgrenciId)
            .Select(g => new { OgrenciId = g.Key, SonTarih = g.Max(x => x.Tarih) })
            .ToDictionaryAsync(x => x.OgrenciId, x => x.SonTarih);

        var bugun = DateOnly.FromDateTime(DateTime.Now);

        foreach (var o in ogrenciler)
        {
            int? gunFarki = sonKayitlar.TryGetValue(o.Id, out var t)
                ? bugun.DayNumber - t.DayNumber
                : null;

            if (gunFarki is null || gunFarki >= GunEsigi)
            {
                await bildirim.Ekle(
                    o.Id,
                    "Uzun süredir staj defterine kayıt girmedin. Unutma!",
                    "takip"
                );
            }
        }
    }
}