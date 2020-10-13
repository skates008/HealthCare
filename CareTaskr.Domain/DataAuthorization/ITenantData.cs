using System;
using System.Collections.Generic;
using System.Text;

namespace Caretaskr.Data.DataAuthorization
{
    public interface ITenantData
    {
        public string TenantDataKey { get; set; }
        public void SetTenantDataKey();


    }
}
