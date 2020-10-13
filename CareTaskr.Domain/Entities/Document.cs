using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;

namespace CareTaskr.Domain.Entities
{
    public class UserDocument : BaseEntity<int>
    {
        public Guid UserId { get; set; }
        public string FileName { get; set; }
        public string ThumbnailImageName { get; set; }
        public string DocumentType { get; set; }
        public UserDocumentType DocumentTypeId { get; set; } 
        public string DocumentPath { get; set; }
 
        public virtual User User { get; set; }
         
         

    }

    public class ProviderDocument : BaseEntity<int>, ITenantData
    {
        public int ProviderId { get; set; }
        public string FileName { get; set; }
        public string ThumbnailImageName { get; set; }
        public string DocumentType { get; set; }
        public ProviderDocumentType DocumentTypeId { get; set; }
        public string DocumentPath { get; set; }

        public virtual Provider Provider { get; set; }


        public string TenantDataKey { get; set; }


        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }

    }

}
