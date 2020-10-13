using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class NoteRequestViewModel
    {
        public Guid? Id { get; set; }
        public Guid PatientId { get; set; }
        public Guid? CareplanId { get; set; }
        public Guid? AppointmentId { get; set; }
        public NoteType Type { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public List<string> FileTitles { get; set; }
        public List<FileUploadRequestViewModel> FilesToUpload { get; set; }
    }

    public class NoteViewModel : NoteRequestViewModel
    {
        public Guid CreatedByUserId { get; set; }
        public string CreatedByUserName { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<FileUploadViewModel> Files { get; set; }
    }

    public class NoteMapper : Profile
    {
        public NoteMapper()
        {
            CreateMap<NoteRequestViewModel, Note>()
                .ForMember(x => x.Id, opt => opt.Ignore());

            CreateMap<Note, NoteViewModel>()
                .ForAllMembers(opt => opt.Condition(src => src != null));

            CreateMap<Note, NoteViewModel>()
                .ForMember(dest => dest.FilesToUpload, opt => opt.Ignore())
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.AppointmentId, src => src.MapFrom(x => x.Appointment.PublicId))
                .ForMember(dest => dest.CareplanId, src => src.MapFrom(x => x.Careplan.PublicId))
                .ForMember(dest => dest.CreatedByUserId, src => src.MapFrom(x => x.CreatedById))
                .ForMember(dest => dest.CreatedByUserName, src => src.MapFrom(x => x.CreatedBy.FullName))
                .ForMember(dest => dest.Files, src => src.MapFrom(x => x.Files.Select(x => x.FileUpload).ToList()
                ))
                ;
        }
    }
}