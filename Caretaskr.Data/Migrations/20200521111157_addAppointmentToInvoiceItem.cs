using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class addAppointmentToInvoiceItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                "AppointmentId",
                "InvoiceItem",
                nullable: true);

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_AppointmentId",
                "InvoiceItem",
                "AppointmentId");

            migrationBuilder.AddForeignKey(
                "FK_InvoiceItem_Appointments_AppointmentId",
                "InvoiceItem",
                "AppointmentId",
                "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_InvoiceItem_Appointments_AppointmentId",
                "InvoiceItem");

            migrationBuilder.DropIndex(
                "IX_InvoiceItem_AppointmentId",
                "InvoiceItem");

            migrationBuilder.DropColumn(
                "AppointmentId",
                "InvoiceItem");
        }
    }
}