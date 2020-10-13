using Caretaskr.Common.ViewModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Provider)
                .WithMany()
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.BillingRun)
                .WithMany()
                .HasForeignKey(e => e.BillingRunId);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);

            builder.HasOne(e=> e.File).WithMany().HasForeignKey(e=> e.FileId);

            builder.HasOne(e => e.Provider)
                .WithMany(e => e.Invoices);

            builder.HasOne(e => e.Careplan)
                .WithMany(e => e.Invoices)
                .HasForeignKey(e => e.CarePlanId);
        }
    }

    public class InvoiceItemConfiguration : IEntityTypeConfiguration<InvoiceItem>
    {
        public void Configure(EntityTypeBuilder<InvoiceItem> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Invoice)
                .WithMany()
                .HasForeignKey(e => e.InvoiceId);


            builder.HasOne(e => e.TimeEntryBillableItem)
                .WithOne(e => e.InvoiceItem)
                .HasForeignKey<InvoiceItem>(e => e.TimeEntryBillableItemId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);
        }
    }
}