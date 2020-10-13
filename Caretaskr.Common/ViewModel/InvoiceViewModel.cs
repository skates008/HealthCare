using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using AutoMapper;
using CareTaskr.Domain.Enum;

namespace Caretaskr.Common.ViewModel
{
    public class InvoiceCreateViewModel
    {
        public Guid? AppointmentId { get; set; }
        public Guid? TimeEntryId { get; set; }
        public Guid? InvoiceRunId { get; set; }
    }


    public class InvoiceListViewModel
    {
        public Guid Id { get; set; }
        public Guid PatientRecordId { get; set; }

        public string Type { get; set; }
        public InvoiceTriggerType TriggerType { get; set; }

        public string TriggeredById { get; set; }
        public string TriggeredByName { get; set; }

        public string BilledTo { get; set; }

        public DateTime Date { get; set; }
        public string Reference { get; set; }
        public DateTime DueDate { get; set; }

        public string CustomerReference { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerNDISReference { get; set; }

        [Column(TypeName = "decimal(7,2)")] public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(7,2)")] public decimal SubTotalGST { get; set; }

        [Column(TypeName = "decimal(7,2)")] public decimal Total { get; set; }

        public FileUploadViewModel File { get; set; }

    }


    public class InvoiceViewModel : InvoiceListViewModel
    {
        public Guid CarePlanId { get; set; }
        public string CarePlanName { get; set; }

        public virtual List<InvoiceItemViewModel> InvoiceItems { get; set; } = new List<InvoiceItemViewModel>();
    }


    public class InvoiceItemViewModel
    {
        public string RegisteredByName { get; set; }
        public Guid RegisteredById { get; set; }
        public string CustomerName { get; set; }
        public string Reference { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Quantity { get; set; }
        public string Unit { get; set; }
        public string GSTCode { get; set; }
        public double GSTRate { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GSTTotal { get; set; }
        public decimal Total { get; set; }
    }


    public class InvoiceMapper : Profile
    {
        public InvoiceMapper()
        {
            CreateMap<InvoiceItem, BillableItemReportViewModel>()
                .ForMember(dest => dest.ServiceDate, src => src.MapFrom(x => x.Date))
                .ForMember(dest => dest.Name, src => src.MapFrom(x => x.Subject))
                .ForMember(dest => dest.Price, src => src.MapFrom(x => x.UnitCost))
                .ForMember(dest => dest.Quantity, src => src.MapFrom(x => x.Units))
                .ForMember(dest => dest.TotalCost, src => src.MapFrom(x => x.Cost));


            CreateMap<Invoice, InvoiceListViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientRecordId, src => src.MapFrom(x => x.Careplan.PatientRecord.PublicId))
                .ForMember(dest => dest.TriggeredById, src => src.MapFrom(x => x.CreatedById))
                .ForMember(dest => dest.TriggeredByName,
                    src => src.MapFrom(x => x.CreatedBy == null ? string.Empty : x.CreatedBy.FullName))
                .ForMember(dest => dest.Type, src => src.MapFrom(x => x.Type.GetDescription()))
                .ForMember(dest => dest.File, src => src.MapFrom(x => x.File.FileUpload));



            CreateMap<Invoice, InvoiceViewModel>()
                .ForMember(dest => dest.Id, src => src.MapFrom(x => x.PublicId))
                .ForMember(dest => dest.PatientRecordId, src => src.MapFrom(x => x.Careplan.PatientRecord.PublicId))
                .ForMember(dest => dest.CarePlanId, src => src.MapFrom(x => x.Careplan.PublicId))
                .ForMember(dest => dest.CarePlanName, src => src.MapFrom(x => x.Careplan.Title))
                .ForMember(dest => dest.TriggeredById, src => src.MapFrom(x => x.CreatedById))
                .ForMember(dest => dest.TriggeredByName,
                    src => src.MapFrom(x => x.CreatedBy == null ? string.Empty : x.CreatedBy.FullName))
                .ForMember(dest => dest.Type, src => src.MapFrom(x => x.Type.GetDescription()))
                .ForMember(dest => dest.File, src => src.MapFrom(x => x.File.FileUpload));



            CreateMap<InvoiceItem, InvoiceItemViewModel>()
                .ForMember(dest => dest.Quantity, src => src.MapFrom(x => x.QuantityAsString()))
                .ForMember(dest => dest.GSTRate, src => src.MapFrom(x => x.GSTRate * 100));
        }
    }
}