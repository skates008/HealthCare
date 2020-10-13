using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class CarePlanConfiguration : IEntityTypeConfiguration<Careplan>
    {
        public void Configure(EntityTypeBuilder<Careplan> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.PatientRecord)
                .WithMany(e => e.Careplans)
                .HasForeignKey(e => e.PatientRecordId)
                .OnDelete(DeleteBehavior.Restrict);

            // builder.HasOne(e => e.Patient)
            //      .WithMany()
            //      .HasForeignKey(e => e.PatientRecord.PatientId)
            //      .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.KeyPractitioner)
                .WithMany()
                .HasForeignKey(e => e.KeyPractitionerId);


            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);


            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);
        }
    }

    public class CareplanPractitionerConfiguration : IEntityTypeConfiguration<CareplanPractitioner>
    {
        public void Configure(EntityTypeBuilder<CareplanPractitioner> builder)
        {
            builder.HasKey(e => new {e.UserId, e.CareplanId});

            builder.HasOne(e => e.Careplan)
                .WithMany(e => e.Practitioners)
                .HasForeignKey(e => e.CareplanId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.User)
                .WithMany(e => e.Careplans)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class CareplanFamilyGoalConfiguration : IEntityTypeConfiguration<CareplanFamilyGoal>
    {
        public void Configure(EntityTypeBuilder<CareplanFamilyGoal> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CarePlan)
                .WithMany(e => e.FamilyGoals)
                .HasForeignKey(e => e.CareplanId);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);


            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);
        }
    }

    public class CareplanShortTermGoalConfiguration : IEntityTypeConfiguration<CareplanShortTermGoal>
    {
        public void Configure(EntityTypeBuilder<CareplanShortTermGoal> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CarePlanFamilyGoal)
                .WithMany(e => e.ShortTermGoals)
                .HasForeignKey(e => e.CareplanFamilyGoalId);


            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);


            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);
        }
    }

    public class FundedSupportConfiguration : IEntityTypeConfiguration<FundedSupport>
    {
        public void Configure(EntityTypeBuilder<FundedSupport> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.BudgetPlan)
                .WithMany()
                .HasForeignKey(e => e.BudgetPlanId);

            builder.HasOne(e => e.FundCategory)
                .WithMany()
                .HasForeignKey(e => e.FundCategoryId);


            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);


            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);
        }
    }
}