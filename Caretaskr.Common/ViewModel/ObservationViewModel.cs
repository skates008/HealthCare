using System;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class SavePatientObservationViewModel
    {
        public Guid PatientId { get; set; }
        public string Observation { get; set; }
    }

    public class PatientObservationViewModel
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public Guid PatientId { get; set; }
        public string Observation { get; set; }
    }

    public class PatientObservationListViewModel
    {
        public DateTime? AppointmentDate { get; set; }
        public string Observation { get; set; }
        public string Practitioner { get; set; }
    }


    public class ObservationMapper : Profile
    {
        public ObservationMapper()
        {
            CreateMap<Observation, PatientObservationViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientId, src => src.MapFrom(x => x.PatientRecord.Patient.PublicId));
        }
    }
}