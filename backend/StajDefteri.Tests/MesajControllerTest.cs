using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Controllers;
using StajDefteri.Api.Data;
using StajDefteri.Api.Dtos;
using StajDefteri.Api.Models;
using StajDefteri.Api.Services;
using Xunit;

namespace StajDefteri.Tests;

public class MesajControllerTests
{
    private AppDbContext YeniDb()
    {
        var secenekler = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(secenekler);
    }

    private MesajController KurController(AppDbContext db, int kullaniciId)
    {
        var bildirim = new BildirimServisi(db);
        var controller = new MesajController(db, bildirim);
        var kimlik = new ClaimsIdentity(new[] { new Claim("id", kullaniciId.ToString()) });
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(kimlik) }
        };
        return controller;
    }

    [Fact]
    public async Task Gonder_ArkadasDegilse_BadRequest_Doner()
    {
        var db = YeniDb();
        var controller = KurController(db, kullaniciId: 1);
        var istek = new MesajGonder(2, "selam", null);

        var sonuc = await controller.Gonder(istek);

        Assert.IsType<BadRequestObjectResult>(sonuc);
    }

    [Fact]
    public async Task Gonder_Arkadassa_BasariliOlur()
    {
        var db = YeniDb();
        db.Arkadasliklar.Add(new Arkadaslik { Id = 1, GonderenId = 1, AliciId = 2, Durum = "kabul" });
        await db.SaveChangesAsync();

        var controller = KurController(db, kullaniciId: 1);
        var istek = new MesajGonder(2, "selam", null);

        var sonuc = await controller.Gonder(istek);

        Assert.IsType<OkObjectResult>(sonuc);
        Assert.Equal(1, await db.Mesajlar.CountAsync());
    }

    [Fact]
    public async Task Gonder_KendineMesaj_BadRequest_Doner()
    {
        var db = YeniDb();
        var controller = KurController(db, kullaniciId: 1);
        var istek = new MesajGonder(1, "selam", null);

        var sonuc = await controller.Gonder(istek);

        Assert.IsType<BadRequestObjectResult>(sonuc);
    }
}