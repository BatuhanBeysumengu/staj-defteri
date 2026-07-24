using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class IlkOlusturma : Migration
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
                    OgrenciId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefterKayitlari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kullancilar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Ad = table.Column<string>(type: "TEXT", nullable: false),
                    Rol = table.Column<string>(type: "TEXT", nullable: false),
                    YetkiliId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullancilar", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "DefterKayitlari",
                columns: new[] { "Id", "Durum", "Icerik", "OgrenciId", "Tarih" },
                values: new object[,]
                {
                    { 1, "bekliyor", "Proje kurulumu yapildi", 1, new DateOnly(2026, 7, 20) },
                    { 2, "onaylandi", "Login ekrani tamamlandi", 1, new DateOnly(2026, 7, 21) },
                    { 3, "bekliyor", "Veritabani semasi cizildi", 2, new DateOnly(2026, 7, 22) }
                });

            migrationBuilder.InsertData(
                table: "Kullancilar",
                columns: new[] { "Id", "Ad", "Email", "Rol", "YetkiliId" },
                values: new object[,]
                {
                    { 1, "Batuhan", "ogrenci@test.com", "ogrenci", 3 },
                    { 2, "Ayse", "ogrenci2@test.com", "ogrenci", 4 },
                    { 3, "Ahmet Hoca", "yetkili@test.com", "yetkili", null },
                    { 4, "Zeynep Hoca", "yetkili2@test.com", "yetkili", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DefterKayitlari");

            migrationBuilder.DropTable(
                name: "Kullancilar");
        }
    }
}
