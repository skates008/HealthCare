using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caretaskr.Common.ViewModel
{
    public class BillingSettings : BaseEntity<int>,  ITenantData
    {
        public int ProviderId { get; set; }
        public virtual Provider Provider{ get; set; }
        public BillingCycle BillingCycle { get; set; } = BillingCycle.WEEKLY;
        public DayOfWeek BillingDayOfWeek { get; set; } = DayOfWeek.Sunday;
        public int BillingWeekCycle { get; set; } = 2;
        public int BillingDayOfMonth { get; set; } = 1;
        public string BillingTimeOfDay { get; set; } = "10:00";

        public DateTime FirstRunDate { get; set; }
        public int PaymentDueInDays { get; set; } = 30;
        public string InvoiceReferenceFormat { get; set; } = "INV(00000)";
        public string InvoicePaymentText { get; set; } = string.Empty;

        public string TenantDataKey { get; set; }
        
        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }

    public class BillingRun : BaseEntity<int>,  ITenantData
    {
        public int BillingSettingsId { get; set; }
        public virtual BillingSettings BillingSettings{ get; set; }

        public BillingRunStatus Status{ get; set; }
        public DateTime RunDate { get; set; }
        public string TriggeredBy { get; set; }
        public string BillingConfSnapshot { get; set; }

        //public DayOfWeek BillingDayOfWeek { get; set; }
        //public int BillingWeekCycle { get; set; }
        //public int BillingDayOfMonth { get; set; }

        //public int PaymentDueInDays { get; set; }
        public DateTime ExecutionDate { get; set; }

        public string Observations { get; set; }

        public virtual ICollection<Invoice> Invoices { get; set; }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = BillingSettings.Provider.GetDataKey();
        }

        public BillingRun() { }
        public BillingRun(BillingSettings billingSettings, DateTime runDate) {
            BillingSettings = billingSettings;
            RunDate = runDate;
            Status = BillingRunStatus.SCHEDULED;

            //save snapshot of billing settings for historical reasons
            BillingConfSnapshot = JsonConvert.SerializeObject(billingSettings);
        }
    }

    public class BillingDetails : BaseEntity<int>, ITenantData {

        public int PatientRecordId { get; set; }
        public virtual PatientRecord PatientRecord{ get; set; }

        public string AccountNumber { get; set; }
        public string TermsOfService { get; set; }
        public string Email { get; set; }
        public int? AddressId { get; set; }
        public virtual Address Address { get; set; }


        public int? PlanManagementCompanyId { get; set; }
        public virtual PlanManagementCompany PlanManagementCompany { get; set; }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = PatientRecord.Provider.GetDataKey();
        }
    }



}
