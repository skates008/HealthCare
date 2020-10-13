using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appointment_teamid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "TeamId",
                "Appointments",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_Appointments_TeamId",
                "Appointments",
                "TeamId");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_Team_TeamId",
                "Appointments",
                "TeamId",
                "Team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_Team_TeamId",
                "Appointments");

            migrationBuilder.DropIndex(
                "IX_Appointments_TeamId",
                "Appointments");

            migrationBuilder.DropColumn(
                "TeamId",
                "Appointments");
        }
    }
}