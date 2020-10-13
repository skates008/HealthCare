using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{
    public class CareplanFamilyGoal : BaseEntity<int>, ITenantData, IPatientData
    {
        public int CareplanId { get; set; }
        public virtual Careplan CarePlan { get; set; }

        public string Title { get; set; }
        public string Strategy { get; set; }
        public string Support { get; set; }

        public virtual ICollection<CareplanShortTermGoal> ShortTermGoals { get; set; } = new HashSet<CareplanShortTermGoal>();



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
