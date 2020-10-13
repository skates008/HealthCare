using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class ProviderRequestViewModel
    {
        public string Name { get; set; }
        public string TradingName { get; set; }
        public string CompanyType { get; set; }
        public string BusinessWebSite { get; set; }
        public string ABNNumber { get; set; }

        public string NDISNumber { get; set; }
        public string NDISRegistrationNumber { get; set; }
        public string BusinessEmail { get; set; }
        public string PhoneNumber { get; set; }

        public bool IsNDISRegistered { get; set; }

        public string NDISServicesProvided { get; set; }
        public string Services { get; set; }
        public string RegistrationNumber { get; set; }
        public string MedicareRegistrationNumber { get; set; }


        public AddressDetails BusinessAddress { get; set; } = new AddressDetails();
        public AddressDetails RegisteredCompanyAddress { get; set; } = new AddressDetails();

        public BillingSettingsViewModel BillingSettings { get; set; }

        public List<ProviderBankDetailsViewModel> BankDetails { get; set; } = new List<ProviderBankDetailsViewModel>();
    }

    public class ProviderRegistrationCompleteViewModel : ProviderRequestViewModel
    {
        public string PrimaryContactFirstName { get; set; }
        public string PrimaryContactLastName { get; set; }
        public string PrimaryContactPosition { get; set; }
        public string PrimaryContactNo { get; set; }
        public string PrimaryContactEmail { get; set; }
    }

    public class ProviderViewModel : ProviderRequestViewModel
    {
        public Guid Id { get; set; }
    }

    public class ProviderUpdateRequestViewModel : ProviderUpdateResponseViewModel
    {
        public ProviderAction Action { get; set; }
    }

    public class ProviderUpdateResponseViewModel
    {
        //
        public string ProfileImage { get; set; }

        //BasicDetails
        public string Name { get; set; }
        public string TradingName { get; set; }
        public AddressDetails RegisteredCompanyAddress { get; set; }
        public string CompanyType { get; set; }
        public string ABNNumber { get; set; }

        //Business details
        public string BusinessEmail { get; set; }
        public string PhoneNumber { get; set; }
        public string BusinessWebSite { get; set; }
        public AddressDetails BusinessAddress { get; set; } = new AddressDetails();


        //Services
        public string Services { get; set; }
        public string RegistrationNumber { get; set; }
        public string MedicareRegistrationNumber { get; set; }


        //Account Information

        public List<ProviderBankDetailsViewModel> BankDetails { get; set; } = new List<ProviderBankDetailsViewModel>();

        public BillingSettingsViewModel BillingSettings { get; set; }
    }

    public class ProviderBankDetailsViewModel
    {
        public Guid? Id { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string BICSWIFTCode { get; set; }
        public virtual AddressDetails BankAddress { get; set; } = new AddressDetails();

        //Billing Information
        public BillingSettingsViewModel BillingSettings { get; set; } = new BillingSettingsViewModel();

        public string BranchName { get; set; }
    }


    public class ProviderMapper : Profile
    {
        public ProviderMapper()
        {
            CreateMap<Provider, ProviderViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<Provider, ProviderRequestViewModel>()
                .ForMember(dest => dest.BankDetails, src => src.MapFrom(x => x.ProviderBankDetails));

            CreateMap<Provider, ProviderUpdateResponseViewModel>()
                .ForMember(dest => dest.BankDetails, src => src.MapFrom(x => x.ProviderBankDetails));

            CreateMap<ProviderBankDetails, ProviderBankDetailsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));


            CreateMap<ProviderRequestViewModel, Provider>();

            CreateMap<ProviderRegistrationCompleteViewModel, Provider>();
        }
    }
}