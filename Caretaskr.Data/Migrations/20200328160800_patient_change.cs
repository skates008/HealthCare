using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class patient_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "Country",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "DateOfBirth",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "Ethnicity",
                "Patients",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "FirstName",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "Gender",
                "Patients",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "LastName",
                "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PreferredName",
                "Patients",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "Country",
                "Patients");

            migrationBuilder.DropColumn(
                "DateOfBirth",
                "Patients");

            migrationBuilder.DropColumn(
                "Ethnicity",
                "Patients");

            migrationBuilder.DropColumn(
                "FirstName",
                "Patients");

            migrationBuilder.DropColumn(
                "Gender",
                "Patients");

            migrationBuilder.DropColumn(
                "LastName",
                "Patients");

            migrationBuilder.DropColumn(
                "PreferredName",
                "Patients");
        }
    }
}