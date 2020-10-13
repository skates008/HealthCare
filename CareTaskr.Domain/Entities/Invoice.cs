using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Caretaskr.Common.ViewModel
{
    public class Invoice : BaseEntity<int>, ITenantData
    {
        public int? BillingRunId { get; set; }
        public virtual BillingRun BillingRun { get; set; }

        public BillingType Type { get; set; }
        public InvoiceTriggerType TriggerType { get; set; }
        
        public int CarePlanId { get; set; }
        public virtual Careplan Careplan { get; set; }


        public DateTime Date { get; set; }
        public string Reference { get; set; }
        public DateTime DueDate { get; set; }
        public int PaymentDueInDays { get; set; }


        public string CustomerReference { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerNDISReference { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal SubTotal { get; set; } = 0; 
        [Column(TypeName = "decimal(7,2)")]
        public decimal SubTotalGST { get; set; } = 0;
        [Column(TypeName = "decimal(7,2)")]
        public decimal Total { get; set; } = 0;

        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }

        public virtual List<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();

        public int? FileId { get; set; }
        public virtual PatientRecordFile File { get; set; }

        public string DownloadPdfUrl { get; set; }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }

        public Invoice() { }
        public Invoice(PatientRecord patientRecord, Careplan careplan, string reference = null) {
            Provider = patientRecord.Provider;

            //set customer Data
            CustomerName = $"{patientRecord.Patient.FirstName} {patientRecord.Patient.LastName}";
            CustomerNDISReference = patientRecord.Patient.NDISNumber;
            CustomerAddress = patientRecord.BillingDetails?.Address?.ToString();
            CustomerReference = patientRecord.BillingDetails?.AccountNumber;

            Careplan = careplan;
            Type = careplan.BillingType;

            CreatedDate = DateTime.Now;
            Date = CreatedDate;
            PaymentDueInDays = Provider.BillingSettings.PaymentDueInDays;
            DueDate = CreatedDate.AddDays(PaymentDueInDays);
        }

        public void AddItems(TimeEntryBillableItem timeEntryBillableItem, bool isBillable)
        {
            AddItems((new List<TimeEntryBillableItem>() { timeEntryBillableItem }), isBillable);
        }
        public void AddItems(List<TimeEntryBillableItem> timeEntryBillableItemLst, bool isBillable) {

            List<Appointment> appointments = new List<Appointment>();

            if (timeEntryBillableItemLst != null) {
                foreach (TimeEntryBillableItem tebi in timeEntryBillableItemLst) {
                    if (tebi != null) {
                        var invoiceItem = new InvoiceItem(this, tebi, isBillable);
                        InvoiceItems.Add(invoiceItem);
                        
                        //Update Totals
                        Total += invoiceItem.Total;
                        SubTotal += invoiceItem.SubTotal;
                        SubTotalGST += invoiceItem.GSTTotal;
                    }
                }
            }
        }

    }

    public class InvoiceItem : BaseEntity<int>, ITenantData
    {
        public int InvoiceId { get; set; }
        public virtual Invoice Invoice { get; set; }

        public int TimeEntryBillableItemId { get; set; }
        public virtual TimeEntryBillableItem TimeEntryBillableItem { get; set; }

        public int? AppointmentId { get; set; }
        public virtual Appointment? Appointment { get; set; }


        public string RegisteredByName { get; set; }
        public Guid RegisteredById { get; set; }

        public String  CustomerName { get; set; }



        public string Reference { get; set; }
        public string Description { get; set; }

        public DateTime Date { get; set; }
        public double Quantity { get; set; }
        public string Unit { get; set; }
        public string GSTCode { get; set; }

        public double GSTRate { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal UnitPrice { get; set; }
        [Column(TypeName = "decimal(7,2)")]
        public decimal SubTotal { get; set; }
        [Column(TypeName = "decimal(7,2)")]
        public decimal GSTTotal { get; set; }
        [Column(TypeName = "decimal(7,2)")]
        public decimal Total { get; set; }


        //---------------------
        [NotMapped]
        public string Subject { get; set; }
        [NotMapped]
        public string UnitCost { get; set; }
        [NotMapped]
        public string Units { get; set; }
        [NotMapped] 
        public string Cost { get; set; }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Invoice.Provider.GetDataKey();
        }

        public InvoiceItem() { }
        public InvoiceItem(Invoice invoice, TimeEntryBillableItem timeEntryBillableItem, bool isBillable) {
            Invoice = invoice;
            TimeEntryBillableItem = timeEntryBillableItem;
            Appointment = timeEntryBillableItem.TimeEntry.Appointment;
            CustomerName = invoice.CustomerName;
            Reference = timeEntryBillableItem.BillableItem.NDISNumber;
            Description = TimeEntryBillableItem.BillableItem.Description;

            RegisteredById = (Guid)TimeEntryBillableItem.CreatedById;
            RegisteredByName = TimeEntryBillableItem.CreatedBy?.FullName;

            Date = timeEntryBillableItem.StartTime;
            Quantity = timeEntryBillableItem.Quantity;
            Unit = timeEntryBillableItem.BillableItem.Unit.ToString();
            UnitPrice = timeEntryBillableItem.FindPrice().Price;
            GSTRate = timeEntryBillableItem.GetGSTRate();
            GSTCode = timeEntryBillableItem.GetGSTCode();
            if (isBillable)
            {
                GSTTotal = timeEntryBillableItem.GetGSTTotal();
                SubTotal = timeEntryBillableItem.GetSubTotal();
                Total = timeEntryBillableItem.GetTotal();
            }
            else {
                GSTTotal = SubTotal = Total = 0;
            }

        }


        public string QuantityAsString()
        {
            switch (TimeEntryBillableItem.BillableItem.Unit)
            {
                case BillableItemUnit.Hour:
                    return TimeSpan.FromMinutes(Quantity).ToString(@"hh\:mm");
                default:
                    return Quantity.ToString();
            }
        }
    }



}
