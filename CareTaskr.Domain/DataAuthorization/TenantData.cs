using CareTaskr.Domain.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caretaskr.Data.DataAuthorization
{
    public class TenantData<T> : BaseEntity<T>, ITenantData
    {
        //This holds the UserId of the person who created it
        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            throw new NotImplementedException();
        }
    }
}
