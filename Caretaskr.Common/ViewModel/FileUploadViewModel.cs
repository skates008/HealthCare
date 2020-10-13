using System;
using AutoMapper;
using CareTaskr.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Caretaskr.Common.ViewModel
{
    public class FileUploadRequestViewModel
    {
        public string MimeType { get; set; }
        public string Filename { get; set; }
        public string Title { get; set; }

        public IFormFile File { get; set; }
    }

    public class FileUploadViewModel : FileUploadRequestViewModel
    {
        public Guid Id { get; set; }
        public string CreatedById { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedByName { get; set; }
        public string Url { get; set; }
        public string ThumbnailUrl { get; set; }
    }

    public class FileUploadMapper : Profile
    {
        public FileUploadMapper()
        {
            CreateMap<FileUpload, FileUploadViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.CreatedByName, src => src.MapFrom(x => x.CreatedBy.FullName))
                .ForMember(dest => dest.Filename, src => src.MapFrom(x => x.OriginalFilename));

        }
    }
}