using Caretaskr.Common.ViewModel;
using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{
    public class Provider : BaseEntity<int>
    {
        public string TradingName { get; set; }
        public string CompanyName { get; set; }

        public virtual AddressDetails BusinessAddress { get; set; } = new AddressDetails();
        public virtual AddressDetails RegisteredCompanyAddress { get; set; } = new AddressDetails();

        public string BusinessEmail { get; set; }
        public string PhoneNumber { get; set; }
        public string BusinessWebSite { get; set; }
        public string ABNNumber { get; set; }
        public string Website{ get; set; }



        public string NDISNumber { get; set; }
        public string NDISRegistrationNumber { get; set; }
        public string MedicareRegistrationNumber { get; set; }
        public string PrimaryContactFirstName { get; set; }
        public string PrimaryContactLastName { get; set; }
        public string PrimaryContactPosition { get; set; }
        public string PrimaryContactNo { get; set; }
        public string PrimaryContactEmail { get; set; }
        public string NDISServicesProvided { get; set; }
        public string Services { get; set; }
        public string RegistrationNumber { get; set; }
        public string Name { get; set; }

       
        public string CompanyType { get; set; }

        public virtual BillingSettings BillingSettings { get; set; }
        public virtual List<BillingRun> BillingRuns{ get; set; }



        public virtual ICollection<ProviderUser> Users { get; set; }

        //        public virtual ICollection<Patient> Patients{ get; set; }

        public virtual ICollection<PatientRecord> PatientRecords { get; set; }

        public virtual ICollection<AppointmentType> AppointmentTypes { get; set; }

        public virtual ICollection<Invoice> Invoices{ get; set; }


        public virtual ICollection<ProviderBankDetails> ProviderBankDetails { get; set; } = new HashSet<ProviderBankDetails>();

        public string GetDataKey() {
            return $"|{Id}|";
        }
    }

    public class ProviderUser : ITenantData
    {
        public int ProviderId { get; set; }
        public virtual Provider Provider{ get; set; }


        public Guid UserId { get; set; }
        public virtual User User { get; set; }

        public bool IsActive { get; set; } = true;


        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }

    public class ProviderBankDetails : BaseEntity<int>, ITenantData
    {
        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }

        public string BankName { get; set; }
        public string AccountNumber { get; set; }

        public string BICSWIFTCode { get; set; }
        public string BranchName { get; set; }

        public virtual AddressDetails BankAddress { get; set; } = new AddressDetails();


        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }




}
