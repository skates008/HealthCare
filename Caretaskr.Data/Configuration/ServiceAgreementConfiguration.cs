using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class ServiceAgreementConfiguration : IEntityTypeConfiguration<ServiceAgreement>
    {
        public void Configure(EntityTypeBuilder<ServiceAgreement> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.PatientRecord)
                .WithMany(e => e.ServiceAgreements)
                .HasForeignKey(e => e.PatientRecordId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}