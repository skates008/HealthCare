using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{
    public class ServiceAgreement : BaseEntity<int>, ITenantData, IPatientData
    {

        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get;set;}


        public string Title { get; set; }
        public string Notes { get; set; }

        public DateTime SignedDate { get; set; }
        public DateTime ValidFromDate { get; set; }
        public DateTime ValidToDate { get; set; }

        public virtual ICollection<PatientRecordFile> Files { get; set; }

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
