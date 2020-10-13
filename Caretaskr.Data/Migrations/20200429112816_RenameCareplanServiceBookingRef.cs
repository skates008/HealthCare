using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class RenameCareplanServiceBookingRef : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "ServiceBooking",
                "Careplans");

            migrationBuilder.AddColumn<string>(
                "ServiceBookingReference",
                "Careplans",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "ServiceBookingReference",
                "Careplans");

            migrationBuilder.AddColumn<string>(
                "ServiceBooking",
                "Careplans",
                "nvarchar(max)",
                nullable: true);
        }
    }
}