using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class IlkKurulum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DefterKayitlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Tarih = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Icerik = table.Column<string>(type: "TEXT", nullable: false),
                    Durum = table.Column<string>(type: "TEXT", nullable: false),
                    OgrenciId = table.Column<int>(type: "INTEGER", nullable: false),
                    RedAciklamasi = table.Column<string>(type: "TEXT", nullable: true),
                    RedTarihi = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ReddedenId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefterKayitlari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Ad = table.Column<string>(type: "TEXT", nullable: false),
                    Rol = table.Column<string>(type: "TEXT", nullable: false),
                    YetkiliId = table.Column<int>(type: "INTEGER", nullable: true),
                    SifreHash = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "DefterKayitlari",
                columns: new[] { "Id", "Durum", "Icerik", "OgrenciId", "RedAciklamasi", "RedTarihi", "ReddedenId", "Tarih" },
                values: new object[,]
                {
                    { 1, "bekliyor", "Proje kurulumu yapildi", 1, null, null, null, new DateOnly(2026, 7, 20) },
                    { 2, "onaylandi", "Login ekrani tamamlandi", 1, null, null, null, new DateOnly(2026, 7, 21) },
                    { 3, "bekliyor", "Veritabani semasi cizildi", 2, null, null, null, new DateOnly(2026, 7, 22) }
                });

            migrationBuilder.InsertData(
                table: "Kullanicilar",
                columns: new[] { "Id", "Ad", "Email", "Rol", "SifreHash", "YetkiliId" },
                values: new object[,]
                {
                    { 1, "Batuhan", "ogrenci@test.com", "ogrenci", "$2a$11$bLvP3vhYl5kBk.kceeRUcup80fR1s022je218yJpE11uxNv.JXjDa", 3 },
                    { 2, "Ayse", "ogrenci2@test.com", "ogrenci", "$2a$11$bLvP3vhYl5kBk.kceeRUcup80fR1s022je218yJpE11uxNv.JXjDa", 4 },
                    { 3, "Ahmet Hoca", "yetkili@test.com", "yetkili", "$2a$11$bLvP3vhYl5kBk.kceeRUcup80fR1s022je218yJpE11uxNv.JXjDa", null },
                    { 4, "Zeynep Hoca", "yetkili2@test.com", "yetkili", "$2a$11$bLvP3vhYl5kBk.kceeRUcup80fR1s022je218yJpE11uxNv.JXjDa", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DefterKayitlari");

            migrationBuilder.DropTable(
                name: "Kullanicilar");
        }
    }
}
