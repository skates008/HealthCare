using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;

namespace Caretaskr.Common.ViewModel.General
{
    public class ListViewModel
    {
        public object Id { get; set; }
        public string Text { get; set; }
    }

    public class ListBillableItemViewModel : ListViewModel
    {
        public string Unit { get; set; }
        public double Price { get; set; }
    }

    public class ListAddressViewModel : ListViewModel
    {
        public AddressViewModel Address { get; set; }
    }

    public class ListCarePlanViewModel : ListViewModel
    {
        public string Status { get; set; }
    }

    public class ListMapper : Profile
    {
        public ListMapper()
        {
            CreateMap<Country, ListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.CountryCode))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.CountryName));

            CreateMap<User, ListViewModel>()
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.FullName));

            CreateMap<Patient, ListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.User.FullName));


            CreateMap<Budget, ListViewModel>()
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.BudgetName));

            CreateMap<FundCategory, ListViewModel>()
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Name));

            CreateMap<BillableItem, ListBillableItemViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Name))
                .ForMember(dest => dest.Unit, src => src.MapFrom(x => x.Unit.ToString()))
                .ForMember(dest => dest.Price, src => src.MapFrom(x => x.Price));

            CreateMap<Careplan, ListCarePlanViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Title))
                .ForMember(dest => dest.Status, src => src.MapFrom(x => x.Status.ToString()));

            CreateMap<Role, ListViewModel>()
                .ForMember(dest => dest.Text, src => src.MapFrom(x => x.Name));
        }
    }
}