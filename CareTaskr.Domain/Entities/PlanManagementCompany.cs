using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class PlanManagementCompany : BaseEntity<int>, ITenantData
    {
        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }
        public string Name { get; set; }
        public int AddressId{ get; set; }
        public virtual Address Address{ get; set; }

        public virtual Collection<PatientRecord> PatientRecords { get; set; }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }
}
