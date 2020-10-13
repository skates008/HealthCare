using System.Linq;
using Caretaskr.Common.Dto;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Caretaskr.Common.Configuration
{
    public static class CustomHttpContext
    {
        private static IHttpContextAccessor _contextAccessor;

        public static HttpContext Current => _contextAccessor.HttpContext;


        public static string ClientIp
        {
            get
            {
                var ipAddress = Current?.Connection.RemoteIpAddress.ToString();

                return ipAddress;
            }
        }

        public static void Configure(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public static LoginInfo GetUserLoginInfo()
        {
            var loginInfo = GetClaimValue("logininfo");
            if (loginInfo == string.Empty)
                return null;
            var loginInfoVal = JsonConvert.DeserializeObject<LoginInfo>(loginInfo);
            return loginInfoVal;
        }

        private static string GetClaimValue(string claimType)
        {
            var userid = Current.User;
            return Current.User.Identity.IsAuthenticated
                ? Current.User.Claims.Single(c => c.Type == claimType).Value
                : string.Empty;
        }
    }
}