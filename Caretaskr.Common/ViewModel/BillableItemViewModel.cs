using System;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class BillableItemRequestViewModel
    {
        public string ProviderId { get; set; }
        public bool IsBillable { get; set; } = true;
        public string Name { get; set; }
        public double Price { get; set; }
        public string NDISNumber { get; set; }
        public BillableItemUnit? Unit { get; set; }
        public BillableIteGSTCode? GSTCode { get; set; }
        public string Description { get; set; }
        public BillableItemUnit? InputUnit { get; set; }

    }


    public class BillableItemViewModel : BillableItemRequestViewModel
    {
        public Guid Id { get; set; }
    }

    public class BillableItemDetailViewModel
    {
        public Guid Id { get; set; }
        public string ProviderId { get; set; }
        public bool IsBillable { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string NDISNumber { get; set; }
        public int? Unit { get; set; }
        public BillableItemUnit? InputUnit { get; set; }

        public int? GSTCode { get; set; }
        public string Description { get; set; }
    }


    public class BillableItemMapper : Profile
    {
        public BillableItemMapper()
        {
            CreateMap<BillableItem, BillableItemViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Price, opt => opt.Condition(x => x.IsBillable))
                .ForMember(dest => dest.NDISNumber, opt => opt.Condition(x => x.IsBillable))
                .ForMember(dest => dest.GSTCode, opt => opt.Condition(x => x.IsBillable))
                .ForMember(dest => dest.Unit, opt => opt.Condition(x => x.IsBillable))
                .ForMember(dest => dest.InputUnit, src => src.MapFrom(x => x.Unit == BillableItemUnit.Hour ? BillableItemUnit.Minutes : x.Unit));


            CreateMap<BillableItem, BillableItemDetailViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.InputUnit, src => src.MapFrom(x => x.Unit == BillableItemUnit.Hour ? BillableItemUnit.Minutes : x.Unit));

        }
    }
}