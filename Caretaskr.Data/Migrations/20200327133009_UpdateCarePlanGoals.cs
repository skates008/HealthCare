using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class UpdateCarePlanGoals : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Careplans_Patients_PatientId",
                "Careplans");

            migrationBuilder.DropForeignKey(
                "FK_Careplans_AspNetUsers_PractitionerId",
                "Careplans");

            migrationBuilder.DropForeignKey(
                "FK_MyGoals_Careplans_CarePlanId",
                "MyGoals");

            migrationBuilder.DropIndex(
                "IX_MyGoals_CarePlanId",
                "MyGoals");

            migrationBuilder.DropIndex(
                "IX_Careplans_PatientId",
                "Careplans");

            migrationBuilder.DropIndex(
                "IX_Careplans_PractitionerId",
                "Careplans");

            migrationBuilder.DropColumn(
                "CarePlanId",
                "MyGoals");

            migrationBuilder.DropColumn(
                "GoalHow",
                "MyGoals");

            migrationBuilder.DropColumn(
                "GoalSupported",
                "MyGoals");

            migrationBuilder.DropColumn(
                "GoalTitle",
                "MyGoals");

            migrationBuilder.DropColumn(
                "PatientId",
                "Careplans");

            migrationBuilder.DropColumn(
                "PractitionerId",
                "Careplans");

            migrationBuilder.AddColumn<int>(
                "CareplanFamilyGoalId",
                "MyGoals",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                "CareplanFamilyGoalId1",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Description",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "Outcome",
                "MyGoals",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "OutcomeDetail",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Strategy",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Title",
                "MyGoals",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Goal",
                "Careplans",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "IssueDate",
                "Careplans",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                "KeyPractitionerId",
                "Careplans",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                "PatientRecordId",
                "Careplans",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "Recomendations",
                "Careplans",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "Status",
                "Careplans",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                "CareplanFamilyGoal",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    CareplanId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Strategy = table.Column<string>(nullable: true),
                    Support = table.Column<string>(nullable: true),
                    CareplanId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareplanFamilyGoal", x => x.Id);
                    table.ForeignKey(
                        "FK_CareplanFamilyGoal_Careplans_CareplanId",
                        x => x.CareplanId,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_CareplanFamilyGoal_Careplans_CareplanId1",
                        x => x.CareplanId1,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_CareplanFamilyGoal_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_CareplanFamilyGoal_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "CareplanPractitioner",
                table => new
                {
                    CareplanId = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareplanPractitioner", x => new {x.UserId, x.CareplanId});
                    table.ForeignKey(
                        "FK_CareplanPractitioner_Careplans_CareplanId",
                        x => x.CareplanId,
                        "Careplans",
                        "Id");
                    table.ForeignKey(
                        "FK_CareplanPractitioner_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_MyGoals_CareplanFamilyGoalId",
                "MyGoals",
                "CareplanFamilyGoalId");

            migrationBuilder.CreateIndex(
                "IX_MyGoals_CareplanFamilyGoalId1",
                "MyGoals",
                "CareplanFamilyGoalId1");

            migrationBuilder.CreateIndex(
                "IX_Careplans_KeyPractitionerId",
                "Careplans",
                "KeyPractitionerId");

            migrationBuilder.CreateIndex(
                "IX_Careplans_PatientRecordId",
                "Careplans",
                "PatientRecordId");

            migrationBuilder.CreateIndex(
                "IX_CareplanFamilyGoal_CareplanId",
                "CareplanFamilyGoal",
                "CareplanId");

            migrationBuilder.CreateIndex(
                "IX_CareplanFamilyGoal_CareplanId1",
                "CareplanFamilyGoal",
                "CareplanId1");

            migrationBuilder.CreateIndex(
                "IX_CareplanFamilyGoal_CreatedById",
                "CareplanFamilyGoal",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_CareplanFamilyGoal_ModifiedById",
                "CareplanFamilyGoal",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_CareplanPractitioner_CareplanId",
                "CareplanPractitioner",
                "CareplanId");

            migrationBuilder.AddForeignKey(
                "FK_Careplans_AspNetUsers_KeyPractitionerId",
                "Careplans",
                "KeyPractitionerId",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Careplans_PatientRecord_PatientRecordId",
                "Careplans",
                "PatientRecordId",
                "PatientRecord",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_CareplanFamilyGoal_CareplanFamilyGoalId",
                "MyGoals",
                "CareplanFamilyGoalId",
                "CareplanFamilyGoal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_CareplanFamilyGoal_CareplanFamilyGoalId1",
                "MyGoals",
                "CareplanFamilyGoalId1",
                "CareplanFamilyGoal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Careplans_AspNetUsers_KeyPractitionerId",
                "Careplans");

            migrationBuilder.DropForeignKey(
                "FK_Careplans_PatientRecord_PatientRecordId",
                "Careplans");

            migrationBuilder.DropForeignKey(
                "FK_MyGoals_CareplanFamilyGoal_CareplanFamilyGoalId",
                "MyGoals");

            migrationBuilder.DropForeignKey(
                "FK_MyGoals_CareplanFamilyGoal_CareplanFamilyGoalId1",
                "MyGoals");

            migrationBuilder.DropTable(
                "CareplanFamilyGoal");

            migrationBuilder.DropTable(
                "CareplanPractitioner");

            migrationBuilder.DropIndex(
                "IX_MyGoals_CareplanFamilyGoalId",
                "MyGoals");

            migrationBuilder.DropIndex(
                "IX_MyGoals_CareplanFamilyGoalId1",
                "MyGoals");

            migrationBuilder.DropIndex(
                "IX_Careplans_KeyPractitionerId",
                "Careplans");

            migrationBuilder.DropIndex(
                "IX_Careplans_PatientRecordId",
                "Careplans");

            migrationBuilder.DropColumn(
                "CareplanFamilyGoalId",
                "MyGoals");

            migrationBuilder.DropColumn(
                "CareplanFamilyGoalId1",
                "MyGoals");

            migrationBuilder.DropColumn(
                "Description",
                "MyGoals");

            migrationBuilder.DropColumn(
                "Outcome",
                "MyGoals");

            migrationBuilder.DropColumn(
                "OutcomeDetail",
                "MyGoals");

            migrationBuilder.DropColumn(
                "Strategy",
                "MyGoals");

            migrationBuilder.DropColumn(
                "Title",
                "MyGoals");

            migrationBuilder.DropColumn(
                "Goal",
                "Careplans");

            migrationBuilder.DropColumn(
                "IssueDate",
                "Careplans");

            migrationBuilder.DropColumn(
                "KeyPractitionerId",
                "Careplans");

            migrationBuilder.DropColumn(
                "PatientRecordId",
                "Careplans");

            migrationBuilder.DropColumn(
                "Recomendations",
                "Careplans");

            migrationBuilder.DropColumn(
                "Status",
                "Careplans");

            migrationBuilder.AddColumn<int>(
                "CarePlanId",
                "MyGoals",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                "GoalHow",
                "MyGoals",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "GoalSupported",
                "MyGoals",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "GoalTitle",
                "MyGoals",
                "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "PatientId",
                "Careplans",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                "PractitionerId",
                "Careplans",
                "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                "IX_MyGoals_CarePlanId",
                "MyGoals",
                "CarePlanId");

            migrationBuilder.CreateIndex(
                "IX_Careplans_PatientId",
                "Careplans",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Careplans_PractitionerId",
                "Careplans",
                "PractitionerId");

            migrationBuilder.AddForeignKey(
                "FK_Careplans_Patients_PatientId",
                "Careplans",
                "PatientId",
                "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Careplans_AspNetUsers_PractitionerId",
                "Careplans",
                "PractitionerId",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_Careplans_CarePlanId",
                "MyGoals",
                "CarePlanId",
                "Careplans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}