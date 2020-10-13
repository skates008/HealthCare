using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using CareTaskr.Domain.Entities;

namespace Caretaskr.Common.ViewModel
{
    public class TimeEntryRequestViewModel
    {
        public Guid CareplanId { get; set; }
        public Guid AppointmentId { get; set; }
        public string Name { get; set; }

        public ICollection<TimeEntryBillableItemRequestViewModel> BillableItems { get; set; }
    }

    public class TimeEntryBillableItemRequestViewModel
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public decimal Quantity { get; set; }
    }


    public class TimeEntryViewModel
    {
        public Guid Id { get; set; }
        public Guid CareplanId { get; set; }
        public Guid AppointmentId { get; set; }

        public Guid CreatedByUserId { get; set; }
        public string CreatedByUserName { get; set; }
        public string Name { get; set; }

        public ICollection<TimeEntryBillableItemViewModel> BillableItems { get; set; }

        //additional information
        public string CarePlanName { get; set; }
        public string PatientName { get; set; }
        public string PatientEmail { get; set; }
        public string ParticipantId { get; set; }

        public InvoiceListViewModel Invoice { get; set; }

        public decimal? TotalCost { get; set; }

        public DateTime? Date { get; set; }
    }

    public class TimeEntryBillableItemViewModel
    {
        public BillableItemViewModel BillableItem { get; set; }
        public DateTime StartTime { get; set; }
        public decimal Quantity { get; set; }
        public decimal Cost { get; set; }
        public Guid Id { get; set; }
    }

    public class TimeEntryMapper : Profile
    {
        public TimeEntryMapper()
        {
            CreateMap<TimeEntryBillableItem, TimeEntryBillableItemViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId));

            CreateMap<TimeEntryBillableItem, BillableItemReportViewModel>()
                .ForMember(dest => dest.ServiceDate,
                    src => src.MapFrom(x =>
                        x.TimeEntry.StartTime.HasValue ? x.TimeEntry.StartTime.Value.ToString("dd/MM/yyyy") : ""))
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.BillableItem.Name))
                .ForMember(dest => dest.TotalCost, src => src.MapFrom(x => x.Cost))
                .ForMember(dest => dest.Price, src => src.MapFrom(x => x.BillableItem.Price))
                .ForMember(dest => dest.Unit, src => src.MapFrom(x => x.BillableItem.Unit))
                .ForMember(dest => dest.Quantity, src => src.MapFrom(x => x.Quantity));


            CreateMap<TimeEntry, TimeEntryViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.CareplanId, src => src.MapFrom(x => x.Careplan.PublicId))
                .ForMember(dest => dest.AppointmentId, src => src.MapFrom(x => x.Appointment.PublicId))
                .ForMember(dest => dest.CarePlanName, src => src.MapFrom(x => x.Careplan.Title))
                .ForMember(dest => dest.PatientName,
                    src => src.MapFrom(x => x.Careplan.PatientRecord.Patient.User.FullName))
                .ForMember(dest => dest.PatientEmail,
                    src => src.MapFrom(x => x.Careplan.PatientRecord.Patient.User.Email))
                .ForMember(dest => dest.ParticipantId,
                    src => src.MapFrom(x => x.Careplan.PatientRecord.Patient.PublicId))
                .ForMember(dest => dest.CreatedByUserId, src => src.MapFrom(x => x.CreatedById))
                .ForMember(dest => dest.CreatedByUserName, src => src.MapFrom(x => x.CreatedBy.FullName))
                .ForMember(dest => dest.Date, src => src.MapFrom(x => x.GetDate()))
                .ForMember(dest => dest.TotalCost,
                    src => src.MapFrom(x => x.TimeEntryBillableItems.Where(t=>t.BillableItem.IsBillable).Sum(t => t.GetTotal())));
        }
    }
}