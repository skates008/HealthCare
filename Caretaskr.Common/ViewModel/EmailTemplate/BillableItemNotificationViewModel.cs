using System.Collections.Generic;

namespace Caretaskr.Common.ViewModel
{
    public class BillableItemNotificationViewModel
    {
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public List<BillableItemReportViewModel> BillableItem { get; set; }
    }


    public class BillableItemReportViewModel
    {
        public string ServiceDate { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string Unit { get; set; }
        public string Quantity { get; set; }
        public string TotalCost { get; set; }
    }
}