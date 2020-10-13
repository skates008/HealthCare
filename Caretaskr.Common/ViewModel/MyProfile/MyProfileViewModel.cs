using AutoMapper;
using CareTaskr.Domain.Entities.Account;

namespace Caretaskr.Common.ViewModel
{
    public class MyProfileDetailsViewModel
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Position { get; set; }
        public string ProfileImage { get; set; }
    }

    public class MyProfileBasicDetailsViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Position { get; set; }
    }

    public class MyProfileMapper : Profile
    {
        public MyProfileMapper()
        {
            CreateMap<MyProfileBasicDetailsViewModel, User>()
                .ForMember(dest => dest.FullName, src => src.MapFrom(x => string.Join(" ", x.FirstName, x.LastName)));


            CreateMap<User, MyProfileDetailsViewModel>();
        }
    }
}