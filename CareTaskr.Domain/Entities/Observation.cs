using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class Observation : BaseEntity<Guid>, ITenantData, IPatientData
    {
        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }

       // public Guid PatientId { get; set; }
       // public virtual Patient Patient { get; set; }
        public Guid PraticionerId { get; set; }
        public string FhirResourceId { get; set; }
        public string FhirResourceUri { get; set; }

        //TODO: add once we have practitioners on the system
        //public virtual Patient Praticioner { get; set; }



        [NotMapped]
        public string Text { get; set; }
        [NotMapped]
        public DateTime Date { get; set; }


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
