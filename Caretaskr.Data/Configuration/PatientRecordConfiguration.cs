using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class PatientRecordConfiguration : IEntityTypeConfiguration<PatientRecord>
    {
        public void Configure(EntityTypeBuilder<PatientRecord> builder)
        {
            builder.HasKey(e => new {e.Id});

            builder.HasOne(e => e.Provider)
                .WithMany(e => e.PatientRecords)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.NoAction);


            builder.HasOne(e => e.Patient)
                .WithMany(e => e.PatientRecords)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}