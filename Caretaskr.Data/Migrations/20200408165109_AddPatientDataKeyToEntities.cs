using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddPatientDataKeyToEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "PatientRecord",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "PatientNotes",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "Observation",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "Medications",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "ClinicalImpression",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "Careplans",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "CarePlanNote",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "CareplanFamilyGoal",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "AppointmentNotes",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "AppointmentFeedBacks",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "PatientDataKey",
                "PatientRecord");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "PatientNotes");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "Observation");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "MyGoals");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "Medications");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "ClinicalImpression");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "Careplans");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "CarePlanNote");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "CareplanFamilyGoal");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "Appointments");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "AppointmentNotes");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "AppointmentFeedBacks");
        }
    }
}