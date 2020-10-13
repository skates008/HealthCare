using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class TimeEntryCarePlanOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_Careplans_CarePlanId",
                "TimeEntry");

            migrationBuilder.AlterColumn<int>(
                "CarePlanId",
                "TimeEntry",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_Careplans_CarePlanId",
                "TimeEntry",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_Careplans_CarePlanId",
                "TimeEntry");

            migrationBuilder.AlterColumn<int>(
                "CarePlanId",
                "TimeEntry",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_Careplans_CarePlanId",
                "TimeEntry",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}