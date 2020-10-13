using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class ProviderConfiguration : IEntityTypeConfiguration<Provider>
    {
        public void Configure(EntityTypeBuilder<Provider> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);

            builder.HasMany(e => e.AppointmentTypes)
                .WithOne(e => e.Provider);
        }
    }

    public class ProviderUserConfiguration : IEntityTypeConfiguration<ProviderUser>
    {
        public void Configure(EntityTypeBuilder<ProviderUser> builder)
        {
            builder.HasKey(e => new {e.UserId, e.ProviderId});

            builder.HasOne(e => e.Provider)
                .WithMany(e => e.Users)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.User)
                .WithMany(e => e.Providers)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }

    public class ProviderBankDetailsConfiguration : IEntityTypeConfiguration<ProviderBankDetails>
    {
        public void Configure(EntityTypeBuilder<ProviderBankDetails> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Provider)
                .WithMany()
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);

            builder.HasOne(e => e.Provider)
                .WithMany(e => e.ProviderBankDetails)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}