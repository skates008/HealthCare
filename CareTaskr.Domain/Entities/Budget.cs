using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareTaskr.Domain.Entities
{
    public class Budget : BaseEntity<int>
    {
        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }


        public string BudgetName { get; set; }
        public SourceOfBudget SourceOfBudget { get; set; }
        
        [Column(TypeName = "decimal(7,2)")]
        public decimal TotalBudget { get; set; }
        
        [Column(TypeName = "decimal(7,2)")]
        public decimal RemainingBudget { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

    }
}
