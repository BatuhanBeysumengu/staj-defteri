using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Controllers;
using StajDefteri.Api.Data;
using StajDefteri.Api.Dtos;
using StajDefteri.Api.Models;
using Xunit;

namespace StajDefteri.Tests;

public class OdevControllerTests
{
    private AppDbContext YeniDb()
    {
        var secenekler = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(secenekler);
    }

    private OdevController KurController(AppDbContext db, int kullaniciId, string rol)
    {
        var controller = new OdevController(db);

        var kimlik = new ClaimsIdentity(new[]
        {
            new Claim("id", kullaniciId.ToString()),
            new Claim("rol", rol),
        });

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(kimlik)
            }
        };

        return controller;
    }

    [Fact]
    public async Task Ver_YetkiliDegilse_Forbid_Doner()
    {
        var db = YeniDb();
        var controller = KurController(db, kullaniciId: 1, rol: "ogrenci");

        var istek = new OdevVerIstegi("Test Ödevi", "açıklama", new DateOnly(2026, 12, 1), 2);

        var sonuc = await controller.Ver(istek);

        Assert.IsType<ForbidResult>(sonuc);
    }
    [Fact]
public async Task Ver_Yetkili_BasariliOlur()
{
    var db = YeniDb();
    db.Kullanicilar.Add(new Kullanici { Id = 2, Ad = "Ali", Rol = "ogrenci", Email = "a@a.com", SifreHash = "x" });
    await db.SaveChangesAsync();

    var controller = KurController(db, kullaniciId: 1, rol: "yetkili");
    var istek = new OdevVerIstegi("Test Ödevi", "açıklama", new DateOnly(2026, 12, 1), 2);

    var sonuc = await controller.Ver(istek);

    Assert.IsType<OkObjectResult>(sonuc);
    Assert.Equal(1, await db.Odevler.CountAsync());
}

[Fact]
public async Task Ver_BosBaslik_BadRequest_Doner()
{
    var db = YeniDb();
    var controller = KurController(db, kullaniciId: 1, rol: "yetkili");
    var istek = new OdevVerIstegi("", "açıklama", new DateOnly(2026, 12, 1), 2);

    var sonuc = await controller.Ver(istek);

    Assert.IsType<BadRequestObjectResult>(sonuc);
}

[Fact]
public async Task Teslim_BaskasininOdevi_Forbid_Doner()
{
    var db = YeniDb();
    db.Odevler.Add(new Odev
    {
        Id = 1, Baslik = "Ödev", Aciklama = "", OgrenciId = 5, VerenId = 1,
        Durum = "bekliyor", SonTeslimTarihi = new DateOnly(2026, 12, 1), OlusturmaTarihi = DateTime.Now
    });
    await db.SaveChangesAsync();

    var controller = KurController(db, kullaniciId: 99, rol: "ogrenci");
    var istek = new OdevTeslimIstegi("teslim notu");

    var sonuc = await controller.Teslim(1, istek);

    Assert.IsType<ForbidResult>(sonuc);
}

[Fact]
public async Task Onayla_VerenDegilse_Forbid_Doner()
{
    var db = YeniDb();
    db.Odevler.Add(new Odev
    {
        Id = 1, Baslik = "Ödev", Aciklama = "", OgrenciId = 5, VerenId = 1,
        Durum = "teslim_edildi", SonTeslimTarihi = new DateOnly(2026, 12, 1), OlusturmaTarihi = DateTime.Now
    });
    await db.SaveChangesAsync();

    var controller = KurController(db, kullaniciId: 99, rol: "yetkili");

    var sonuc = await controller.Onayla(1);

    Assert.IsType<ForbidResult>(sonuc);
}
}