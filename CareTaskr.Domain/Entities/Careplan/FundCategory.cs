using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using System;

namespace CareTaskr.Domain.Entities
{
    public class FundCategory : BaseEntity<int>
    {
        
        public string Name { get; set; }
     


    }
}
