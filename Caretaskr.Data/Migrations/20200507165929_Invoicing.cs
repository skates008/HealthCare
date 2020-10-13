using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Invoicing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                "Quantity",
                "TimeEntryBillableItem",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)");

            migrationBuilder.AddColumn<int>(
                "DurationInMinutes",
                "TimeEntryBillableItem",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                "EndTime",
                "TimeEntryBillableItem",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                "InvoiceId",
                "TimeEntryBillableItem",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                "StartTime",
                "TimeEntryBillableItem",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                "MyProperty",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                "Website",
                "Providers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                "PlanManagementCompanyId",
                "PatientRecord",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                "Unit",
                "BillableItem",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                "GSTCode",
                "BillableItem",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                "Address",
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
                    Name = table.Column<string>(nullable: true),
                    StreetName = table.Column<string>(nullable: true),
                    StreetNumber = table.Column<string>(nullable: true),
                    Unit = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    PostalCode = table.Column<string>(nullable: true),
                    Country = table.Column<string>(nullable: true),
                    Latitude = table.Column<double>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    Observations = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Address", x => x.Id);
                    table.ForeignKey(
                        "FK_Address_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Address_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "BillableItemPrice",
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
                    BillableItemId = table.Column<int>(nullable: false),
                    ValidFrom = table.Column<DateTime>(nullable: false),
                    ValidTo = table.Column<DateTime>(nullable: false),
                    Price = table.Column<decimal>("decimal(7,2)", nullable: false),
                    GST = table.Column<int>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    BillableItemId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillableItemPrice", x => x.Id);
                    table.ForeignKey(
                        "FK_BillableItemPrice_BillableItem_BillableItemId",
                        x => x.BillableItemId,
                        "BillableItem",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_BillableItemPrice_BillableItem_BillableItemId1",
                        x => x.BillableItemId1,
                        "BillableItem",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillableItemPrice_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillableItemPrice_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "BillingSettings",
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
                    ProviderId = table.Column<int>(nullable: false),
                    BillingCycle = table.Column<int>(nullable: false),
                    BillingDayOfWeek = table.Column<int>(nullable: false),
                    BillingWeekCycle = table.Column<int>(nullable: false),
                    BillingDayOfMonth = table.Column<int>(nullable: false),
                    FirstRunDate = table.Column<DateTime>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    ProviderId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillingSettings", x => x.Id);
                    table.ForeignKey(
                        "FK_BillingSettings_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillingSettings_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillingSettings_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_BillingSettings_Providers_ProviderId1",
                        x => x.ProviderId1,
                        "Providers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "PlanManagementCompany",
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
                    ProviderId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    AddressId = table.Column<int>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanManagementCompany", x => x.Id);
                    table.ForeignKey(
                        "FK_PlanManagementCompany_Address_AddressId",
                        x => x.AddressId,
                        "Address",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_PlanManagementCompany_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PlanManagementCompany_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PlanManagementCompany_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "BillingRun",
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
                    BillingSettingsId = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    runDate = table.Column<DateTime>(nullable: false),
                    TriggeredBy = table.Column<string>(nullable: true),
                    BillingcConfSnapshot = table.Column<string>(nullable: true),
                    BillingDayOfWeek = table.Column<int>(nullable: false),
                    BillingWeekCycle = table.Column<int>(nullable: false),
                    BillingDayOfMonth = table.Column<int>(nullable: false),
                    PaymentDueInDays = table.Column<int>(nullable: false),
                    FirstRunDate = table.Column<DateTime>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillingRun", x => x.Id);
                    table.ForeignKey(
                        "FK_BillingRun_BillingSettings_BillingSettingsId",
                        x => x.BillingSettingsId,
                        "BillingSettings",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_BillingRun_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillingRun_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "BillingDetails",
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
                    BillingType = table.Column<int>(nullable: false),
                    BillingAccountNumber = table.Column<string>(nullable: true),
                    BillingTermsOfService = table.Column<string>(nullable: true),
                    BillingAddressId = table.Column<int>(nullable: false),
                    PlanManagementCompanyId = table.Column<int>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    PatientRecordId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillingDetails", x => x.Id);
                    table.ForeignKey(
                        "FK_BillingDetails_Address_BillingAddressId",
                        x => x.BillingAddressId,
                        "Address",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_BillingDetails_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillingDetails_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillingDetails_PatientRecord_PatientRecordId",
                        x => x.PatientRecordId,
                        "PatientRecord",
                        "Id");
                    table.ForeignKey(
                        "FK_BillingDetails_PatientRecord_PatientRecordId1",
                        x => x.PatientRecordId1,
                        "PatientRecord",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_BillingDetails_PlanManagementCompany_PlanManagementCompanyId",
                        x => x.PlanManagementCompanyId,
                        "PlanManagementCompany",
                        "Id");
                });

            migrationBuilder.CreateTable(
                "Invoice",
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
                    BillingRunId = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Reference = table.Column<string>(nullable: true),
                    DueDate = table.Column<DateTime>(nullable: false),
                    CustomerReference = table.Column<string>(nullable: true),
                    CustomerName = table.Column<string>(nullable: true),
                    CustomerAddress = table.Column<string>(nullable: true),
                    CustomerNDISReference = table.Column<string>(nullable: true),
                    SubTotal = table.Column<decimal>("decimal(7,2)", nullable: false),
                    SubTotalGST = table.Column<decimal>("decimal(7,2)", nullable: false),
                    Total = table.Column<decimal>("decimal(7,2)", nullable: false),
                    ProviderId = table.Column<int>(nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    BillingRunId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoice", x => x.Id);
                    table.ForeignKey(
                        "FK_Invoice_BillingRun_BillingRunId",
                        x => x.BillingRunId,
                        "BillingRun",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Invoice_BillingRun_BillingRunId1",
                        x => x.BillingRunId1,
                        "BillingRun",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Invoice_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Invoice_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Invoice_Providers_ProviderId",
                        x => x.ProviderId,
                        "Providers",
                        "Id");
                });

            migrationBuilder.CreateTable(
                "InvoiceItem",
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
                    InvoiceId = table.Column<int>(nullable: false),
                    TimeEntryBillableItemId = table.Column<int>(nullable: false),
                    ClientName = table.Column<string>(nullable: true),
                    Reference = table.Column<string>(nullable: true),
                    Quantity = table.Column<double>(nullable: false),
                    Unit = table.Column<string>(nullable: true),
                    GSTCode = table.Column<string>(nullable: true),
                    GSTRate = table.Column<double>(nullable: false),
                    UnitPrice = table.Column<decimal>("decimal(7,2)", nullable: false),
                    SubTotal = table.Column<decimal>("decimal(7,2)", nullable: false),
                    GSTTotal = table.Column<decimal>("decimal(7,2)", nullable: false),
                    Total = table.Column<decimal>("decimal(7,2)", nullable: false),
                    TenantDataKey = table.Column<string>(nullable: true),
                    InvoiceId1 = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceItem", x => x.Id);
                    table.ForeignKey(
                        "FK_InvoiceItem_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_InvoiceItem_Invoice_InvoiceId",
                        x => x.InvoiceId,
                        "Invoice",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_InvoiceItem_Invoice_InvoiceId1",
                        x => x.InvoiceId1,
                        "Invoice",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_InvoiceItem_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_InvoiceItem_TimeEntryBillableItem_TimeEntryBillableItemId",
                        x => x.TimeEntryBillableItemId,
                        "TimeEntryBillableItem",
                        "Id");
                });

            migrationBuilder.CreateIndex(
                "IX_TimeEntryBillableItem_InvoiceId",
                "TimeEntryBillableItem",
                "InvoiceId");

            migrationBuilder.CreateIndex(
                "IX_PatientRecord_PlanManagementCompanyId",
                "PatientRecord",
                "PlanManagementCompanyId");

            migrationBuilder.CreateIndex(
                "IX_Address_CreatedById",
                "Address",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Address_ModifiedById",
                "Address",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_BillableItemPrice_BillableItemId",
                "BillableItemPrice",
                "BillableItemId");

            migrationBuilder.CreateIndex(
                "IX_BillableItemPrice_BillableItemId1",
                "BillableItemPrice",
                "BillableItemId1");

            migrationBuilder.CreateIndex(
                "IX_BillableItemPrice_CreatedById",
                "BillableItemPrice",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_BillableItemPrice_ModifiedById",
                "BillableItemPrice",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_BillingAddressId",
                "BillingDetails",
                "BillingAddressId");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_CreatedById",
                "BillingDetails",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_ModifiedById",
                "BillingDetails",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_PatientRecordId",
                "BillingDetails",
                "PatientRecordId");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_PatientRecordId1",
                "BillingDetails",
                "PatientRecordId1",
                unique: true,
                filter: "[PatientRecordId1] IS NOT NULL");

            migrationBuilder.CreateIndex(
                "IX_BillingDetails_PlanManagementCompanyId",
                "BillingDetails",
                "PlanManagementCompanyId");

            migrationBuilder.CreateIndex(
                "IX_BillingRun_BillingSettingsId",
                "BillingRun",
                "BillingSettingsId");

            migrationBuilder.CreateIndex(
                "IX_BillingRun_CreatedById",
                "BillingRun",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_BillingRun_ModifiedById",
                "BillingRun",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_BillingSettings_CreatedById",
                "BillingSettings",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_BillingSettings_ModifiedById",
                "BillingSettings",
                "ModifiedById");

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

            migrationBuilder.CreateIndex(
                "IX_Invoice_BillingRunId",
                "Invoice",
                "BillingRunId");

            migrationBuilder.CreateIndex(
                "IX_Invoice_BillingRunId1",
                "Invoice",
                "BillingRunId1");

            migrationBuilder.CreateIndex(
                "IX_Invoice_CreatedById",
                "Invoice",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Invoice_ModifiedById",
                "Invoice",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Invoice_ProviderId",
                "Invoice",
                "ProviderId");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_CreatedById",
                "InvoiceItem",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_InvoiceId",
                "InvoiceItem",
                "InvoiceId");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_InvoiceId1",
                "InvoiceItem",
                "InvoiceId1");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_ModifiedById",
                "InvoiceItem",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_InvoiceItem_TimeEntryBillableItemId",
                "InvoiceItem",
                "TimeEntryBillableItemId");

            migrationBuilder.CreateIndex(
                "IX_PlanManagementCompany_AddressId",
                "PlanManagementCompany",
                "AddressId");

            migrationBuilder.CreateIndex(
                "IX_PlanManagementCompany_CreatedById",
                "PlanManagementCompany",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_PlanManagementCompany_ModifiedById",
                "PlanManagementCompany",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_PlanManagementCompany_ProviderId",
                "PlanManagementCompany",
                "ProviderId");

            migrationBuilder.AddForeignKey(
                "FK_PatientRecord_PlanManagementCompany_PlanManagementCompanyId",
                "PatientRecord",
                "PlanManagementCompanyId",
                "PlanManagementCompany",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_TimeEntryBillableItem_Invoice_InvoiceId",
                "TimeEntryBillableItem",
                "InvoiceId",
                "Invoice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_PatientRecord_PlanManagementCompany_PlanManagementCompanyId",
                "PatientRecord");

            migrationBuilder.DropForeignKey(
                "FK_TimeEntryBillableItem_Invoice_InvoiceId",
                "TimeEntryBillableItem");

            migrationBuilder.DropTable(
                "BillableItemPrice");

            migrationBuilder.DropTable(
                "BillingDetails");

            migrationBuilder.DropTable(
                "InvoiceItem");

            migrationBuilder.DropTable(
                "PlanManagementCompany");

            migrationBuilder.DropTable(
                "Invoice");

            migrationBuilder.DropTable(
                "Address");

            migrationBuilder.DropTable(
                "BillingRun");

            migrationBuilder.DropTable(
                "BillingSettings");

            migrationBuilder.DropIndex(
                "IX_TimeEntryBillableItem_InvoiceId",
                "TimeEntryBillableItem");

            migrationBuilder.DropIndex(
                "IX_PatientRecord_PlanManagementCompanyId",
                "PatientRecord");

            migrationBuilder.DropColumn(
                "DurationInMinutes",
                "TimeEntryBillableItem");

            migrationBuilder.DropColumn(
                "EndTime",
                "TimeEntryBillableItem");

            migrationBuilder.DropColumn(
                "InvoiceId",
                "TimeEntryBillableItem");

            migrationBuilder.DropColumn(
                "StartTime",
                "TimeEntryBillableItem");

            migrationBuilder.DropColumn(
                "MyProperty",
                "Providers");

            migrationBuilder.DropColumn(
                "Website",
                "Providers");

            migrationBuilder.DropColumn(
                "PlanManagementCompanyId",
                "PatientRecord");

            migrationBuilder.AlterColumn<decimal>(
                "Quantity",
                "TimeEntryBillableItem",
                "decimal(10,2)",
                nullable: false,
                oldClrType: typeof(double));

            migrationBuilder.AlterColumn<int>(
                "Unit",
                "BillableItem",
                "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                "GSTCode",
                "BillableItem",
                "int",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}