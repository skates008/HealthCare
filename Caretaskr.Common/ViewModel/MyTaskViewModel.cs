using System;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class CreateMyTaskViewModel
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public DateTime DueDate { get; set; }
    }

    public class UpdateMyTaskViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public DateTime DueDate { get; set; }
    }

    public class MyTaskResponseViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
    }

    public class MyTaskListViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
    }


    public class TaskMapper : Profile
    {
        public TaskMapper()
        {
            CreateMap<MyTask, MyTaskListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));
        }
    }
}