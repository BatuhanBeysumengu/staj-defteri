using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class ArkadaslikEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Arkadasliklar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GonderenId = table.Column<int>(type: "INTEGER", nullable: false),
                    AliciId = table.Column<int>(type: "INTEGER", nullable: false),
                    Durum = table.Column<string>(type: "TEXT", nullable: false),
                    Tarih = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Arkadasliklar", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Arkadasliklar");
        }
    }
}
