using Microsoft.EntityFrameworkCore;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options): base(options) {}
  public DbSet<Kullanici> Kullancilar => Set<Kullanici>();
  public DbSet<DefterKaydi> DefterKayitlari => Set<DefterKaydi>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Kullanici>().HasData(
      new Kullanici { Id = 1 ,Email = "ogrenci@test.com", Ad = "Batuhan", Rol = "ogrenci", YetkiliId=3},
      new Kullanici { Id = 2, Email = "ogrenci2@test.com", Ad = "Ayse",        Rol = "ogrenci", YetkiliId = 4 },
      new Kullanici { Id = 3, Email = "yetkili@test.com", Ad = "Ahmet Hoca",  Rol = "yetkili", YetkiliId = null },
      new Kullanici { Id = 4, Email = "yetkili2@test.com", Ad = "Zeynep Hoca", Rol = "yetkili", YetkiliId = null }
    );
    modelBuilder.Entity<DefterKaydi>().HasData(
      new DefterKaydi { Id = 1, Tarih = new DateOnly(2026, 7, 20), Icerik = "Proje kurulumu yapildi",    Durum = "bekliyor",  OgrenciId = 1 },
      new DefterKaydi { Id = 2, Tarih = new DateOnly(2026, 7, 21), Icerik = "Login ekrani tamamlandi",   Durum = "onaylandi", OgrenciId = 1 },
      new DefterKaydi { Id = 3, Tarih = new DateOnly(2026, 7, 22), Icerik = "Veritabani semasi cizildi", Durum = "bekliyor",  OgrenciId = 2 }
    );
  }

}