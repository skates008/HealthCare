using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace CareTaskr.Domain.DataAuthorization
{
    public class GetClaimsProvider : IGetClaimsProvider
    {
        public const string TenantKeyClaimName = "TenantDataKey";
        public const string PatientClaimName = "PatientDataKey";


        public List<string> TenantKey { get; set; } = new List<string>();
        public List<string> PatientKey { get; set; } = new List<string>();

        public GetClaimsProvider() { }

        public GetClaimsProvider(IHttpContextAccessor accessor)
        {
            var tenKey= accessor.HttpContext?.User.Claims.SingleOrDefault(x => x.Type == TenantKeyClaimName)?.Value;
            var patKey = accessor.HttpContext?.User.Claims.SingleOrDefault(x => x.Type == PatientClaimName)?.Value;

            if (!string.IsNullOrEmpty(tenKey))
                TenantKey = tenKey.Split(',').ToList<string>();

            if (!string.IsNullOrEmpty(patKey)) 
                PatientKey = patKey.Split(',').ToList<string>();


        }
    }
}
