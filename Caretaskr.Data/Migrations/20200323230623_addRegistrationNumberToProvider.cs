using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class addRegistrationNumberToProvider : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients");

            migrationBuilder.RenameColumn(
                "Starttime",
                "TimeEntry",
                "StartTime");

            migrationBuilder.AddColumn<string>(
                "RegistrationNumber",
                "Provider",
                nullable: true);

            migrationBuilder.AddForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients",
                "providerId",
                "Provider",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients");

            migrationBuilder.DropColumn(
                "RegistrationNumber",
                "Provider");

            migrationBuilder.RenameColumn(
                "StartTime",
                "TimeEntry",
                "Starttime");

            migrationBuilder.AddForeignKey(
                "FK_Patients_Provider_providerId",
                "Patients",
                "providerId",
                "Provider",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}