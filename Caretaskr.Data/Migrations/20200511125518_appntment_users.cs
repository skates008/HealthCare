using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appntment_users : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_AspNetUsers_PractitionerId",
                "Appointments");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_AspNetUsers_PractitionerId",
                "Appointments",
                "PractitionerId",
                "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_AspNetUsers_PractitionerId",
                "Appointments");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_AspNetUsers_PractitionerId",
                "Appointments",
                "PractitionerId",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}