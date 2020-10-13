using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class PatientCommonDetailsViewModel
    {
        public AddressViewModel SchoolAddress { get; set; } = new AddressViewModel();
        public string SchoolName { get; set; }

        public string SchoolTeacherName { get; set; }
        public string SchoolTeacherEmail { get; set; }
        public string SchoolPrimaryContact { get; set; }
        public string SchoolContactNumber { get; set; }
        public string SchoolEmail { get; set; }

        public BillingDetailsViewModel BillingDetails { get; set; }
    }

    public class PatientRegisterRequestViewModel : PatientCommonDetailsViewModel
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PreferredName { get; set; }
        public string NDISNumber { get; set; }

        public string Language { get; set; }
        public Gender Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Country { get; set; }
        public Ethnicity Ethnicity { get; set; }
        public Guid ProviderId { get; set; }
        public AddressViewModel Address { get; set; } = new AddressViewModel();

        public PatientCustodianGroupViewModel Custodians { get; set; } = new PatientCustodianGroupViewModel();


        public bool HasCarer { get; set; } = true;


        public List<PatientCustodianViewModel> GetAllCustodians()
        {
            //REFACTOR API: this is here to make things easier for FE
            var custodians = Custodians.Secondary;
            if (Custodians.Primary != null) custodians.Insert(0, Custodians.Primary);
            return custodians;
        }
    }

    public class PatientCustodianGroupViewModel
    {
        public PatientCustodianViewModel Primary { get; set; }
        public List<PatientCustodianViewModel> Secondary { get; set; } = new List<PatientCustodianViewModel>();
    }

    public class PatientCustodianViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Contact { get; set; }
        public string Relation { get; set; }
    }

    public class UpdatePatientRequestViewModel : PatientRegisterRequestViewModel
    {
        public Guid Id { get; set; }
    }

    public class BillingDetailsViewModel
    {
        public AddressViewModel Address { get; set; } = new AddressViewModel();

        public string AccountNumber { get; set; }
        public string Email { get; set; }

        // public string TermsOfService { get; set; }
        // public int? PlanManagementCompanyId { get; set; }
        // public virtual PlanManagementCompany PlanManagementCompany { get; set; }
    }

    public class PatientResponseViewModel : PatientCommonDetailsViewModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PreferredName { get; set; }
        public string NDISNumber { get; set; }
        public string Email { get; set; }
        public int Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Country { get; set; }
        public int Ethnicity { get; set; }
        public string AvatarUrl { get; set; }
        public decimal RemainingFunds { get; set; }


        public PatientCustodianGroupViewModel Custodians { get; set; } = new PatientCustodianGroupViewModel();

        public bool HasCarer { get; set; }

        public string Language { get; set; }


        public AddressViewModel Address { get; set; } = new AddressViewModel();

        public List<PatientWarningViewModel> Warnings { get; set; }
    }

    public class PatientProfileResponseViewModel
    {
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string Country { get; set; }
        //public string Ethnicity { get; set; }
    }

    public class PatientDetailsResponseViewModel : PatientCommonDetailsViewModel
    {
        public PatientDetailsResponseViewModel()
        {
            NextAppointment = new AppointmentResponseViewModel();
            Medications = new List<MedicationListViewModel>();
            Allergies = new List<AllergiesListViewModel>();
            CarePlans = new List<CarePlanListViewModel>();

            TreatmentNotes = new List<PatientTreatmentNoteListViewModel>();
            Assesments = new List<PatientAssessmentListViewModel>();
            Observations = new List<PatientObservationListViewModel>();
        }

        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PreferredName { get; set; }
        public string NDISNumber { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string Country { get; set; }

        //public string Ethnicity { get; set; }
        public string AvatarUrl { get; set; }
        public decimal RemainingFunds { get; set; }
        public PatientCustodianGroupViewModel Custodians { get; set; } = new PatientCustodianGroupViewModel();

        public AddressViewModel Address { get; set; }
        public bool HasCarer { get; set; }
        public string Language { get; set; }

        public AppointmentResponseViewModel NextAppointment { get; set; }

        public List<AppointmentResponseViewModel> NextAppointments { get; set; } =
            new List<AppointmentResponseViewModel>();

        public List<MedicationListViewModel> Medications { get; set; }
        public List<AllergiesListViewModel> Allergies { get; set; }
        public List<CarePlanListViewModel> CarePlans { get; set; }
        public List<PatientTreatmentNoteListViewModel> TreatmentNotes { get; set; }
        public List<PatientAssessmentListViewModel> Assesments { get; set; }
        public List<PatientObservationListViewModel> Observations { get; set; }
        public List<TimeEntryViewModel> TimeEntry { get; set; } = new List<TimeEntryViewModel>();
        public List<PatientWarningViewModel> Warnings { get; set; }
    }

    public class PatientListResponseViewModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PreferredName { get; set; }
        public string NDISNumber { get; set; }

        public Gender Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Country { get; set; }
        public decimal? AvailableBudget { get; set; } = default(decimal);
        public string Address { get; set; }
        public string SchoolAddress { get; set; }
        public List<PatientWarningViewModel> Warnings { get; set; }
    }


    public class SavePatientAssessmentViewModel
    {
        public Guid PatientId { get; set; }
        public string Assessment { get; set; }
    }

    public class SavePatientTreatmentNoteViewModel
    {
        public Guid PatientId { get; set; }
        public string TreatmentNote { get; set; }
    }


    public class PatientTreatmentNoteViewModel
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid PatientId { get; set; }
        public string TreatmentNote { get; set; }
        public string CreatedBy { get; set; }

        public ProviderViewModel Provider { get; set; }
    }

    public class PatientTreatmentNoteListViewModel
    {
        public DateTime? AppointmentDate { get; set; }
        public string TreatmentNote { get; set; }
        public string Practitioner { get; set; }
    }

    public class PatientAssessmentListViewModel
    {
        public DateTime? AppointmentDate { get; set; }
        public string Assessment { get; set; }
        public string Practitioner { get; set; }
    }

    public class InitPatientRegistrationtViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NDISNumber { get; set; }

        public string CarerFirstName { get; set; }
        public string CarerLastName { get; set; }
        public string CarerEmail { get; set; }
        public string CarerContact { get; set; }
        public string CarerRelation { get; set; }
        public bool HasCarer { get; set; }
    }

    public class PatientWarningViewModel
    {
        public WarningType Type { get; set; }
        public string Text { get; set; }
    }


    public class PatientMapper : Profile
    {
        public PatientMapper()
        {

            CreateMap<UpdatePatientRequestViewModel, User>()
                  .ForMember(dest => dest.Id, opts => opts.Ignore())
                  .ForMember(dest => dest.FullName, src => src.MapFrom(x => string.Join(" ", x.FirstName, x.LastName)));


            CreateMap<UpdatePatientRequestViewModel, Patient>()
                .ForMember(dest => dest.Id, opts => opts.Ignore());

            CreateMap<Patient, PatientResponseViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Email, src => src.MapFrom(x => x.User.Email))
                .ForMember(dest => dest.FirstName, src => src.MapFrom(x => x.User.FirstName))
                .ForMember(dest => dest.LastName, src => src.MapFrom(x => x.User.LastName))
                .ForMember(dest => dest.Address, src => src.MapFrom(x => x.User.Address));


            CreateMap<Patient, PatientDetailsResponseViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.FirstName, src => src.MapFrom(x => x.User.FirstName))
                .ForMember(dest => dest.LastName, src => src.MapFrom(x => x.User.LastName))
                .ForMember(dest => dest.FullName, src => src.MapFrom(x => x.User.FullName))
                .ForMember(dest => dest.Email, src => src.MapFrom(x => x.User.Email))
                .ForMember(dest => dest.DateOfBirth,
                    src => src.MapFrom(x => x.DateOfBirth == DateTime.MinValue ? null : x.DateOfBirth))
                .ForMember(dest => dest.Gender,
                    src => src.MapFrom(x => Enum.IsDefined(typeof(Gender), x.Gender) ? x.Gender.ToString() : "N/A"))
                .ForMember(dest => dest.Address, src => src.MapFrom(x => x.User.Address));
    

            CreateMap<BillingDetails, BillingDetailsViewModel>();
            CreateMap<BillingDetailsViewModel, BillingDetails>();


            CreateMap<Patient, PatientProfileResponseViewModel>()
                .ForMember(dest => dest.FullName, src => src.MapFrom(x => x.User.FullName))
                //.ForMember(dest => dest.Ethnicity, src => src.MapFrom(x => Enum.IsDefined(typeof(Ethnicity), x.Ethnicity) ? x.Ethnicity.ToDescription() : "N/A"))
                .ForMember(dest => dest.Gender,
                    src => src.MapFrom(x => Enum.IsDefined(typeof(Gender), x.Gender) ? x.Gender.ToString() : "N/A"));

            CreateMap<Patient, PatientListResponseViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Address, src => src.MapFrom(x => string.IsNullOrEmpty(x.User.Address.Name)
                    ? string.Join(", ",
                        new[]
                        {
                            x.User.Address.Unit, x.User.Address.StreetNumber, x.User.Address.StreetName,
                            x.User.Address.City, x.User.Address.State
                        }.Where(c => !string.IsNullOrEmpty(c)))
                    : x.User.Address.Name))
                .ForMember(dest => dest.AvailableBudget,
                    src => src.MapFrom(x => x.Budgets.Sum(b => b.RemainingBudget)));


            CreateMap<PatientNote, PatientTreatmentNoteViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.TreatmentNote, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.CreatedBy, src => src.MapFrom(x => x.CreatedBy.FullName));

            CreateMap<PatientWarning, PatientWarningViewModel>();
        }
    }
}