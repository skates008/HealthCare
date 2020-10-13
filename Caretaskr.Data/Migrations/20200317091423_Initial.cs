using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Caretaskr.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "AspNetRoles",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    CreatedBy = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    ModifiedBy = table.Column<Guid>(nullable: true),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    SystemDefined = table.Column<bool>(nullable: false),
                    Hierarchy = table.Column<int>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_AspNetRoles", x => x.Id); });

            migrationBuilder.CreateTable(
                "AspNetUsers",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FullName = table.Column<string>(nullable: true),
                    CompanyName = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    LastLoginDateTime = table.Column<DateTime>(nullable: true),
                    UserType = table.Column<int>(nullable: false),
                    SystemDefined = table.Column<bool>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_AspNetUsers", x => x.Id); });

            migrationBuilder.CreateTable(
                "Modules",
                table => new
                {
                    ModuleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModuleName = table.Column<string>(nullable: true),
                    DisplayName = table.Column<string>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Modules", x => x.ModuleId); });

            migrationBuilder.CreateTable(
                "Pages",
                table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Title = table.Column<string>(maxLength: 50, nullable: false),
                    Path = table.Column<string>(maxLength: 200, nullable: true),
                    Icon = table.Column<string>(maxLength: 100, nullable: true),
                    DisplayOrder = table.Column<int>(nullable: false),
                    ParentPageId = table.Column<int>(nullable: true),
                    ShowInView = table.Column<bool>(nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_Pages", x => x.Id); });

            migrationBuilder.CreateTable(
                "AspNetRoleClaims",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        x => x.RoleId,
                        "AspNetRoles",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "AspNetUserClaims",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        "FK_AspNetUserClaims_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "AspNetUserLogins",
                table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new {x.LoginProvider, x.ProviderKey});
                    table.ForeignKey(
                        "FK_AspNetUserLogins_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "AspNetUserRoles",
                table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new {x.UserId, x.RoleId});
                    table.ForeignKey(
                        "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        x => x.RoleId,
                        "AspNetRoles",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_AspNetUserRoles_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "AspNetUserTokens",
                table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new {x.UserId, x.LoginProvider, x.Name});
                    table.ForeignKey(
                        "FK_AspNetUserTokens_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "FundCategorys",
                table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundCategorys", x => x.Id);
                    table.ForeignKey(
                        "FK_FundCategorys_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_FundCategorys_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Patients",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    FhirResourceId = table.Column<string>(nullable: true),
                    FhirResourceUri = table.Column<string>(nullable: true),
                    NDISNumber = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        "FK_Patients_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Patients_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Patients_AspNetUsers_UserId",
                        x => x.UserId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "TaskActions",
                table => new
                {
                    Id = table.Column<int>(nullable: false),
                    DisplayName = table.Column<string>(maxLength: 200, nullable: false),
                    ActionName = table.Column<string>(maxLength: 200, nullable: false),
                    PageId = table.Column<int>(nullable: true),
                    ModuleId = table.Column<int>(nullable: false),
                    IsDisabled = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskActions", x => x.Id);
                    table.ForeignKey(
                        "FK_TaskActions_Modules_ModuleId",
                        x => x.ModuleId,
                        "Modules",
                        "ModuleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_TaskActions_Pages_PageId",
                        x => x.PageId,
                        "Pages",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "UserPages",
                table => new
                {
                    PageId = table.Column<int>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false),
                    RoleId1 = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPages", x => new {x.PageId, x.RoleId});
                    table.ForeignKey(
                        "FK_UserPages_Pages",
                        x => x.PageId,
                        "Pages",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_UserPages_Roles",
                        x => x.RoleId,
                        "AspNetRoles",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_UserPages_AspNetRoles_RoleId1",
                        x => x.RoleId1,
                        "AspNetRoles",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Allergies",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    FhirResourceId = table.Column<string>(nullable: true),
                    FhirResourceUri = table.Column<string>(nullable: true),
                    Category = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Allergies", x => x.Id);
                    table.ForeignKey(
                        "FK_Allergies_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Allergies_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Allergies_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "Appointments",
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
                    PractitionerId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    AppointmentDate = table.Column<DateTime>(nullable: false),
                    StartTime = table.Column<string>(nullable: true),
                    EndTime = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true),
                    AppointmentType = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    CancelReason = table.Column<string>(nullable: true),
                    CancelNotes = table.Column<string>(nullable: true),
                    RescheduleReason = table.Column<string>(nullable: true),
                    AppointmentStatus = table.Column<int>(nullable: true),
                    CancelAppointmentReason = table.Column<int>(nullable: true),
                    NotArrivedStatus = table.Column<int>(nullable: true),
                    FhirResourceId = table.Column<string>(nullable: true),
                    FhirResourceUri = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        "FK_Appointments_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Appointments_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Appointments_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Appointments_AspNetUsers_PractitionerId",
                        x => x.PractitionerId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Budgets",
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
                    PatientId = table.Column<Guid>(nullable: false),
                    BudgetName = table.Column<string>(nullable: true),
                    SourceOfBudget = table.Column<int>(nullable: false),
                    TotalBudget = table.Column<decimal>(nullable: false),
                    RemainingBudget = table.Column<decimal>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budgets", x => x.Id);
                    table.ForeignKey(
                        "FK_Budgets_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Budgets_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Budgets_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "Careplans",
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
                    PatientId = table.Column<Guid>(nullable: false),
                    PractitionerId = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Careplans", x => x.Id);
                    table.ForeignKey(
                        "FK_Careplans_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Careplans_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Careplans_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Careplans_AspNetUsers_PractitionerId",
                        x => x.PractitionerId,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "ClinicalImpression",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    PraticionerId = table.Column<Guid>(nullable: false),
                    FhirResourceId = table.Column<string>(nullable: true),
                    FhirResourceUri = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicalImpression", x => x.Id);
                    table.ForeignKey(
                        "FK_ClinicalImpression_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ClinicalImpression_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_ClinicalImpression_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "Medications",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    FhirResourceId = table.Column<string>(nullable: true),
                    FhirResourceUri = table.Column<string>(nullable: true),
                    Frequency = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medications", x => x.Id);
                    table.ForeignKey(
                        "FK_Medications_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Medications_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Medications_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "Observation",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    PraticionerId = table.Column<Guid>(nullable: false),
                    FhirResourceId = table.Column<string>(nullable: true),
                    FhirResourceUri = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Observation", x => x.Id);
                    table.ForeignKey(
                        "FK_Observation_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Observation_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Observation_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "PatientNotes",
                table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedById = table.Column<Guid>(nullable: true),
                    ModifiedById = table.Column<Guid>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    ModifiedDate = table.Column<DateTime>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    PublicId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    NoteTypeId = table.Column<int>(nullable: false),
                    NoteType = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientNotes", x => x.Id);
                    table.ForeignKey(
                        "FK_PatientNotes_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PatientNotes_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_PatientNotes_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "RoleTaskActions",
                table => new
                {
                    TaskActionId = table.Column<int>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false),
                    RoleId1 = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleTaskActions", x => new {x.TaskActionId, x.RoleId});
                    table.ForeignKey(
                        "FK_RoleTaskActions_AspNetRoles_RoleId",
                        x => x.RoleId,
                        "AspNetRoles",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_RoleTaskActions_AspNetRoles_RoleId1",
                        x => x.RoleId1,
                        "AspNetRoles",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_RoleTaskActions_TaskActions_TaskActionId",
                        x => x.TaskActionId,
                        "TaskActions",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "AppointmentFeedBacks",
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
                    AppointmentId = table.Column<int>(nullable: false),
                    ClientSay = table.Column<string>(nullable: true),
                    YouDo = table.Column<string>(nullable: true),
                    Feedback = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentFeedBacks", x => x.Id);
                    table.ForeignKey(
                        "FK_AppointmentFeedBacks_Appointments_AppointmentId",
                        x => x.AppointmentId,
                        "Appointments",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_AppointmentFeedBacks_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_AppointmentFeedBacks_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AppointmentNotes",
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
                    AppointmentId = table.Column<int>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    NoteTypeId = table.Column<int>(nullable: false),
                    NoteType = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentNotes", x => x.Id);
                    table.ForeignKey(
                        "FK_AppointmentNotes_Appointments_AppointmentId",
                        x => x.AppointmentId,
                        "Appointments",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_AppointmentNotes_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_AppointmentNotes_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_AppointmentNotes_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "CarePlanNote",
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
                    CarePlanId = table.Column<int>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    NoteTypeId = table.Column<int>(nullable: false),
                    NoteType = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarePlanNote", x => x.Id);
                    table.ForeignKey(
                        "FK_CarePlanNote_Careplans_CarePlanId",
                        x => x.CarePlanId,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_CarePlanNote_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_CarePlanNote_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_CarePlanNote_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "FundedSupports",
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
                    PatientId = table.Column<Guid>(nullable: false),
                    CarePlanId = table.Column<int>(nullable: false),
                    FundCategoryId = table.Column<int>(nullable: false),
                    BudgetPlanId = table.Column<int>(nullable: false),
                    Goal = table.Column<string>(nullable: true),
                    FundAllocated = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundedSupports", x => x.Id);
                    table.ForeignKey(
                        "FK_FundedSupports_Budgets_BudgetPlanId",
                        x => x.BudgetPlanId,
                        "Budgets",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_FundedSupports_Careplans_CarePlanId",
                        x => x.CarePlanId,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_FundedSupports_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_FundedSupports_FundCategorys_FundCategoryId",
                        x => x.FundCategoryId,
                        "FundCategorys",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_FundedSupports_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_FundedSupports_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "MyGoals",
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
                    PatientId = table.Column<Guid>(nullable: false),
                    CarePlanId = table.Column<int>(nullable: false),
                    GoalTitle = table.Column<string>(nullable: true),
                    GoalSupported = table.Column<string>(nullable: true),
                    GoalHow = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyGoals", x => x.Id);
                    table.ForeignKey(
                        "FK_MyGoals_Careplans_CarePlanId",
                        x => x.CarePlanId,
                        "Careplans",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MyGoals_AspNetUsers_CreatedById",
                        x => x.CreatedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MyGoals_AspNetUsers_ModifiedById",
                        x => x.ModifiedById,
                        "AspNetUsers",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_MyGoals_Patients_PatientId",
                        x => x.PatientId,
                        "Patients",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_Allergies_CreatedById",
                "Allergies",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Allergies_ModifiedById",
                "Allergies",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Allergies_PatientId",
                "Allergies",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_AppointmentFeedBacks_AppointmentId",
                "AppointmentFeedBacks",
                "AppointmentId");

            migrationBuilder.CreateIndex(
                "IX_AppointmentFeedBacks_CreatedById",
                "AppointmentFeedBacks",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_AppointmentFeedBacks_ModifiedById",
                "AppointmentFeedBacks",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_AppointmentNotes_AppointmentId",
                "AppointmentNotes",
                "AppointmentId");

            migrationBuilder.CreateIndex(
                "IX_AppointmentNotes_CreatedById",
                "AppointmentNotes",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_AppointmentNotes_ModifiedById",
                "AppointmentNotes",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_AppointmentNotes_PatientId",
                "AppointmentNotes",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Appointments_CreatedById",
                "Appointments",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Appointments_ModifiedById",
                "Appointments",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Appointments_PatientId",
                "Appointments",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Appointments_PractitionerId",
                "Appointments",
                "PractitionerId");

            migrationBuilder.CreateIndex(
                "IX_AspNetRoleClaims_RoleId",
                "AspNetRoleClaims",
                "RoleId");

            migrationBuilder.CreateIndex(
                "RoleNameIndex",
                "AspNetRoles",
                "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                "IX_AspNetUserClaims_UserId",
                "AspNetUserClaims",
                "UserId");

            migrationBuilder.CreateIndex(
                "IX_AspNetUserLogins_UserId",
                "AspNetUserLogins",
                "UserId");

            migrationBuilder.CreateIndex(
                "IX_AspNetUserRoles_RoleId",
                "AspNetUserRoles",
                "RoleId");

            migrationBuilder.CreateIndex(
                "EmailIndex",
                "AspNetUsers",
                "NormalizedEmail");

            migrationBuilder.CreateIndex(
                "UserNameIndex",
                "AspNetUsers",
                "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                "IX_Budgets_CreatedById",
                "Budgets",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Budgets_ModifiedById",
                "Budgets",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Budgets_PatientId",
                "Budgets",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_CarePlanNote_CarePlanId",
                "CarePlanNote",
                "CarePlanId");

            migrationBuilder.CreateIndex(
                "IX_CarePlanNote_CreatedById",
                "CarePlanNote",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_CarePlanNote_ModifiedById",
                "CarePlanNote",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_CarePlanNote_PatientId",
                "CarePlanNote",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Careplans_CreatedById",
                "Careplans",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Careplans_ModifiedById",
                "Careplans",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Careplans_PatientId",
                "Careplans",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Careplans_PractitionerId",
                "Careplans",
                "PractitionerId");

            migrationBuilder.CreateIndex(
                "IX_ClinicalImpression_CreatedById",
                "ClinicalImpression",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_ClinicalImpression_ModifiedById",
                "ClinicalImpression",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_ClinicalImpression_PatientId",
                "ClinicalImpression",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_FundCategorys_CreatedById",
                "FundCategorys",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_FundCategorys_ModifiedById",
                "FundCategorys",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_BudgetPlanId",
                "FundedSupports",
                "BudgetPlanId");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_CarePlanId",
                "FundedSupports",
                "CarePlanId");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_CreatedById",
                "FundedSupports",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_FundCategoryId",
                "FundedSupports",
                "FundCategoryId");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_ModifiedById",
                "FundedSupports",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_FundedSupports_PatientId",
                "FundedSupports",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Medications_CreatedById",
                "Medications",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Medications_ModifiedById",
                "Medications",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Medications_PatientId",
                "Medications",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_MyGoals_CarePlanId",
                "MyGoals",
                "CarePlanId");

            migrationBuilder.CreateIndex(
                "IX_MyGoals_CreatedById",
                "MyGoals",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_MyGoals_ModifiedById",
                "MyGoals",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_MyGoals_PatientId",
                "MyGoals",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Observation_CreatedById",
                "Observation",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Observation_ModifiedById",
                "Observation",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Observation_PatientId",
                "Observation",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_PatientNotes_CreatedById",
                "PatientNotes",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_PatientNotes_ModifiedById",
                "PatientNotes",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_PatientNotes_PatientId",
                "PatientNotes",
                "PatientId");

            migrationBuilder.CreateIndex(
                "IX_Patients_CreatedById",
                "Patients",
                "CreatedById");

            migrationBuilder.CreateIndex(
                "IX_Patients_ModifiedById",
                "Patients",
                "ModifiedById");

            migrationBuilder.CreateIndex(
                "IX_Patients_UserId",
                "Patients",
                "UserId");

            migrationBuilder.CreateIndex(
                "IX_RoleTaskActions_RoleId",
                "RoleTaskActions",
                "RoleId");

            migrationBuilder.CreateIndex(
                "IX_RoleTaskActions_RoleId1",
                "RoleTaskActions",
                "RoleId1");

            migrationBuilder.CreateIndex(
                "IX_TaskActions_ActionName",
                "TaskActions",
                "ActionName",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_TaskActions_ModuleId",
                "TaskActions",
                "ModuleId");

            migrationBuilder.CreateIndex(
                "IX_TaskActions_PageId",
                "TaskActions",
                "PageId");

            migrationBuilder.CreateIndex(
                "IX_UserPages_RoleId",
                "UserPages",
                "RoleId");

            migrationBuilder.CreateIndex(
                "IX_UserPages_RoleId1",
                "UserPages",
                "RoleId1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "Allergies");

            migrationBuilder.DropTable(
                "AppointmentFeedBacks");

            migrationBuilder.DropTable(
                "AppointmentNotes");

            migrationBuilder.DropTable(
                "AspNetRoleClaims");

            migrationBuilder.DropTable(
                "AspNetUserClaims");

            migrationBuilder.DropTable(
                "AspNetUserLogins");

            migrationBuilder.DropTable(
                "AspNetUserRoles");

            migrationBuilder.DropTable(
                "AspNetUserTokens");

            migrationBuilder.DropTable(
                "CarePlanNote");

            migrationBuilder.DropTable(
                "ClinicalImpression");

            migrationBuilder.DropTable(
                "FundedSupports");

            migrationBuilder.DropTable(
                "Medications");

            migrationBuilder.DropTable(
                "MyGoals");

            migrationBuilder.DropTable(
                "Observation");

            migrationBuilder.DropTable(
                "PatientNotes");

            migrationBuilder.DropTable(
                "RoleTaskActions");

            migrationBuilder.DropTable(
                "UserPages");

            migrationBuilder.DropTable(
                "Appointments");

            migrationBuilder.DropTable(
                "Budgets");

            migrationBuilder.DropTable(
                "FundCategorys");

            migrationBuilder.DropTable(
                "Careplans");

            migrationBuilder.DropTable(
                "TaskActions");

            migrationBuilder.DropTable(
                "AspNetRoles");

            migrationBuilder.DropTable(
                "Patients");

            migrationBuilder.DropTable(
                "Modules");

            migrationBuilder.DropTable(
                "Pages");

            migrationBuilder.DropTable(
                "AspNetUsers");
        }
    }
}