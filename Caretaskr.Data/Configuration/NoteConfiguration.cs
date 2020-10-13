using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class NoteConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(x => x.Careplan)
                .WithMany(x => x.Notes)
                .HasForeignKey(x => x.CareplanId);

            builder.HasOne(x => x.Appointment)
                .WithMany(x => x.Notes)
                .HasForeignKey(x => x.AppointmentId);

            builder.HasOne(x => x.PatientRecord)
                .WithMany(x => x.Notes)
                .HasForeignKey(x => x.PatientRecordId);


            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);
        }
    }


    public class PatientRecordFileConfiguration : IEntityTypeConfiguration<PatientRecordFile>
    {
        public void Configure(EntityTypeBuilder<PatientRecordFile> builder)
        {
            builder.HasKey(e => new {e.Id});

            builder.HasOne(e => e.PatientRecord)
                .WithMany(e => e.Files)
                .HasForeignKey(e => e.PatientRecordId);
            ;

            builder.HasOne(e => e.Assesment)
                .WithMany(e => e.Files)
                .HasForeignKey(e => e.AssesmentId);
            ;

            builder.HasOne(e => e.ServiceAgreement)
                .WithMany(e => e.Files)
                .HasForeignKey(e => e.ServiceAgreementId);

            builder.HasOne(e => e.Note)
                .WithMany()
                .HasForeignKey(e => e.NoteId);


            builder.HasOne(e => e.FileUpload)
                .WithOne(e => e.PatientRecordFile)
                .HasForeignKey<PatientRecordFile>(e => e.FileUploadId);
        }
    }


    public class CarePlanNoteConfiguration : IEntityTypeConfiguration<CarePlanNote>
    {
        public void Configure(EntityTypeBuilder<CarePlanNote> builder)
        {
            builder.HasKey(e => e.Id);


            builder.HasOne(e => e.Careplan)
                .WithMany()
                .HasForeignKey(e => e.CarePlanId);


            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);
        }
    }

    public class PatientNoteConfiguration : IEntityTypeConfiguration<PatientNote>
    {
        public void Configure(EntityTypeBuilder<PatientNote> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.PatientRecord)
                .WithMany()
                .HasForeignKey(e => e.PatientRecordId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);
        }
    }

    public class AppointmentNoteConfiguration : IEntityTypeConfiguration<AppointmentNote>
    {
        public void Configure(EntityTypeBuilder<AppointmentNote> builder)
        {
            builder.HasKey(e => e.Id);


            builder.HasOne(e => e.Appointment)
                .WithMany(e => e.AppointmentNotes)
                .HasForeignKey(e => e.AppointmentId);

            //builder.HasOne(e => e.Patient)
            //       .WithMany()
            //       .HasForeignKey(e => e.PatientId)
            //       .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById);
        }
    }
}