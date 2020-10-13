using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class patient_change3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                "Ethnicity",
                "Patients",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                "SchoolAddress",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "SchoolContactNumber",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "SchoolEmail",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "SchoolName",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "SchoolPrimaryContact",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "SchoolTeacherEmail",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "SchoolTeacherName",
                "Patients",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "SchoolAddress",
                "Patients");

            migrationBuilder.DropColumn(
                "SchoolContactNumber",
                "Patients");

            migrationBuilder.DropColumn(
                "SchoolEmail",
                "Patients");

            migrationBuilder.DropColumn(
                "SchoolName",
                "Patients");

            migrationBuilder.DropColumn(
                "SchoolPrimaryContact",
                "Patients");

            migrationBuilder.DropColumn(
                "SchoolTeacherEmail",
                "Patients");

            migrationBuilder.DropColumn(
                "SchoolTeacherName",
                "Patients");

            migrationBuilder.AlterColumn<int>(
                "Ethnicity",
                "Patients",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}