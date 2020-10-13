using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class billingSettingsFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingSettings_Providers_ProviderId1",
                "BillingSettings");

            migrationBuilder.DropIndex(
                "IX_BillingSettings_ProviderId",
                "BillingSettings");

            migrationBuilder.DropIndex(
                "IX_BillingSettings_ProviderId1",
                "BillingSettings");

            migrationBuilder.DropColumn(
                "ProviderId1",
                "BillingSettings");

            migrationBuilder.CreateIndex(
                "IX_BillingSettings_ProviderId",
                "BillingSettings",
                "ProviderId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_BillingSettings_ProviderId",
                "BillingSettings");

            migrationBuilder.AddColumn<int>(
                "ProviderId1",
                "BillingSettings",
                "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_BillingSettings_ProviderId",
                "BillingSettings",
                "ProviderId");

            migrationBuilder.CreateIndex(
                "IX_BillingSettings_ProviderId1",
                "BillingSettings",
                "ProviderId1",
                unique: true,
                filter: "[ProviderId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                "FK_BillingSettings_Providers_ProviderId1",
                "BillingSettings",
                "ProviderId1",
                "Providers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}