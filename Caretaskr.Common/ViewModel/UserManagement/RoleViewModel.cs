using System;
using System.Collections.Generic;
using AutoMapper;
using CareTaskr.Domain.Entities.Account;

namespace Caretaskr.Common.ViewModel
{
    public class RoleRegisterRequestViewModel
    {
        public RoleRegisterRequestViewModel()
        {
            TaskAction = new List<TaskActionViewModel>();
        }

        public string Name { get; set; }

        public List<TaskActionViewModel> TaskAction { get; set; }
    }


    public class UpdateRoleRequestViewModel
    {
        public UpdateRoleRequestViewModel()
        {
            TaskAction = new List<TaskActionViewModel>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }

        public List<TaskActionViewModel> TaskAction { get; set; }
    }


    public class RoleResponseViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<ModuleViewModel> Modules { get; set; }
    }

    public class RoleListViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string SystemDefined { get; set; }
    }

    public class ModuleViewModel
    {
        public string ModuleName { get; set; }
        public List<TaskActionViewModel> TaskAction { get; set; }
    }


    public class RoleMapper : Profile
    {
        public RoleMapper()
        {
            CreateMap<Role, RoleResponseViewModel>();

            CreateMap<Role, RoleListViewModel>();
        }
    }
}