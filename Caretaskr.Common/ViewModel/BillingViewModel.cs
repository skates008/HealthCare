using AutoMapper;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class BillingSettingsViewModel
    {
        public BillingCycle BillingCycle { get; set; } = BillingCycle.WEEKLY;
        public int BillingDayOfWeek { get; set; }
        public int BillingWeekCycle { get; set; } = 2;
        public int BillingDayOfMonth { get; set; } = 1;
        public string BillingTimeOfDay { get; set; } = "10:00";
        public int PaymentDueInDays { get; set; } = 30;
        public string InvoiceReferenceFormat { get; set; } = "INV(00000)";
        public string InvoicePaymentText { get; set; } = string.Empty;
    }


    public class BillingItemMapper : Profile
    {
        public BillingItemMapper()
        {
            CreateMap<BillingSettings, BillingSettingsViewModel>();
            CreateMap<BillingSettingsViewModel, BillingSettings>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}