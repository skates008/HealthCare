using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class AssesmentConfiguration : IEntityTypeConfiguration<Assesment>
    {
        public void Configure(EntityTypeBuilder<Assesment> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.PatientRecord)
                .WithMany(e => e.Assesments)
                .HasForeignKey(e => e.PatientRecordId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}