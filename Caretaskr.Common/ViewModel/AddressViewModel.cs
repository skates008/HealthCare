using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class AddressRequestViewModel
    {
        public string Address { get; set; }
        public string StreetName { get; set; }
        public string StreetNumber { get; set; }
        public string Unit { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Observations { get; set; }
        public string AddressType { get; set; }
    }

    public class AddressViewModel : AddressRequestViewModel
    {
    }


    public class AddressMapper : Profile
    {
        public AddressMapper()
        {
            CreateMap<AddressRequestViewModel, Address>();
            CreateMap<AddressViewModel, Address>()
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.Address));
            CreateMap<Address, AddressViewModel>()
                .ForMember(dest => dest.Address, src => src.MapFrom(x => x.Name));
        }
    }
}