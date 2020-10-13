using CareTaskr.Domain.Base;
using CareTaskr.Domain.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class Allergies : BaseEntity<Guid>
    {

        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public string FhirResourceId { get; set; }
        public string FhirResourceUri { get; set; }

        //TODO: make not [NotMapped]
        public Category Category { get; set; }

        [NotMapped]
        public ClinicalStatus ClinicalStatus { get; set; }
        [NotMapped] 
        public Critical Critical { get; set; }
        [NotMapped] 
        public DateTime LastOccurenceDate { get; set; }
        [NotMapped] 
        public string Allergen { get; set; }


    }
}
