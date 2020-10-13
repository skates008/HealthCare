using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class FundedSupport : BaseEntity<int>, ITenantData, IPatientData
    {

        public int CarePlanId { get; set; }
        public virtual Careplan CarePlan { get; set; }

        public int? FundCategoryId { get; set; }
        public virtual FundCategory FundCategory { get; set; }
        public int? BudgetPlanId { get; set; }
        public virtual Budget BudgetPlan { get; set; }
        public string Goal { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal? FundAllocated { get; set; }


        public string TenantDataKey { get; set; }
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = CarePlan.PatientRecord.Patient.GetDataKey();
        }

        public void SetTenantDataKey()
        {
            TenantDataKey = CarePlan.PatientRecord.Provider.GetDataKey();
        }

    }
}
