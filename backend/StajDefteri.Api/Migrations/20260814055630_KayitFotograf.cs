using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class KayitFotograf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FotografYolu",
                table: "DefterKayitlari",
                type: "TEXT",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "DefterKayitlari",
                keyColumn: "Id",
                keyValue: 1,
                column: "FotografYolu",
                value: null);

            migrationBuilder.UpdateData(
                table: "DefterKayitlari",
                keyColumn: "Id",
                keyValue: 2,
                column: "FotografYolu",
                value: null);

            migrationBuilder.UpdateData(
                table: "DefterKayitlari",
                keyColumn: "Id",
                keyValue: 3,
                column: "FotografYolu",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FotografYolu",
                table: "DefterKayitlari");
        }
    }
}
