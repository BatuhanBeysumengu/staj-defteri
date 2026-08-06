using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class GorunurlukEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gorunurluk",
                table: "DefterKayitlari",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "DefterKayitlari",
                keyColumn: "Id",
                keyValue: 1,
                column: "Gorunurluk",
                value: "private");

            migrationBuilder.UpdateData(
                table: "DefterKayitlari",
                keyColumn: "Id",
                keyValue: 2,
                column: "Gorunurluk",
                value: "private");

            migrationBuilder.UpdateData(
                table: "DefterKayitlari",
                keyColumn: "Id",
                keyValue: 3,
                column: "Gorunurluk",
                value: "private");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gorunurluk",
                table: "DefterKayitlari");
        }
    }
}
