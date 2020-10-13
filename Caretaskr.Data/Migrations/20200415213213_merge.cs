using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class merge : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_MyGoals_CareplanFamilyGoal_CareplanFamilyGoalId",
                "MyGoals");

            migrationBuilder.DropForeignKey(
                "FK_MyGoals_AspNetUsers_CreatedById",
                "MyGoals");

            migrationBuilder.DropForeignKey(
                "FK_MyGoals_AspNetUsers_ModifiedById",
                "MyGoals");

            migrationBuilder.DropPrimaryKey(
                "PK_MyGoals",
                "MyGoals");

            migrationBuilder.RenameTable(
                "MyGoals",
                newName: "CareplanShortTermGoal");

            migrationBuilder.RenameIndex(
                "IX_MyGoals_ModifiedById",
                table: "CareplanShortTermGoal",
                newName: "IX_CareplanShortTermGoal_ModifiedById");

            migrationBuilder.RenameIndex(
                "IX_MyGoals_CreatedById",
                table: "CareplanShortTermGoal",
                newName: "IX_CareplanShortTermGoal_CreatedById");

            migrationBuilder.RenameIndex(
                "IX_MyGoals_CareplanFamilyGoalId",
                table: "CareplanShortTermGoal",
                newName: "IX_CareplanShortTermGoal_CareplanFamilyGoalId");


            migrationBuilder.AddPrimaryKey(
                "PK_CareplanShortTermGoal",
                "CareplanShortTermGoal",
                "Id");

            migrationBuilder.AddForeignKey(
                "FK_CareplanShortTermGoal_CareplanFamilyGoal_CareplanFamilyGoalId",
                "CareplanShortTermGoal",
                "CareplanFamilyGoalId",
                "CareplanFamilyGoal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_CareplanShortTermGoal_AspNetUsers_CreatedById",
                "CareplanShortTermGoal",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_CareplanShortTermGoal_AspNetUsers_ModifiedById",
                "CareplanShortTermGoal",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_CareplanShortTermGoal_CareplanFamilyGoal_CareplanFamilyGoalId",
                "CareplanShortTermGoal");

            migrationBuilder.DropForeignKey(
                "FK_CareplanShortTermGoal_AspNetUsers_CreatedById",
                "CareplanShortTermGoal");

            migrationBuilder.DropForeignKey(
                "FK_CareplanShortTermGoal_AspNetUsers_ModifiedById",
                "CareplanShortTermGoal");

            migrationBuilder.DropPrimaryKey(
                "PK_CareplanShortTermGoal",
                "CareplanShortTermGoal");


            migrationBuilder.RenameTable(
                "CareplanShortTermGoal",
                newName: "MyGoals");

            migrationBuilder.RenameIndex(
                "IX_CareplanShortTermGoal_ModifiedById",
                table: "MyGoals",
                newName: "IX_MyGoals_ModifiedById");

            migrationBuilder.RenameIndex(
                "IX_CareplanShortTermGoal_CreatedById",
                table: "MyGoals",
                newName: "IX_MyGoals_CreatedById");

            migrationBuilder.RenameIndex(
                "IX_CareplanShortTermGoal_CareplanFamilyGoalId",
                table: "MyGoals",
                newName: "IX_MyGoals_CareplanFamilyGoalId");

            migrationBuilder.AddPrimaryKey(
                "PK_MyGoals",
                "MyGoals",
                "Id");

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_CareplanFamilyGoal_CareplanFamilyGoalId",
                "MyGoals",
                "CareplanFamilyGoalId",
                "CareplanFamilyGoal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_AspNetUsers_CreatedById",
                "MyGoals",
                "CreatedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_MyGoals_AspNetUsers_ModifiedById",
                "MyGoals",
                "ModifiedById",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}