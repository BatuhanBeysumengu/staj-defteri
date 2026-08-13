using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Controllers;
using StajDefteri.Api.Data;
using StajDefteri.Api.Models;
using Xunit;

namespace StajDefteri.Tests;

public class BaglantiArkadaslikTests
{
    private static AppDbContext YeniDb()
    {
        var secenekler = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(secenekler);
    }

    private static T Kur<T>(T controller, int kullaniciId, string rol) where T : ControllerBase
    {
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
    public async Task ArkadaslikGonder_Kendine_BadRequest_Doner()
    {
        var db = YeniDb();
        var controller = Kur(new ArkadaslikController(db), kullaniciId: 1, rol: "ogrenci");

        var sonuc = await controller.Gonder(1);

        Assert.IsType<BadRequestObjectResult>(sonuc);
    }
    [Fact]
    public async Task ArkadaslikGonder_Gecerli_BasariliOlur()
    {
        var db = YeniDb();
        db.Kullanicilar.Add(new Kullanici { Id = 2, Ad = "Ali", Rol = "ogrenci", Email = "a@a.com", SifreHash = "x" });
        await db.SaveChangesAsync();

        var controller = Kur(new ArkadaslikController(db), kullaniciId: 1, rol: "ogrenci");

        var sonuc = await controller.Gonder(2);

        Assert.IsType<OkObjectResult>(sonuc);
        Assert.Equal(1, await db.Arkadasliklar.CountAsync());
    }
}