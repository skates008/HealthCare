using Caretaskr.Common.ViewModel;
using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace CareTaskr.Domain.Entities
{
    public class TimeEntry : BaseEntity<int>, ITenantData
    {
        public string Name { get; set; }

        public virtual ICollection<TimeEntryBillableItem> BillableItems { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int DurationInMinutes { get; set; }

        //We don't need this. can be deleted
        public virtual ICollection<TimeEntryUser> Atendees { get; set; }

        public int? AppointmentId { get; set; }
        public virtual Appointment Appointment { get; set; }


        public int CarePlanId { get; set; }
        public virtual Careplan Careplan { get; set; }



        public DateTime? GetDate() {
            return BillableItems.OrderBy(x => x.StartTime).FirstOrDefault().StartTime;
        }

        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = CreatedBy.DefaultProvider().GetDataKey();
        }

        public virtual List<TimeEntryBillableItem> TimeEntryBillableItems { get; set; }
    }

    public class TimeEntryBillableItem : BaseEntity<int>
    {
        public int TimeEntryId { get; set; }
        public virtual TimeEntry TimeEntry { get; set; }

        public int BillableItemId { get; set; }
        public virtual BillableItem BillableItem { get; set; }


        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        //public int DurationInMinutes { get; set; }

        public double Quantity { get; set; } = 0;


        public string GetGSTCode() {
           return FindPrice().GST.ToString();
        }

        public double GetGSTRate()
        {
             switch (FindPrice().GST) {
                case BillableIteGSTCode.P1: return 0.1;
                case BillableIteGSTCode.P2: 
                case BillableIteGSTCode.P5: return 0;
            }
            return 0;
        }
        public decimal GetGSTTotal()
        {
            return GetSubTotal() * (decimal)GetGSTRate();
        }

        public decimal GetSubTotal()
        {
            switch (BillableItem.Unit)
            {
                case BillableItemUnit.Hour:
            //    case BillableItemUnit.Minutes: //remove support to minutes
                    //convert duration to hours
                    return (decimal)(Quantity / 60.0) * FindPrice().Price;
                case BillableItemUnit.Each:
                    return FindPrice().Price * (Decimal)Quantity;
            }
            return 0;
        }

        public decimal GetTotal()
        {
            return GetGSTTotal() + GetSubTotal();
        }




        [Column(TypeName = "decimal(10,2)")]
        public decimal Cost { get; set; } = 0;

        public virtual InvoiceItem InvoiceItem {get;set;}


        [NotMapped]
        private BillableItemPrice Price;

        public BillableItemPrice FindPrice() {
            if (Price == null) {
                Price = BillableItem.GetPrice(StartTime);
            }
            return Price;
        }

        public void SetCost() {
            switch (BillableItem.Unit) {
                case BillableItemUnit.Hour:
                    //convert duration to hours
                    var x = (double)Quantity / 60.0 * BillableItem.Price;
                    Cost = (Decimal)x;
                    break;
                case BillableItemUnit.Each:
                //case BillableItemUnit.Minutes:
                    Cost = (Decimal)BillableItem.Price * (Decimal)Quantity;
                    break;
            }
        }


    }


    //We don't need this. can be deleted
    public class TimeEntryUser
    { 
        public int TimeEntryId { get; set; }
        public virtual TimeEntry TimeEntry { get; set; }

        public Guid UserId { get; set; }
        public virtual User User { get; set; }
    }

}
