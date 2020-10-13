using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class TimeEntryConfiguration : IEntityTypeConfiguration<TimeEntry>
    {
        public void Configure(EntityTypeBuilder<TimeEntry> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);

            builder.HasOne(e => e.Careplan)
                .WithMany()
                .HasForeignKey(e => e.CarePlanId);
        }
    }


    public class TimeEntryBillableItemConfiguration : IEntityTypeConfiguration<TimeEntryBillableItem>
    {
        public void Configure(EntityTypeBuilder<TimeEntryBillableItem> builder)
        {
            builder.HasKey(e => new {e.Id});

            builder.HasOne(e => e.TimeEntry)
                .WithMany(e => e.TimeEntryBillableItems)
                .HasForeignKey(e => e.TimeEntryId);

            builder.HasOne(e => e.BillableItem)
                .WithMany()
                .HasForeignKey(e => e.BillableItemId);
        }
    }


    public class TimeEntryUserConfiguration : IEntityTypeConfiguration<TimeEntryUser>
    {
        public void Configure(EntityTypeBuilder<TimeEntryUser> builder)
        {
            builder.HasKey(e => new {e.UserId, e.TimeEntryId});

            builder.HasOne(e => e.TimeEntry)
                .WithMany(e => e.Atendees)
                .HasForeignKey(e => e.TimeEntryId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.User)
                .WithMany(e => e.TimeEntries)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}