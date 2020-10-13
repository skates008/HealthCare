using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class Medication : BaseEntity<Guid>,  IPatientData
    {


        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public string FhirResourceId { get; set; }
        public string FhirResourceUri { get; set; }


        //TODO: Store on FHIR
        public Frequency Frequency { get; set; }



        [NotMapped]
        public string Manufacturer { get; set; }
        [NotMapped] 
        public string Medicine { get; set; }
        [NotMapped] 
        public FormOfMedicine FormOfMedicine { get; set; }
        [NotMapped] 
        public int Amount { get; set; }
        [NotMapped] 
        public DateTime ExpirationDate { get; set; }

        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = Patient.GetDataKey();
        }
    }
}
