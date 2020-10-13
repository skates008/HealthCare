using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.DataAuthorization;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Caretaskr.Data
{
    public class ApplicationContext : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, UserRole,
        IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
    {
        public bool _ignoreDataKeys;
        public List<string> _patientKey;
        public List<string> _tenantKey;

        public ApplicationContext(DbContextOptions<ApplicationContext> options, IGetClaimsProvider userData) :
            base(options)
        {
            _tenantKey = userData.TenantKey;
            _patientKey = userData.PatientKey;

            _ignoreDataKeys = true;
        }


        public ApplicationContext(DbContextOptions<ApplicationContext> options, IGetClaimsProvider userData,
            IConfiguration configuration) : base(options)
        {
            _tenantKey = userData.TenantKey;
            _patientKey = userData.PatientKey;

            _ignoreDataKeys = configuration.GetValue<bool>("Data:IgnoreDataKeys");
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Allergies> Allergies { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentFeedBack> AppointmentFeedBacks { get; set; }

        public DbSet<AppointmentNote> AppointmentNotes { get; set; }

        public DbSet<PatientNote> PatientNotes { get; set; }

        //public DbSet<CarePlanNote> CarePlanNotes { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Careplan> Careplans { get; set; }
        public DbSet<CareplanShortTermGoal> MyGoals { get; set; }
        public DbSet<FundCategory> FundCategorys { get; set; }
        public DbSet<FundedSupport> FundedSupports { get; set; }

        public DbSet<Page> Pages { get; set; }

        public DbSet<Module> Modules { get; set; }

        public DbSet<TaskAction> TaskActions { get; set; }
        public DbSet<RoleTaskAction> RoleTaskActions { get; set; }

        public DbSet<UserPage> UserPages { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<ProviderUser> ProviderUsers { get; set; }
        public DbSet<Provider> Providers { get; set; }

        public DbSet<AppointmentType> AppointmentType { get; set; }

        public DbSet<Carer> Carers { get; set; }

        public DbSet<CarerPatient> CarerPatients { get; set; }

        public DbSet<PatientRecord> PatientRecord { get; set; }
        public DbSet<CareplanFamilyGoal> CareplanFamilyGoal { get; set; }
        public DbSet<CarePlanNote> CarePlanNote { get; set; }
        public DbSet<CareplanShortTermGoal> CareplanShortTermGoal { get; set; }
        public DbSet<BillableItem> BillableItem { get; set; }
        public DbSet<ClinicalImpression> ClinicalImpression { get; set; }
        public DbSet<Observation> Observation { get; set; }
        public DbSet<TimeEntry> TimeEntry { get; set; }
        public DbSet<Team> Team { get; set; }
        public DbSet<TeamUser> TeamUser { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //do not return softdeleted rows

            modelBuilder.Entity<FundCategory>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<Allergies>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<Budget>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<Carer>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<ClinicalImpression>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<MyTask>().HasQueryFilter(x => x.IsActive);
            //modelBuilder.Entity<Patient>().HasQueryFilter(x => x.IsActive); 
            modelBuilder.Entity<Provider>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<FileUpload>().HasQueryFilter(x => x.IsActive);
            modelBuilder.Entity<TimeEntryBillableItem>().HasQueryFilter(x => x.IsActive);


            if (!_ignoreDataKeys)
            {
                //Standard multi-tenant query filter - just filter on tentantKey
                //only apply to entities provider specific (users or anything related a careplan or patientRecord)
                modelBuilder.Entity<ProviderUser>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<Careplan>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<CareplanFamilyGoal>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<CarePlanNote>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<CareplanShortTermGoal>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<FundedSupport>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<Appointment>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<AppointmentNote>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<AppointmentFeedBack>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<BillableItem>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<ClinicalImpression>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<Observation>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<PatientNote>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<PatientRecord>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<TimeEntry>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<Medication>()
                    .HasQueryFilter(x => x.IsActive && _patientKey.Contains(x.PatientDataKey));
                modelBuilder.Entity<Team>().HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<TeamUser>().HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<BillingSettings>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<BillingRun>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<Invoice>().HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<InvoiceItem>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<PlanManagementCompany>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<AppointmentType>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<BillingSettings>()
                    .HasQueryFilter(x => x.IsActive && _tenantKey.Contains(x.TenantDataKey));
                modelBuilder.Entity<Note>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<PatientRecordFile>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<Assesment>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
                modelBuilder.Entity<ServiceAgreement>().HasQueryFilter(x =>
                    x.IsActive && (_tenantKey.Contains(x.TenantDataKey) || _patientKey.Contains(x.PatientDataKey)));
            }


            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);

            modelBuilder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }

        //I only have to override these two version of SaveChanges, as the other two versions call these
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            this.MarkCreatedItemWithDataKeys();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = new CancellationToken())
        {
            this.MarkCreatedItemWithDataKeys();
            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
    }
}