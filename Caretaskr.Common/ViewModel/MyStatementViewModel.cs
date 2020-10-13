using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class MyStatementListViewModel
    {
        public Guid Id { get; set; }
        public string CarePlanName { get; set; }
        public string TimeEntryName { get; set; }
        public DateTime TimeEntryDate { get; set; }

        public decimal TotalCost { get; set; }
    }

    public class MyStatementDetailsViewModel : MyStatementListViewModel
    {
        public int TravelTimeInMinutes { get; set; }
        public bool FullDay { get; set; }

        public List<TimeEntryBillableItemViewModel> BillableItems { get; set; } =
            new List<TimeEntryBillableItemViewModel>();
    }


    public class StatementMapper : Profile
    {
        public StatementMapper()
        {
            CreateMap<TimeEntry, MyStatementListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.CarePlanName, src => src.MapFrom(x => x.Careplan.Title))
                .ForMember(dest => dest.TimeEntryName, src => src.MapFrom(x => x.Name))
                .ForMember(dest => dest.TimeEntryDate, src => src.MapFrom(x => x.StartTime))
                .ForMember(dest => dest.TotalCost, src => src.MapFrom(x => x.BillableItems.Sum(b => b.Cost)));

            CreateMap<TimeEntry, MyStatementDetailsViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.CarePlanName, src => src.MapFrom(x => x.Careplan.Title))
                .ForMember(dest => dest.TimeEntryName, src => src.MapFrom(x => x.Name))
                .ForMember(dest => dest.TimeEntryDate, src => src.MapFrom(x => x.StartTime))
                .ForMember(dest => dest.TotalCost, src => src.MapFrom(x => x.BillableItems.Sum(b => b.Cost)));
        }
    }
}