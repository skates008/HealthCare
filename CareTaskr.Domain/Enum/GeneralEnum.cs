using System;
using System.ComponentModel;
using System.Globalization;
using System.Linq;

namespace CareTaskr.Domain.Enum
{
    public static class EnumExtensions
    {
        public static string GetDescription<T>(this T e) where T : IConvertible
        {
            if (e.GetType().IsEnum)
            {
                Type type = e.GetType();
                Array values = System.Enum.GetValues(type);

                foreach (int val in values)
                {
                    if (val == e.ToInt32(CultureInfo.InvariantCulture))
                    {
                        var memInfo = type.GetMember(type.GetEnumName(val));
                        var descriptionAttribute = memInfo[0]
                            .GetCustomAttributes(typeof(DescriptionAttribute), false)
                            .FirstOrDefault() as DescriptionAttribute;

                        if (descriptionAttribute != null)
                        {
                            return descriptionAttribute.Description;
                        }
                    }
                }
            }

            return string.Empty;
        }
    }

    public enum UserType
    {

        [Description("Owner")] //previously "Super Admin"
        Owner = 1,
        [Description("Manager")] //previously "Admin"
        Manager = 2,
        [Description("User")] //previously "Therapist"
        User = 3,
        [Description("Client")] //previously "Patient or Participant"
        Client = 4,
        [Description("Primary Custodian")]//previously "Carer"
        PrimaryCustodian = 5,
        [Description("Client Custodian")]
        ClientCustodian = 6

    }

    public enum Gender
    {
        Male = 1,
        Female = 2,
        Unspecified = 3,
    }
    public enum BillableItemType
    {
        [Description("Billable")]
        Billable,
        [Description("Non Billable")]
        NonBillable

    }

    public enum AddressType
    {
        [Description("Client Address")]
        ClientAddress = 1,
        [Description("School Address")]
        SchoolAddress = 2,
        [Description("Other")]
        Other = 3
    }

    public enum Ethnicity
    {
        [Description("Aboriginal")]
        Aboriginal = 1,
        [Description("Torres Strait Islander")]
        TorresStraitIslander = 2,
        [Description("Aboriginal and Torres Strait Islander")]
        AboriginalandTorresStraitIslander = 3,
        [Description("Neither")]
        Neither = 4
    }

    public enum ClinicalStatus
    {
        Active = 1,
        InActive = 2,
        Resolved = 3,
    }

    public enum Category
    {
        Environment = 1,
        Food = 2,
        Other = 3,
    }


    public enum Critical
    {
        High = 1,
        UnableToAssess = 2,
        Low = 3,
    }

    public enum FormOfMedicine
    {
        Solid = 1,
        Liquid = 2,
        Capsule = 3,
    }

    public enum Frequency
    {
        Monthly = 1,
        Weekly = 2,
        Daily = 3,
    }

    public enum AppointmentAction
    {
        Default,
        Reschedule,
        Accept,
        Reject,
        Cancel,
        Finalize,
        CheckIn,
        CheckOut,
        InternalNote
    }

    public enum AppointmentStatus
    {
        Pending = 1,
        Confirmed = 2,
        Rejected = 3,
        Canceled = 4,
        Archived = 5,
        Completed = 6,
        NotArrived = 7,
        CheckedIn = 8,
        CheckedOut = 9
    }

    public enum Status
    {
        Arrived = 1,
        NotArrived = 2,
    }

    public enum NotArrivedStatus
    {
        [Description("No Show")]
        NoShow = 1,
        [Description("Running Late")]
        RunningLate = 2
    }

    public enum CancelAppointmentReason
    {
        [Description("Feeling Better")]
        FeelingBetter = 1,
        [Description("Condition Worse")]
        ConditionWorse = 2,
        [Description("Sick")]
        Sick = 3,
        [Description("Away")]
        Away = 4,
        [Description("Work")]
        Work = 5,
        [Description("Other")]
        Other = 6,
    }

    public enum NoteType
    {
        Internal,
        External,
        General
    }
    public enum PatientRecordFileType
    {
        Note, 
        Assessment,
        [Description("Service Agreement")]
        Service_Agreement,
        Invoice
    }



    public enum SourceOfBudget
    {
        [Description("NDIS")]
        NDIS = 1,
        [Description("Self Funded")]
        SelfFunded = 2,
        [Description("Plan Managed")]
        PlanManaged = 3,

    }

    public enum BillableItemUnit
    {
        [Description("Each")]
        Each = 1,
        [Description("Minutes")]
        Minutes = 2,
        [Description("Hour")]
        Hour = 3

    }

    public enum BillableIteGSTCode
    {
        [Description("P1 - 10% Tax")]
        P1,
        [Description("P2 - Tax Free")]
        P2,
        [Description("P5 - GST Out of Scope")]
        P5
    }

    public enum CareplanStatus
    {
        Draft = 1,
        Active = 2,
        Cancelled = 3,
        Completed = 4
    }

    public enum CareplanGoalOutcome
    {
        [Description("Achieved")]
        Achieved = 1,
        [Description("Partially Achieved")]
        PartiallyAchieved = 2,
        [Description("NotAchieved")]
        NotAchieved = 3,
        [Description("Other")]
        Other = 4
    }

    public enum BillingCycle
    {
        WEEKLY,
        MONTHLY
    }

    public enum BillingRunStatus
    {
        NONE,
        CANCELLED,
        SCHEDULED,
        RUNNING,
        SUCCESS,
        FAILED
    }

    public enum BillingType
    {
        [Description("Self Managed")]
        SELF_MANAGED,
        [Description("Agency Managed")]
        AGENCY_MANAGED,
        [Description("Company Plan Managed")]
        COMPANY_PLAN_MANAGED
    }

    public enum InvoiceTriggerType
    {
        ADHOC,
        INVOCE_RUN
    }

    public enum ProviderAction
    {
        Basic,
        Business,
        Service,
        Account,
        Billing
    }

    public enum UserDocumentType
    {
        UserProfile = 1,

    }

    public enum ProviderDocumentType
    {
        BusinessProfile = 1

    }

    public enum WarningType { 
        CAREPLAN, 
        SERVICE_AGREEMENT,
        ASSESSMENT
    }


}
