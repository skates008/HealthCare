using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class addentitiesRelationships : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "TenantDataKey",
                "FundCategorys");

            migrationBuilder.AddColumn<string>(
                "PatientDataKey",
                "FundedSupports",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                "UserId1",
                "Carers",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_Carers_UserId1",
                "Carers",
                "UserId1",
                unique: true,
                filter: "[UserId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                "FK_Carers_AspNetUsers_UserId1",
                "Carers",
                "UserId1",
                "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Carers_AspNetUsers_UserId1",
                "Carers");

            migrationBuilder.DropIndex(
                "IX_Carers_UserId1",
                "Carers");

            migrationBuilder.DropColumn(
                "PatientDataKey",
                "FundedSupports");

            migrationBuilder.DropColumn(
                "UserId1",
                "Carers");

            migrationBuilder.AddColumn<string>(
                "TenantDataKey",
                "FundCategorys",
                "nvarchar(max)",
                nullable: true);
        }
    }
}