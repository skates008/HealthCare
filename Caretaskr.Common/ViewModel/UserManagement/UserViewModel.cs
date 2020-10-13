using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;

namespace Caretaskr.Common.ViewModel
{
    public class UserRequestViewModel
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Occupation { get; set; }
        public string CompanyName { get; set; }
        public Guid RoleId { get; set; }

        public AddressViewModel Address { get; set; } = new AddressViewModel();


        public List<UserTeamViewModel> Teams { get; set; } = new List<UserTeamViewModel>();
    }


    public class UserViewModel : UserRequestViewModel
    {
        public Guid Id { get; set; }
    }

    public class UserTeamViewModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
    }


    public class UserListViewModel
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string UserType { get; set; }
        public DateTime? CreatedDate { get; set; }
    }


    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<UserRequestViewModel, User>()
                .ForMember(dest => dest.UserName, src => src.MapFrom(x => x.Email))
                .ForMember(dest => dest.NormalizedEmail, src => src.MapFrom(x => x.Email.ToUpper()))
                .ForMember(dest => dest.NormalizedUserName, src => src.MapFrom(x => x.Email.ToUpper()))
                .ForMember(dest => dest.FullName, src => src.MapFrom(x => string.Join(" ", x.FirstName, x.LastName)))
                .ForMember(dest => dest.Teams, opt => opt.Ignore());


            CreateMap<UserViewModel, User>()
                .ForMember(dest => dest.UserName, src => src.MapFrom(x => x.Email))
                .ForMember(dest => dest.NormalizedEmail, src => src.MapFrom(x => x.Email.ToUpper()))
                .ForMember(dest => dest.NormalizedUserName, src => src.MapFrom(x => x.Email.ToUpper()))
                .ForMember(dest => dest.FullName, src => src.MapFrom(x => string.Join(" ", x.FirstName, x.LastName)))
                .ForMember(dest => dest.Teams, opt => opt.Ignore());

            CreateMap<User, UserViewModel>()
                .ForMember(dest => dest.Teams, src => src.MapFrom(x => x.Teams.Select(x => x.Team)));

            CreateMap<User, UserListViewModel>()
                .ForMember(dest => dest.Role, src => src.MapFrom(x => x.UserRoles.FirstOrDefault().Role));

            CreateMap<Team, UserTeamViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));
        }
    }
}