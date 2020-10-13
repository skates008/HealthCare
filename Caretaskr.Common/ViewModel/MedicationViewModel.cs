using System;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class CreateMedicationRequestViewModel
    {
        public string Manufacturer { get; set; }
        public string Medicine { get; set; }
        public FormOfMedicine FormOfMedicine { get; set; }


        public int Amount { get; set; }
        public Frequency Frequency { get; set; }
        public DateTime ExpirationDate { get; set; }
    }


    public class MedicationListViewModel : CreateMedicationRequestViewModel
    {
        public Guid Id { get; set; }
    }

    public class MedicationMapper : Profile
    {
        public MedicationMapper()
        {
            CreateMap<Medication, MedicationListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));
        }
    }
}