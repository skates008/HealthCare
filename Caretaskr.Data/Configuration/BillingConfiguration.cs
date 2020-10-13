using Caretaskr.Common.ViewModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class BillingConfigurationConfiguration : IEntityTypeConfiguration<BillingSettings>
    {
        public void Configure(EntityTypeBuilder<BillingSettings> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Provider)
                .WithOne(e => e.BillingSettings);

            builder.HasOne(a => a.Provider)
                .WithOne(b => b.BillingSettings)
                .HasForeignKey<BillingSettings>(e => e.ProviderId);
        }
    }

    public class BillingRunConfiguration : IEntityTypeConfiguration<BillingRun>
    {
        public void Configure(EntityTypeBuilder<BillingRun> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.BillingSettings)
                .WithMany()
                .HasForeignKey(e => e.BillingSettingsId);

            //TODO: check how to do this
            // builder.HasOne(e => e.BillingSettings.Provider)
            //     .WithMany(e => e.BillingRuns);
        }
    }

    public class BillingDetailsConfiguration : IEntityTypeConfiguration<BillingDetails>
    {
        public void Configure(EntityTypeBuilder<BillingDetails> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.PlanManagementCompany)
                .WithMany()
                .HasForeignKey(e => e.PlanManagementCompanyId);

            builder.HasOne(e => e.PatientRecord)
                .WithOne(e => e.BillingDetails)
                .HasForeignKey<BillingDetails>(e => e.PatientRecordId);

            builder.HasOne(e => e.Address)
                .WithOne()
                .HasForeignKey<BillingDetails>(e => e.AddressId);
        }
    }
}