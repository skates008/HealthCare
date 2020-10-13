using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;

namespace CareTaskr.Domain.Entities
{
    public class CarePlanNote : BaseEntity<int>, ITenantData, IPatientData
    {
        public int CarePlanId { get; set; }
        public virtual Careplan Careplan { get; set; }
       // public Guid PatientId { get; set; }
       // public virtual Patient Patient { get; set; }
        public NoteType NoteTypeId { get; set; }
        public string NoteType { get; set; }
        public string Note { get; set; }


        public string TenantDataKey { get; set; }
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = Careplan.PatientRecord.Patient.GetDataKey();
        }

        public void SetTenantDataKey()
        {
            TenantDataKey = Careplan.PatientRecord.Provider.GetDataKey();
        }
    }
}
