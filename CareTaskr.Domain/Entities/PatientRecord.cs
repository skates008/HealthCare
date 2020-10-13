using Caretaskr.Common.ViewModel;
using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{
    public class PatientRecord : BaseEntity<int>, ITenantData, IPatientData
    {

        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }
        
        public virtual BillingDetails BillingDetails { get; set; }

        public virtual List<Careplan> Careplans{ get; set; }

        public virtual ICollection<Note> Notes { get; set; }

        public virtual ICollection<PatientRecordFile> Files{ get; set; }

        public virtual ICollection<ServiceAgreement> ServiceAgreements { get; set; }
        public virtual ICollection<Assesment> Assesments{ get; set; }


        public string TenantDataKey { get; set; }
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            PatientDataKey = Patient.GetDataKey();
        }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }

    public class PatientWarning {
        public WarningType Type{ get; set; }
        public string Text { get; set; }
    }
}
