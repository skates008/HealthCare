using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class CarePlanViewModel : CreateCarePlanViewModel
    {
        public Guid? Id { get; set; }
        public string NDISNumber { get; set; }

        public string PatientName { get; set; }
        public CareplanStatus Status { get; set; }

        public decimal TotalBudget { get; set; }

        public decimal RemainingFunds { get; set; }
        public bool IsDefault { get; set; }


    }


    public class CarePlanDetailsViewModel
    {
        public Guid? Id { get; set; }
        public BillingType BillingType { get; set; }
        public Guid PatientId { get; set; }
        public string Title { get; set; }
        public string ServiceBookingReference { get; set; }
        public string NDISNumber { get; set; }

        public string KeyPractitionerName { get; set; }
        public string PatientName { get; set; }
        public string Status { get; set; }
        public decimal TotalBudget { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ReviewDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public decimal RemainingFunds { get; set; }

        public bool IsDefault { get; set; }


        public List<CareplanPractitionerViewModel> Practitioners { get; set; } =
            new List<CareplanPractitionerViewModel>();

        public List<FamilyGoalsDetailsViewModel> FamilyGoals { get; set; } = new List<FamilyGoalsDetailsViewModel>();

        public List<CarePlanAssessmentListViewModel> Assessments { get; set; } =
            new List<CarePlanAssessmentListViewModel>();

        public List<CarePlanObservationListViewModel> Observations { get; set; } =
            new List<CarePlanObservationListViewModel>();

        public List<CarePlanTreatmentNoteListViewModel> TreatmentNotes { get; set; } =
            new List<CarePlanTreatmentNoteListViewModel>();
    }

    public class CarePlanListViewModel
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Title { get; set; }
        public string PatientName { get; set; }
        public string PractionerName { get; set; }
        public DateTime CreatedDate { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime ReviewDate { get; set; }

        public decimal RemainingFunds { get; set; }
        public decimal TotalBudget { get; set; }


        public string Status { get; set; }
        public string NDISNumber { get; set; }

        public bool IsDefault { get; set; }
    }

    public class CreateCarePlanViewModel
    {
        public BillingType BillingType { get; set; }
        public Guid PatientId { get; set; }
        public Guid KeyPractitionerId { get; set; }
        public string Title { get; set; }
        public string ServiceBookingReference { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public DateTime? ReviewDate { get; set; }
        public CareplanStatus Status { get; set; }

        public List<FamilyGoalsViewModel> FamilyGoals { get; set; } = new List<FamilyGoalsViewModel>();
        public List<FundedSupportViewModel> FundedSupport { get; set; } = new List<FundedSupportViewModel>();

        public List<CareplanPractitionerViewModel> Practitioners { get; set; } =
            new List<CareplanPractitionerViewModel>();
        public decimal TotalBudget { get; set; }
    }


    public class FamilyGoalsViewModel
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public string Strategy { get; set; }
        public string Support { get; set; }

        public ICollection<ShortTermGoalsViewModel> ShortTermGoals { get; set; } = new List<ShortTermGoalsViewModel>();
    }

    public class FamilyGoalsDetailsViewModel : FamilyGoalsViewModel
    {
        public new ICollection<ShortTermGoalsDetailsViewModel> ShortTermGoals { get; set; } =
            new List<ShortTermGoalsDetailsViewModel>();
    }

    public class CareplanPractitionerViewModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
    }

    public class ShortTermGoalsViewModel
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? Outcome { get; set; }
        public string OutcomeDetail { get; set; }
        public string Strategy { get; set; }
    }

    public class ShortTermGoalsDetailsViewModel : ShortTermGoalsViewModel
    {
        public new string Outcome { get; set; }
    }

    public class FundedSupportViewModel
    {
        public int? Id { get; set; }
        public int? FundCategoryId { get; set; }
        public int? BudgetPlanId { get; set; }

        public decimal? FundAllocated { get; set; }
    }

    public class SaveCarePlanObservationViewModel
    {
        public Guid PatientId { get; set; }
        public Guid CarePlanId { get; set; }
        public string Observation { get; set; }
    }

    public class SaveCarePlanAssessmentViewModel
    {
        public Guid PatientId { get; set; }
        public Guid CarePlanId { get; set; }
        public string Assessment { get; set; }
    }

    public class SaveCarePlanTreatmentNoteViewModel
    {
        public Guid PatientId { get; set; }
        public Guid CarePlanId { get; set; }
        public string TreatmentNote { get; set; }
    }

    public class CarePlanObservationListViewModel
    {
        public Guid Id { get; set; }

        public string Note { get; set; }
        public DateTime CreatedDate { get; set; }
        public string PractitionerNamer { get; set; }
    }

    public class CarePlanTreatmentNoteListViewModel
    {
        public Guid Id { get; set; }

        public string Note { get; set; }
        public DateTime CreatedDate { get; set; }
        public string PractitionerNamer { get; set; }
    }

    public class CarePlanAssessmentListViewModel
    {
        public Guid Id { get; set; }
        public string Note { get; set; }
        public DateTime CreatedDate { get; set; }
        public string PractitionerNamer { get; set; }
    }

    public class CarePlanImportRequestViewModel
    {
        public string Source { get; set; }
    }


    public class CarePlanMapper : Profile
    {
        public CarePlanMapper()
        {
            CreateMap<Careplan, CarePlanViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<CareplanShortTermGoal, FamilyGoalsViewModel>();

            CreateMap<CareplanPractitioner, CareplanPractitionerViewModel>();

            CreateMap<FundedSupport, FundedSupportViewModel>();

            CreateMap<Careplan, CarePlanViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.KeyPractitionerId, src => src.MapFrom(x => x.KeyPractitioner.Id));

            CreateMap<CareplanPractitioner, CareplanPractitionerViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.UserId))
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.User.FullName));

            CreateMap<CareplanFamilyGoal, FamilyGoalsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<CareplanFamilyGoal, FamilyGoalsDetailsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<CareplanShortTermGoal, ShortTermGoalsDetailsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<CareplanShortTermGoal, ShortTermGoalsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<Careplan, CarePlanListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientName, src => src.MapFrom(x => x.PatientRecord.Patient.User.FullName))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                //.ForMember(dest => dest.PractionerName, src => src.MapFrom(x => x.Practitioner.FullName))
                .ForMember(dest => dest.NDISNumber, src => src.MapFrom(x => x.PatientRecord.Patient.NDISNumber))
                .ForMember(dest => dest.Status, src => src.MapFrom(x => x.Status.ToString()));

            CreateMap<CarePlanNote, CarePlanObservationListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Note, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.PractitionerNamer,
                    src => src.MapFrom(x => x.Careplan.KeyPractitioner.FullName));

            CreateMap<CarePlanNote, CarePlanTreatmentNoteListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Note, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.PractitionerNamer,
                    src => src.MapFrom(x => x.Careplan.KeyPractitioner.FullName));

            CreateMap<CarePlanNote, CarePlanAssessmentListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Note, src => src.MapFrom(x => x.Note))
                .ForMember(dest => dest.PractitionerNamer,
                    src => src.MapFrom(x => x.Careplan.KeyPractitioner.FullName));
        }
    }
}