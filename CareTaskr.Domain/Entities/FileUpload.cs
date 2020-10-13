using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;

namespace CareTaskr.Domain.Entities
{
    public class FileUpload : BaseEntity<int>
    {
        public int MyProperty { get; set; }

        public string  Title { get; set; }
        public double Size { get; set; }
        public string Filename { get; set; }

        public string OriginalFilename { get; set; }


        public string MimeType{ get; set; }
        public string Url { get; set; }
        public string ThumbnailUrl { get; set; }

        public virtual ICollection<Note> Notes { get; set; }
        public virtual PatientRecordFile PatientRecordFile{ get; set; }

        [NotMapped]
        public Stream Stream{ get; set; }
    }


    public class PatientRecordFile : BaseEntity<int>, ITenantData, IPatientData
    {
        public PatientRecordFileType Type{ get; set; }

        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord { get; set; }


        public int? AssesmentId { get; set; }
        public virtual Assesment Assesment{ get; set; }


        public int? NoteId { get; set; }
        public virtual Note Note { get; set; }


        public int? ServiceAgreementId { get; set; }
        public virtual ServiceAgreement ServiceAgreement{ get; set; }


        public int FileUploadId { get; set; }
        public virtual FileUpload FileUpload {get;set;}
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
