using System;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class ClinicalImpressionRequestViewModel
    {
        public Guid PractitionerId { get; set; }
        public Guid PatientId { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }

    public class CreateClinicalImpressionRequestViewModel
    {
        public Guid PractitionerId { get; set; }
        public Guid PatientId { get; set; }
        public string Assessment { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }

    public class ClinicalImpressionListViewModel
    {
        public Guid Id { get; set; }
        public Guid PractitionerId { get; set; }
        public Guid PatientId { get; set; }
        public string Assessment { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }

    public class ClinicalImpressionMapper : Profile
    {
        public ClinicalImpressionMapper()
        {
            CreateMap<CreateClinicalImpressionRequestViewModel, ClinicalImpression>();
            CreateMap<ClinicalImpression, ClinicalImpressionListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId));
        }
    }
}