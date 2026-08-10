using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class OdevTeslim : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeslimDosyaYolu",
                table: "Odevler",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeslimNotu",
                table: "Odevler",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TeslimDosyaYolu",
                table: "Odevler");

            migrationBuilder.DropColumn(
                name: "TeslimNotu",
                table: "Odevler");
        }
    }
}
