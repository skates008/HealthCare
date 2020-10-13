using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class AllergiesConfiguration : IEntityTypeConfiguration<Allergies>
    {
        public void Configure(EntityTypeBuilder<Allergies> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Patient)
                .WithMany()
                .HasForeignKey(e => e.PatientId);
        }
    }
}