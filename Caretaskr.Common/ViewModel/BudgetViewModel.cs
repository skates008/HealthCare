using System;
using AutoMapper;
using Caretaskr.Common.Extensions;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class BudgetViewModel
    {
        public int Id { get; set; }
        public string BudgetName { get; set; }
        public SourceOfBudget SourceOfBudget { get; set; }
        public decimal TotalBudget { get; set; }

        public decimal RemainingBudget { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }

    public class CreateBudgetViewModel
    {
        public string BudgetName { get; set; }
        public SourceOfBudget SourceOfBudget { get; set; }
        public decimal TotalBudget { get; set; }


        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }


    public class ListBudgetViewModel
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }

        public string BudgetName { get; set; }
        public string SourceOfBudget { get; set; }
        public decimal TotalBudget { get; set; }

        public decimal RemainingBudget { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }

    public class BudgetMapper : Profile
    {
        public BudgetMapper()
        {
            CreateMap<Budget, ListBudgetViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.SourceOfBudget, src => src.MapFrom(x => x.SourceOfBudget.ToDescription()));
        }
    }
}