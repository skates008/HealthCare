using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class Patient : BaseEntity<Guid>
    {
        public Guid UserId { get; set; }
        public string FhirResourceId { get; set; }
        public string FhirResourceUri { get; set; }
        public virtual User User { get; set; }
        public string NDISNumber{ get; set; }


        public virtual ICollection<PatientRecord> PatientRecords{ get; set; }
        public virtual ICollection<CarerPatient> CarerPatients{ get; set; }
        public virtual ICollection<Budget> Budgets { get; set; }


        public Ethnicity? Ethnicity { get; set; }
        //2 letters country code
        public string Country{ get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PreferredName { get; set; }
        public Gender Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public bool HasCarer { get; set; }
        public string Language { get; set; }

        public string SchoolName { get; set; }
        // remove schoooladdress and add addressid
        //public string SchoolAddress { get; set; }
        public int? SchoolAddressId { get; set; }
        public virtual Address SchoolAddress { get; set; }
        public string SchoolTeacherName { get; set; }
        public string SchoolTeacherEmail { get; set; }
        public string SchoolPrimaryContact { get; set; }
        public string SchoolContactNumber { get; set; }
        public string SchoolEmail { get; set; }
        
        [NotMapped]
        public List<PatientWarning> Warnings{ get; set; }

        public string GetDataKey()
        {
            return $"|{Id}|";
        }
    }



}
