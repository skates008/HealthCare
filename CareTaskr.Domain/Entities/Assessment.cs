using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{
    public class Assesment : BaseEntity<int>, ITenantData, IPatientData
    {

        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }

        public string Title { get; set; }
        public string Notes { get; set; }

        public DateTime AssessmentDate { get; set; }
        public DateTime ValidFromDate { get; set; }
        public DateTime ValidToDate { get; set; }

        //storing as string, as most usually the assessor is external to the provider (phont number, address, email can be added to notes)
        public string Assessor { get; set; }

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
