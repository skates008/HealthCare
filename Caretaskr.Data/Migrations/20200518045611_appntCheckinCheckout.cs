using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appntCheckinCheckout : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                "CheckInTime",
                "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "CheckOutTime",
                "Appointments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "CheckInTime",
                "Appointments");

            migrationBuilder.DropColumn(
                "CheckOutTime",
                "Appointments");
        }
    }
}