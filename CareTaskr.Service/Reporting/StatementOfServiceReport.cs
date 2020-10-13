using System;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Reporting
{
    public class StatementOfServiceReport
    {
        public StatementOfServiceReport(TimeEntryBillableItem item)
        {
            //(start date of time entry DD-MM-YYYY)
            SupportsDeliveredFrom = item.TimeEntry.StartTime.HasValue
                ? item.TimeEntry.StartTime.Value.ToString("yyyy-MM-dd HH:mm")
                : "";

            //(end date of time entry DD-MM-YYYY)
            SupportsDeliveredTo = item.TimeEntry.EndTime.HasValue
                ? item.TimeEntry.EndTime.Value.ToString("yyyy-MM-dd HH:mm")
                : "";

            //(ndis support item number)
            SupportNumber = item.BillableItem.NDISNumber;

            //(number of units.E.g 2.5 = 2 and a half hours or 3 = 3 items)
            Quantity = item.Quantity.ToString();

            //(actual duration of service provided HHH:MM)
            Hours = TimeSpan.FromMinutes(item.TimeEntry.DurationInMinutes).ToString(@"hh\:mm");

            //(price per unit of the unit sold or hourly price 8 numeric and 2 decimal)
            UnitPrice = item.BillableItem.Price.ToString();

            //(p1, p2, p5)
            GSTCode = item.BillableItem.GSTCode.ToString();
        }

        //WIP
        //(Provider registration number taken from govt.This will be a field in the Provider Information)
        public string RegistrationNumber { get; } = string.Empty;

        //(start date of time entry DD-MM-YYYY)
        public string SupportsDeliveredFrom { get; }

        //(end date of time entry DD-MM-YYYY)
        public string SupportsDeliveredTo { get; }

        //(ndis support item number)
        public string SupportNumber { get; }

        //(this column should be blank and filled out manually by providers)
        public string ClaimReference { get; } = string.Empty;

        //(number of units.E.g 2.5 = 2 and a half hours or 3 = 3 items)
        public string Quantity { get; }

        //(actual duration of service provided HHH:MM)
        public string Hours { get; }

        //(price per unit of the unit sold or hourly price 8 numeric and 2 decimal)
        public string UnitPrice { get; }

        //(p1, p2, p5)
        public string GSTCode { get; }

        //(include this column but it will be manually filled out
        public string ClaimType { get; } = string.Empty;

        //(include this column but it will be manually filled out)t
        public string CancellationReason { get; } = string.Empty;
    }
}