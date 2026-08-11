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

public class BaglantiTests
{
    private AppDbContext YeniDb()
    {
        var secenekler = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(secenekler);
    }

    private BaglantiController Kur(AppDbContext db, int kullaniciId, string rol)
    {
        var controller = new BaglantiController(db);
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
    public async Task Gonder_YetkiliGonderemez_Forbid_Doner()
    {
        var db = YeniDb();
        db.Kullanicilar.Add(new Kullanici { Id = 2, Ad = "Hoca", Rol = "yetkili", Email = "h@h.com", SifreHash = "x" });
        await db.SaveChangesAsync();

        var controller = Kur(db, kullaniciId: 1, rol: "yetkili");

        var sonuc = await controller.Gonder(new BaglantiIstegiGonder(2, "merhaba"));

        Assert.IsType<BadRequestObjectResult>(sonuc);
    }
}