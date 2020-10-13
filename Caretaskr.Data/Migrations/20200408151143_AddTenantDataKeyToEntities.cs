using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddTenantDataKeyToEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "TimeEntry",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "ProviderUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "PatientRecord",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "PatientNotes",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "Observation",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "FundedSupports",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "FundCategorys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "ClinicalImpression",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "Careplans",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "CarePlanNote",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "CareplanFamilyGoal",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "AppointmentNotes",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "AppointmentFeedBacks",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "TenantDataKey",
                "TimeEntry");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "ProviderUsers");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "PatientRecord");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "PatientNotes");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "Observation");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "MyGoals");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "FundedSupports");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "FundCategorys");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "ClinicalImpression");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "Careplans");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "CarePlanNote");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "CareplanFamilyGoal");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "Appointments");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "AppointmentNotes");

            migrationBuilder.DropColumn(
                "TenantDataKey",
                "AppointmentFeedBacks");
        }
    }
}