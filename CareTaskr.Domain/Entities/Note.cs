using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{
    public class Note : BaseEntity<int>, ITenantData, IPatientData
    {
        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }

        public int? CareplanId { get; set; }
        public virtual Careplan Careplan{ get; set; }

        public int? AppointmentId { get; set; }
        public virtual Appointment Appointment{ get; set; }

        public NoteType Type { get; set; }

        public string Title{ get; set; }
        
        public string Text { get; set; }

        public virtual ICollection<PatientRecordFile> Files { get; set; }

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
