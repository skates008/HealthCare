using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using System;

namespace CareTaskr.Domain.Entities
{
    public class MyTask : BaseEntity<int>
    {
        public Guid UserId { get; set; }
        public virtual User User { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }

    }
}
