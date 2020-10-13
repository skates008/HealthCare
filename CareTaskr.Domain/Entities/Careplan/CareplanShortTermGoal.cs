using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;

namespace CareTaskr.Domain.Entities
{
    public class CareplanShortTermGoal : BaseEntity<int>, ITenantData, IPatientData
    {
        public int CareplanFamilyGoalId { get; set; }
        public virtual CareplanFamilyGoal CarePlanFamilyGoal { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public CareplanGoalOutcome? Outcome { get; set; }
        public string OutcomeDetail { get; set; }
        public string Strategy { get; set; }


        public string TenantDataKey { get; set; }
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = CarePlanFamilyGoal.CarePlan.PatientRecord.Patient.GetDataKey();
        }

        public void SetTenantDataKey()
        {
            TenantDataKey = CarePlanFamilyGoal.CarePlan.PatientRecord.Provider.GetDataKey();
        }
    }
}
