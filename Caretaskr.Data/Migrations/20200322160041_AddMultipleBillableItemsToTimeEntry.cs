using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class AddMultipleBillableItemsToTimeEntry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntry_BillableItem_BillableItemId",
                "TimeEntry");

            migrationBuilder.DropIndex(
                "IX_TimeEntry_BillableItemId",
                "TimeEntry");

            migrationBuilder.DropColumn(
                "BillableItemId",
                "TimeEntry");

            migrationBuilder.AddColumn<int>(
                "TimeEntryId1",
                "TimeEntryUser",
                nullable: true);

            migrationBuilder.CreateTable(
                "TimeEntryBillableItem",
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
                    TimeEntryId = table.Column<int>(nullable: false),
                    BillableItemId = table.Column<int>(nullable: false),
                    quantity = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeEntryBillableItem", x => x.Id);
                    table.ForeignKey(
                        "FK_TimeEntryBillableItem_BillableItem_BillableItemId",
                        x => x.BillableItemId,
                        "BillableItem",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_TimeEntryBillableItem_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_TimeEntryBillableItem_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_TimeEntryBillableItem_TimeEntry_TimeEntryId",
                        x => x.TimeEntryId,
                        "TimeEntry",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_TimeEntryUser_TimeEntryId1",
                "TimeEntryUser",
                "TimeEntryId1");

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_BillableItemId",
                "TimeEntryBillableItem",
                "BillableItemId");

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_CreatedById",
                "TimeEntryBillableItem",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_ModifiedById",
                "TimeEntryBillableItem",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_TimeEntryId",
                "TimeEntryBillableItem",
                "TimeEntryId");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntryUser_TimeEntry_TimeEntryId1",
                "TimeEntryUser",
                "TimeEntryId1",
                "TimeEntry",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_TimeEntryUser_TimeEntry_TimeEntryId1",
                "TimeEntryUser");

            migrationBuilder.DropTable(
                "TimeEntryBillableItem");

            migrationBuilder.DropIndex(
                "IX_TimeEntryUser_TimeEntryId1",
                "TimeEntryUser");

            migrationBuilder.DropColumn(
                "TimeEntryId1",
                "TimeEntryUser");

            migrationBuilder.AddColumn<int>(
                "BillableItemId",
                "TimeEntry",
                "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                "IX_TimeEntry_BillableItemId",
                "TimeEntry",
                "BillableItemId");

            migrationBuilder.AddForeignKey(
                "FK_TimeEntry_BillableItem_BillableItemId",
                "TimeEntry",
                "BillableItemId",
                "BillableItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}