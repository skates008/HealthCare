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
    public class BillableItem : BaseEntity<int>, ITenantData
    {

        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }
        public bool IsBillable { get; set; } = true;
        public string Name{ get; set; }
        public double Price { get; set; }
        public string NDISNumber { get; set; }

        public BillableItemUnit Unit{ get; set; }
        public BillableIteGSTCode GSTCode{ get; set; }
        public string Description{ get; set; }

       public virtual ICollection<BillableItemPrice> PriceLst { get; set; }

        public string TenantDataKey { get; set; }
        
        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }

        public BillableItemPrice GetPrice(DateTime date) {
            var billableItemPrice = PriceLst.FirstOrDefault(x => x.ValidFrom <= date && x.ValidTo >= date);
           
            //-----temporary hack until we are able to set different prices per billable item
            if (billableItemPrice == null) {
                billableItemPrice = new BillableItemPrice()
                {
                    Price = (decimal)this.Price,
                    GST = GSTCode
                };
            }
            //-----
            return billableItemPrice;
        }

    }

    public class BillableItemPrice : BaseEntity<int>, ITenantData
    {
        public int  BillableItemId { get; set; }
        public virtual BillableItem BillableItem { get; set; }

        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }

        [Column(TypeName = "decimal(7,2)")]
        public decimal Price{ get; set; }
        public BillableIteGSTCode GST{ get; set; }
        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = BillableItem.Provider.GetDataKey();
        }

    }

}
