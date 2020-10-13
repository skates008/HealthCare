using Caretaskr.Common.ViewModel;
using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class Careplan : BaseEntity<int>, ITenantData, IPatientData
    {

        public static int REVIEW_WARNING_IN_DAYS = 42; //6 WEEKS <- TODO: in the future this should be a provider configuration


        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }

        public string Title { get; set; }
        public string ServiceBookingReference{ get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ReviewDate { get; set; }
        public DateTime? IssueDate { get; set; }


        public Guid KeyPractitionerId { get; set; }
        public virtual User KeyPractitioner { get; set; }

        public string Goal { get; set; }
        public string Recomendations { get; set; }

        public CareplanStatus Status { get; set; } = CareplanStatus.Draft;

        public virtual ICollection<CareplanPractitioner> Practitioners { get; set; } = new HashSet<CareplanPractitioner>();

        public virtual ICollection<CareplanFamilyGoal> FamilyGoals { get; set; } = new HashSet<CareplanFamilyGoal>();
        public virtual ICollection<FundedSupport> FundedSupports { get; set; } = new HashSet<FundedSupport>();
        public virtual List<Invoice> Invoices { get; set; } = new List<Invoice>();
        public virtual ICollection<Note> Notes { get; set; }


        public bool isDefault { get; set; } = false;
        public BillingType BillingType{ get; set; }

        public decimal TotalBudget { get; set; }
        [NotMapped]
        public decimal RemainingFunds { get; set; }


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

    public class CareplanPractitioner
    {
        public int CareplanId { get; set; }
        public virtual Careplan Careplan { get; set; }

        public Guid UserId { get; set; }
        public virtual User User { get; set; }
    }
}
