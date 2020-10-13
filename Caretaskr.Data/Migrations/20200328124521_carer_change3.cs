using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class carer_change3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Carers",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Contact = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carers", x => x.Id);
                    table.ForeignKey(
                        "FK_Carers_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Carers_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Carers_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "CarerPatients",
                table => new
                {
                    CarerId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    Relation = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarerPatients", x => new {x.PatientId, x.CarerId});
                    table.ForeignKey(
                        "FK_CarerPatients_Carers_CarerId",
                        x => x.CarerId,
                        "Carers",
                        "Id");
                    table.ForeignKey(
                        "FK_CarerPatients_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_CarerPatients_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_CarerPatients_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_CarerPatients_CarerId",
                "CarerPatients",
                "CarerId");

            migrationBuilder.CreateIndex(
                "IX_CarerPatients_CreatedById",
                "CarerPatients",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_CarerPatients_ModifiedById",
                "CarerPatients",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Carers_CreatedById",
                "Carers",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Carers_ModifiedById",
                "Carers",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Carers_UserId",
                "Carers",
                "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "CarerPatients");

            migrationBuilder.DropTable(
                "Carers");
        }
    }
}