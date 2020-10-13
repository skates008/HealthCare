using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.ModifiedBy)
                .WithMany()
                .HasForeignKey(e => e.ModifiedById);

            builder.HasOne(e => e.Practitioner)
                .WithMany()
                .HasForeignKey(e => e.PractitionerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.PatientRecord)
                .WithMany()
                .HasForeignKey(e => e.PatientRecordId);


            builder.HasOne(e => e.Address)
                .WithMany()
                .HasForeignKey(e => e.AddressId);

            builder.HasOne(e => e.AppointmentType)
                .WithMany()
                .HasForeignKey(e => e.AppointmentTypeId);


            builder.HasMany(e => e.AppointmentNotes)
                .WithOne(e => e.Appointment)
                .IsRequired();

            builder.HasOne(e => e.Practitioner)
                .WithMany(e => e.Appointments)
                .HasForeignKey(e => e.PractitionerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(e => e.TimeEntries)
                .WithOne(e => e.Appointment)
                .HasForeignKey(e => e.AppointmentId);

            builder.HasOne(e => e.InternalNote)
                .WithMany()
                .HasForeignKey(e => e.InternalNoteId);

            builder.HasOne(e => e.ExternalNote)
                .WithMany()
                .HasForeignKey(e => e.ExternalNoteId);

            builder.HasOne(e => e.RecurrenceGroup)
                .WithMany(e => e.Appointments)
                .HasForeignKey(e => e.RecurrenceGroupId);
        }
    }

    public class AppointmentFeedBackConfiguration : IEntityTypeConfiguration<AppointmentFeedBack>
    {
        public void Configure(EntityTypeBuilder<AppointmentFeedBack> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.Appointment)
                .WithMany()
                .HasForeignKey(e => e.AppointmentId);

        }
    }

    public class AppointmentTypeConfiguration : IEntityTypeConfiguration<AppointmentType>
    {
        public void Configure(EntityTypeBuilder<AppointmentType> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

            builder.HasOne(e => e.Provider)
                .WithMany()
                .HasForeignKey(e => e.ProviderId);
        }
    }
    public class AppointmentRecurrenceGroupConfiguration : IEntityTypeConfiguration<AppointmentRecurrenceGroup>
    {
        public void Configure(EntityTypeBuilder<AppointmentRecurrenceGroup> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);

        }
    }

    public class AppointmentInstanceConfiguration : IEntityTypeConfiguration<AppointmentRecurrenceInstance>
    {
        public void Configure(EntityTypeBuilder<AppointmentRecurrenceInstance> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.RecurrenceGroup)
                .WithMany(e => e.Instances)
                .HasForeignKey(e => e.RecurrenceGroupId);

            builder.HasOne(e => e.Appointment)
                .WithOne(e => e.RecurrenceInstance)
                .HasForeignKey<AppointmentRecurrenceInstance>(e => e.AppointmentId);

        }
    }

}