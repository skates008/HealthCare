//DELETE after validation
/*
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CareTaskr.Service.Reporting
{
    class InvoiceBuilder
    {

        public static Invoice GetInvoice(PatientRecord patientRecord, List<TimeEntryBillableItem> timeEntryBillableItems) {
            

            var invoice = new Invoice() {
                Provider = patientRecord.Provider, 
                PatientName = patientRecord.Patient.PreferredName
            };

            //FORCE SET COST - this should be stored to the database on creation
            timeEntryBillableItems.ForEach(x => x.SetCost());

            foreach (var timeEntryBillableItem in timeEntryBillableItems)
            {
                InvoiceItem item = new InvoiceItem()
                {
                    Subject = timeEntryBillableItem.BillableItem.Name,
                    Date = DateTime.MinValue, //timeEntryBillableItem.TimeEntry.StartTime.HasValue ?timeEntryBillableItem.TimeEntry.StartTime.Value.ToString("dd-MM-yyyy"):"",
                    Unit = timeEntryBillableItem.BillableItem.Unit.ToString("F"),
                    UnitCost = String.Format("{0:C}", timeEntryBillableItem.BillableItem.Price),
                    Units = timeEntryBillableItem.Quantity.ToString(),
                    Cost = String.Format("{0:C}", timeEntryBillableItem.Cost)
                };
                invoice.Items.Add(item);
            }

            if (timeEntryBillableItems.Count > 0) {
                invoice.Summary.TotalCost = String.Format("{0:C}", timeEntryBillableItems.Select(x => x.Cost).Sum()); 
                invoice.Details = timeEntryBillableItems.First().TimeEntry.Careplan.Title;
                invoice.Summary.PeriodStart = timeEntryBillableItems.First().TimeEntry.StartTime.HasValue? timeEntryBillableItems.First().TimeEntry.StartTime.Value.ToString("dd-MM-yyyy"): "";
                invoice.Summary.PeriodEnd = timeEntryBillableItems.First().TimeEntry.EndTime.HasValue ? timeEntryBillableItems.First().TimeEntry.EndTime.Value.ToString("dd-MM-yyyy"): "";
            }

            invoice.Summary.DateOfStatement = GeneralService.CurrentDate.ToString("dd-MM-yyyy");
            return invoice;
        }
    }
}
*/

