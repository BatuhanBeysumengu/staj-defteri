using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StajDefteri.Api.Migrations
{
    /// <inheritdoc />
    public partial class OdevRedAlani : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RedAciklamasi",
                table: "Odevler",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RedAciklamasi",
                table: "Odevler");
        }
    }
}
