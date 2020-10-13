using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class appntement_address : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "AddressId",
                "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "AddressType",
                "Address",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_Appointments_AddressId",
                "Appointments",
                "AddressId");

            migrationBuilder.AddForeignKey(
                "FK_Appointments_Address_AddressId",
                "Appointments",
                "AddressId",
                "Address",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_Appointments_Address_AddressId",
                "Appointments");

            migrationBuilder.DropIndex(
                "IX_Appointments_AddressId",
                "Appointments");

            migrationBuilder.DropColumn(
                "AddressId",
                "Appointments");

            migrationBuilder.DropColumn(
                "AddressType",
                "Address");
        }
    }
}