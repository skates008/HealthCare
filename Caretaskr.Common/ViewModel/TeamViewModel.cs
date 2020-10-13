using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;

namespace Caretaskr.Common.ViewModel
{
    public class TeamRequestViewModel
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
    }

    public class TeamUserRequestViewModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
    }

    public class TeamViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public List<TeamUserRequestViewModel> Users { get; set; }
    }

    public class TeamMapper : Profile
    {
        public TeamMapper()
        {
            CreateMap<Team, TeamViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Users, src => src.Ignore())
                .ForMember(dest => dest.Users, src => src.MapFrom(x => x.Users.Select(x => x.User)));

            CreateMap<User, TeamUserRequestViewModel>()
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.FullName));
        }
    }
}