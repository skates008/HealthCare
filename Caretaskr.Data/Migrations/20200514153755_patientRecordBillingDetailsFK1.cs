using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class patientRecordBillingDetailsFK1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_Address_BillingAddressId",
                "BillingDetails");

            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_PlanManagementCompany_PlanManagementCompanyId",
                "BillingDetails");

            migrationBuilder.DropColumn(
                "BillingType",
                "BillingDetails");

            migrationBuilder.AlterColumn<int>(
                "PlanManagementCompanyId",
                "BillingDetails",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                "BillingAddressId",
                "BillingDetails",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_Address_BillingAddressId",
                "BillingDetails",
                "BillingAddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_PlanManagementCompany_PlanManagementCompanyId",
                "BillingDetails",
                "PlanManagementCompanyId",
                "PlanManagementCompany",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_Address_BillingAddressId",
                "BillingDetails");

            migrationBuilder.DropForeignKey(
                "FK_BillingDetails_PlanManagementCompany_PlanManagementCompanyId",
                "BillingDetails");

            migrationBuilder.AlterColumn<int>(
                "PlanManagementCompanyId",
                "BillingDetails",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                "BillingAddressId",
                "BillingDetails",
                "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                "BillingType",
                "BillingDetails",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_Address_BillingAddressId",
                "BillingDetails",
                "BillingAddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_BillingDetails_PlanManagementCompany_PlanManagementCompanyId",
                "BillingDetails",
                "PlanManagementCompanyId",
                "PlanManagementCompany",
                principalColumn: "Id");
        }
    }
}