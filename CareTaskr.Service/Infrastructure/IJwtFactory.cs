using System.Security.Claims;
using System.Threading.Tasks;
using Caretaskr.Common.Dto;

namespace CareTaskr.Service.Interface
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string userName, string role, string tenantDataKey, string patientDataKey,
            ClaimsIdentity identity);

        ClaimsIdentity GenerateClaimsIdentity(string userName, LoginInfo loginInfo);
    }
}