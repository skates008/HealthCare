using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class ServiceAgreementRequestViewModel
    {
        public Guid? Id { get; set; }
        public Guid PatientId { get; set; }

        public string Title { get; set; }
        public string Notes { get; set; }
        public DateTime SignedDate { get; set; }
        public DateTime ValidFromDate { get; set; }
        public DateTime ValidToDate { get; set; }


        public List<FileUploadRequestViewModel> FilesToUpload { get; set; }
    }

    public class ServiceAgreementViewModel : ServiceAgreementRequestViewModel
    {
        public Guid Id { get; set; }

        public List<FileUploadViewModel> Files { get; set; }
    }

    public class ServiceAgreementMapper : Profile
    {
        public ServiceAgreementMapper()
        {
            CreateMap<ServiceAgreementRequestViewModel, ServiceAgreement>()
                .ForMember(x => x.Id, opt => opt.Ignore());


            CreateMap<ServiceAgreement, ServiceAgreementViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.Files, src => src.MapFrom(x => x.Files.Select(x => x.FileUpload)))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId));
        }
    }
}