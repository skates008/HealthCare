using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Dto;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Service.Interface;
using Newtonsoft.Json;

namespace CareTaskr.Service.Infrastructure
{
    public class Tokens
    {
        public static async Task<SignInResponseViewModel> GenerateJwt(User user, ClaimsIdentity identity,
            IJwtFactory jwtFactory, JwtIssuerOptions jwtOptions, JsonSerializerSettings serializerSettings)
        {
            var loginInfoSerialized = identity.Claims.Single(c => c.Type == "logininfo").Value;
            var loginInfo = JsonConvert.DeserializeObject<LoginInfo>(loginInfoSerialized);

            try
            {
                var response = new SignInResponseViewModel
                {
                    UserName = user.UserName,
                    AccessToken = await jwtFactory.GenerateEncodedToken(user.UserName, loginInfo.Role,
                        user.TenantDataKey, user.PatientDataKey, identity),
                    ExpiresIn = (int) jwtOptions.ValidFor.TotalSeconds,
                    LoginInfo = loginInfo
                };

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}