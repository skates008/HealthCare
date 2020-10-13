using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;

namespace CareTaskr.Domain.Entities
{
    public class PatientNote : BaseEntity<Guid>, ITenantData, IPatientData
    {
        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }

        // public Guid PatientId { get; set; }
        // public virtual Patient Patient { get; set; }
        public NoteType NoteTypeId { get; set; }
        public string NoteType { get; set; }

        public string Note { get; set; }
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

    }
}
