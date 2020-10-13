using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class AssesmentRequestViewModel
    {
        public Guid? Id { get; set; }
        public Guid PatientId { get; set; }
        public string Title { get; set; }
        public string Notes { get; set; }

        public DateTime AssessmentDate { get; set; }
        public DateTime ValidFromDate { get; set; }
        public DateTime ValidToDate { get; set; }

        //storing as string, as most usually the assessor is external to the provider (phont number, address, email can be added to notes)
        public string Assessor { get; set; }

        public List<FileUploadRequestViewModel> FilesToUpload { get; set; }
    }

    public class AssesmentViewModel : AssesmentRequestViewModel
    {
        public List<FileUploadViewModel> Files { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid CreatedById { get; set; }

        public String CreatedBy { get; set; }


    }

    public class AssesmentMapper : Profile
    {
        public AssesmentMapper()
        {
            CreateMap<AssesmentRequestViewModel, Assesment>()
                .ForMember(x => x.Id, opt => opt.Ignore());

            CreateMap<Assesment, AssesmentViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Files, src => src.MapFrom(x => x.Files.Select(x => x.FileUpload)))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.CreatedBy, src => src.MapFrom(x => x.CreatedBy.FullName));

        }
    }
}