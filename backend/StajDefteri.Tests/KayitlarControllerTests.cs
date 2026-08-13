using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Controllers;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;
using Xunit;
using StajDefteri.Api.Services;
using StajDefteri.Api.Dtos;

namespace StajDefteri.Tests;

public class KayitlarControllerTests
{
  
    private AppDbContext YeniDb()
    {
        var secenekler = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(secenekler);
    }

    private KayitlarController KurController(AppDbContext db, int kullaniciId, string rol)
    {
        var logService = new LogService(db);
        var controller = new KayitlarController(db, logService);

        var kimlik = new ClaimsIdentity(new[]
        {
            new Claim("id", kullaniciId.ToString()),
            new Claim("rol", rol),
        });
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(kimlik) }
        };
        return controller;
}

    [Fact]
    public async Task GorunurlukGuncelle_BaskasininKaydi_Forbid_Doner()
    {
        var db = YeniDb();
        db.DefterKayitlari.Add(new DefterKaydi
        {
            Id = 1, OgrenciId = 5, Icerik = "test", Durum = "bekliyor",
            Tarih = new DateOnly(2026, 8, 1), Gorunurluk = "private"
        });
        await db.SaveChangesAsync();

        var controller = KurController(db, kullaniciId: 99, rol: "ogrenci");

        var sonuc = await controller.GorunurlukGuncelle(1, new GorunurlukIstegi("public"));

        Assert.IsType<ForbidResult>(sonuc);
    }
}