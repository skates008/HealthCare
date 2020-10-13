using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class CarerConfiguration : IEntityTypeConfiguration<Carer>
    {
        public void Configure(EntityTypeBuilder<Carer> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);


            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId);
        }
    }

    public class CarerPatientConfiguration : IEntityTypeConfiguration<CarerPatient>
    {
        public void Configure(EntityTypeBuilder<CarerPatient> builder)
        {
            builder.HasKey(e => new {e.PatientId, e.CarerId});

            builder.HasOne(e => e.Carer)
                .WithMany(e => e.CarerPatients)
                .HasForeignKey(e => e.CarerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(e => e.Patient)
                .WithMany(e => e.CarerPatients)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}