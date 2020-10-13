using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class ClinicalImpressionConfiguration : IEntityTypeConfiguration<ClinicalImpression>
    {
        public void Configure(EntityTypeBuilder<ClinicalImpression> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.PatientRecord)
                .WithMany()
                .HasForeignKey(e => e.PatientRecordId);

            //TODO: add once we have practitioners on the system
            //builder.HasOne(e => e.Patient)
            //    .WithMany()
            //    .HasForeignKey(e => e.PatientId);
        }
    }
}