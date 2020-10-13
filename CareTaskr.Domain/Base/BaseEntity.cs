using CareTaskr.Domain.Entities.Account;
using System;
using System.Collections.Generic;
using System.Text;

namespace CareTaskr.Domain.Base
{
    public class BaseEntity<TKey>
    {
        public virtual TKey Id { get; set; }

        public Guid? CreatedById { get; set; }
        public virtual User CreatedBy { get; set; }
        public Guid? ModifiedById { get; set; }
        public virtual User ModifiedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid PublicId { get; set; } = Guid.NewGuid();
    }
}
