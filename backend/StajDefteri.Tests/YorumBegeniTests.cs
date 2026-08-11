using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Controllers;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;
using Xunit;

namespace StajDefteri.Tests;

public class YorumBegeniTests
{
    private AppDbContext YeniDb()
    {
        var secenekler = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(secenekler);
    }

    private T Kur<T>(T controller, int kullaniciId) where T : ControllerBase
    {
        var kimlik = new ClaimsIdentity(new[] { new Claim("id", kullaniciId.ToString()) });
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(kimlik) }
        };
        return controller;
    }

    [Fact]
    public async Task YorumSil_BaskasininYorumu_Forbid_Doner()
    {
        var db = YeniDb();
        db.Yorumlar.Add(new Yorum { Id = 1, KayitId = 1, KullaniciId = 5, Icerik = "test", Tarih = DateTime.Now });
        await db.SaveChangesAsync();

        var controller = Kur(new YorumController(db), kullaniciId: 99);

        var sonuc = await controller.Sil(1);

        Assert.IsType<ForbidResult>(sonuc);
    }

    [Fact]
    public async Task BegeniToggle_IlkBasis_Ekler()
    {
        var db = YeniDb();
        var controller = Kur(new BegeniController(db), kullaniciId: 1);

        var sonuc = await controller.Toggle(1);

        Assert.IsType<OkObjectResult>(sonuc);
        Assert.Equal(1, await db.Begeniler.CountAsync());
    }
}