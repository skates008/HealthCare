using System;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class CreateAllergiesRequestViewModel
    {
        public ClinicalStatus ClinicalStatus { get; set; }
        public Category Category { get; set; }
        public Critical Critical { get; set; }

        public DateTime LastOccurenceDate { get; set; }
        public string Allergen { get; set; }
    }


    public class AllergiesListViewModel
    {
        public Guid Id { get; set; }
        public string ClinicalStatus { get; set; }
        public string Category { get; set; }
        public string Critical { get; set; }

        public DateTime LastOccurenceDate { get; set; }
        public string Allergen { get; set; }
    }


    public class AllergiesMapper : Profile
    {
        public AllergiesMapper()
        {
            CreateMap<CreateAllergiesRequestViewModel, Allergies>();
            CreateMap<Allergies, AllergiesListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));
        }
    }
}