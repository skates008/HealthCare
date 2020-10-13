using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class serviceagreement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "ServiceAgreement",
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
                    PatientRecordId = table.Column<int>(nullable: false),
                    PatientRecordFileId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    SignedDate = table.Column<DateTime>(nullable: false),
                    ValidFromDate = table.Column<DateTime>(nullable: false),
                    ValidToDate = table.Column<DateTime>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    PatientDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceAgreement", x => x.Id);
                    table.ForeignKey(
                        "FK_ServiceAgreement_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ServiceAgreement_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ServiceAgreement_PatientRecordFile_PatientRecordFileId",
                        x => x.PatientRecordFileId,
                        "PatientRecordFile",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_ServiceAgreement_PatientRecord_PatientRecordId",
                        x => x.PatientRecordId,
                        "PatientRecord",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_ServiceAgreement_CreatedById",
                "ServiceAgreement",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_ServiceAgreement_ModifiedById",
                "ServiceAgreement",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_ServiceAgreement_PatientRecordFileId",
                "ServiceAgreement",
                "PatientRecordFileId");

            migrationBuilder.CreateIndex(
                "IX_ServiceAgreement_PatientRecordId",
                "ServiceAgreement",
                "PatientRecordId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "ServiceAgreement");
        }
    }
}