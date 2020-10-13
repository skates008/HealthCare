using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class UpdateCarePlanGoals2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Careplans_AspNetUsers_KeyPractitionerId",
                "Careplans");

            migrationBuilder.AddForeignKey(
                "FK_Careplans_AspNetUsers_KeyPractitionerId",
                "Careplans",
                "KeyPractitionerId",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Careplans_AspNetUsers_KeyPractitionerId",
                "Careplans");

            migrationBuilder.AddForeignKey(
                "FK_Careplans_AspNetUsers_KeyPractitionerId",
                "Careplans",
                "KeyPractitionerId",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}