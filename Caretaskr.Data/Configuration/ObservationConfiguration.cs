using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class ObservationConfiguration : IEntityTypeConfiguration<Observation>
    {
        public void Configure(EntityTypeBuilder<Observation> builder)
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