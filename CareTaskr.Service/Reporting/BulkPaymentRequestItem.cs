using Caretaskr.Common.ViewModel;

namespace CareTaskr.Service.Reporting
{
    public class BulkPaymentRequestItem
    {
        public BulkPaymentRequestItem()
        {
        }

        public BulkPaymentRequestItem(InvoiceItem item)
        {
            //(patient’s ndis number)
            NDISNumber = item.Invoice.CustomerNDISReference;

            //(start date of time entry DD-MM-YYYY)
            SupportsDeliveredFrom = item.Date.ToString("yyyy-MM-dd HH:mm");

            //(end date of time entry DD-MM-YYYY)
            SupportsDeliveredTo =
                "TODO"; // item.TimeEntry.EndTime.HasValue ? item.TimeEntry.EndTime.Value.ToString("yyyy-MM-dd HH:mm"):"";

            //(ndis support item number)
            SupportNumber = item.Invoice.Careplan.ServiceBookingReference;

            //(number of units.E.g 2.5 = 2 and a half hours or 3 = 3 items)
            Quantity = item.Quantity.ToString();

            //(actual duration of service provided HHH:MM)
            Hours = "TODO"; // TimeSpan.FromMinutes(item.TimeEntry.DurationInMinutes).ToString(@"hh\:mm");

            //(price per unit of the unit sold or hourly price 8 numeric and 2 decimal)
            UnitPrice = item.UnitPrice.ToString();

            //(p1, p2, p5)
            GSTCode = item.GSTCode;
        }

        //(Provider registration number taken from govt.This will be a field in the Provider Information)
        public string RegistrationNumber { get; } = string.Empty;

        //(patient’s ndis number)
        public string NDISNumber { get; }

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

        //(include this column but it will be manually filled out)
        public string ClaimType { get; } = string.Empty;

        //(include this column but it will be manually filled out)
        public string CancellationReason { get; } = string.Empty;
    }
}