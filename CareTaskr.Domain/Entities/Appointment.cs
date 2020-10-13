using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;
using Hl7.Fhir.Introspection;

namespace CareTaskr.Domain.Entities
{
    public class Appointment : BaseEntity<int>, ITenantData, IPatientData
    {

        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }

        public Guid PractitionerId { get; set; }

        public DateTime AppointmentDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public string Note { get; set; }
        public string AddressType { get; set; }

        public int? AppointmentTypeId { get; set; }
        public virtual AppointmentType? AppointmentType { get; set; }

        public int? AddressId { get; set; }
        public virtual Address Address { get; set; } = new Address();

        public Status Status { get; set; }
        public string CancelReason { get; set; }
        public string Location { get; set; }
        public string CancelNotes { get; set; }
        public string RescheduleReason { get; set; }
        public int? InternalNoteId { get; set; }
        public int? ExternalNoteId { get; set; }
        public virtual Note InternalNote { get; set; }
        public virtual Note ExternalNote { get; set; }


        public AppointmentStatus? AppointmentStatus { get; set; }
        public CancelAppointmentReason? CancelAppointmentReason { get; set; }
        public NotArrivedStatus? NotArrivedStatus { get; set; }

        public virtual User Practitioner { get; set; }

        public virtual ICollection<AppointmentNote> AppointmentNotes { get; set; }

        public virtual ICollection<Note> Notes { get; set; }

        public virtual ICollection<TimeEntry> TimeEntries { get; set; }

        public string FhirResourceId { get; set; }
        public string FhirResourceUri { get; set; }

        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }

        public int? RecurrenceGroupId { get; set; }
        public virtual AppointmentRecurrenceGroup RecurrenceGroup { get; set; }
        public virtual AppointmentRecurrenceInstance RecurrenceInstance{ get; set; }


        public bool IsRecurrenceException { get; set; }


        public string TenantDataKey { get; set; }
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = PatientRecord.Patient.GetDataKey();
        }

        public void SetTenantDataKey()
        {
            TenantDataKey = PatientRecord.Provider.GetDataKey();
        }

        public Boolean GetIsRecurring() { 
            return RecurrenceGroup != null;
        }

    }

    public class AppointmentRecurrenceGroup : BaseEntity<int>
    {
        public string Rrule { get; set; }
        public DateTime FirstInstance { get; set; }

        public DateTime LastInstance { get; set; }

        public virtual List<Appointment> Appointments{ get; set; }
        public virtual List<AppointmentRecurrenceInstance> Instances { get; set; }
    }

    public class AppointmentRecurrenceInstance
    {
        public virtual int Id { get; set; }
        public int RecurrenceGroupId { get; set; }
        public virtual AppointmentRecurrenceGroup RecurrenceGroup { get; set; }
        public Guid PublicId { get; set; } = Guid.NewGuid();
        public int? AppointmentId { get; set; }
        public virtual Appointment Appointment { get; set; }

        public DateTime StarTime;
        public DateTime EndTime;

    }

    public class AppointmentFeedBack : BaseEntity<int>, ITenantData, IPatientData
    {

        public int AppointmentId { get; set; }
        public virtual Appointment Appointment { get; set; }

        public string ClientSay { get; set; }
        public string YouDo { get; set; }
        public string Feedback { get; set; }


        public string TenantDataKey { get; set; }
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = Appointment.PatientRecord.Patient.GetDataKey();
        }

        public void SetTenantDataKey()
        {
            TenantDataKey = Appointment.PatientRecord.Provider.GetDataKey();
        }

    }

    public class AppointmentType : BaseEntity<int>, ITenantData
    {
        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }

        public bool IsBillable { get; set; } = true;

        public string Name { get; set; }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }
}
