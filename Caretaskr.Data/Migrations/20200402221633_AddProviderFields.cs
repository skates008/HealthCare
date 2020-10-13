using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddProviderFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                "IsActive",
                "ProviderUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                "ABNNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Address",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Email",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "EntityName",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                "IsNDISRegistered",
                "Providers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                "NDISNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "NDISServicesProvided",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "OtherServices",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PhoneNumber",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PrimaryContactEmail",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "PrimaryContactName",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "TradingName",
                "Providers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                "IsActive",
                "ProviderUsers");

            migrationBuilder.DropColumn(
                "ABNNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "Address",
                "Providers");

            migrationBuilder.DropColumn(
                "Email",
                "Providers");

            migrationBuilder.DropColumn(
                "EntityName",
                "Providers");

            migrationBuilder.DropColumn(
                "IsNDISRegistered",
                "Providers");

            migrationBuilder.DropColumn(
                "NDISNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "NDISServicesProvided",
                "Providers");

            migrationBuilder.DropColumn(
                "OtherServices",
                "Providers");

            migrationBuilder.DropColumn(
                "PhoneNumber",
                "Providers");

            migrationBuilder.DropColumn(
                "PrimaryContactEmail",
                "Providers");

            migrationBuilder.DropColumn(
                "PrimaryContactName",
                "Providers");

            migrationBuilder.DropColumn(
                "TradingName",
                "Providers");
        }
    }
}