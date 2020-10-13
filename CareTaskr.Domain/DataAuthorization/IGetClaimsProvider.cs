using System;
using System.Collections.Generic;
using System.Text;

namespace CareTaskr.Domain.DataAuthorization
{

        public interface IGetClaimsProvider
        {
            List<string> TenantKey { get; }
            List<string> PatientKey { get; }


    }
}
