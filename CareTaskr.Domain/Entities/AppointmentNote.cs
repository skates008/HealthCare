using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;

namespace CareTaskr.Domain.Entities
{
    public class AppointmentNote : BaseEntity<int>, ITenantData, IPatientData
    {
        public int AppointmentId { get; set; }
        public virtual Appointment Appointment { get; set; }

        public NoteType NoteTypeId { get; set; }
        public string NoteType { get; set; }

        public string Note { get; set; }
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
}
