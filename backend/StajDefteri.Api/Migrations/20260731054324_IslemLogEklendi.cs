using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class IslemLogEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IslemLoglari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    KullaniciId = table.Column<int>(type: "INTEGER", nullable: false),
                    KullaniciAd = table.Column<string>(type: "TEXT", nullable: false),
                    Islem = table.Column<string>(type: "TEXT", nullable: false),
                    Detay = table.Column<string>(type: "TEXT", nullable: false),
                    Tarih = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IslemLoglari", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IslemLoglari");
        }
    }
}
