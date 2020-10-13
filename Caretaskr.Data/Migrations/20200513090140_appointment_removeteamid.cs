using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appointment_removeteamid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "TeamId",
                "Appointments",
                "int",
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
    }
}