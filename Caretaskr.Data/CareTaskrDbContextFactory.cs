using CareTaskr.Domain.DataAuthorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Caretaskr.Data
{
    public class CareTaskrDbContextFactory : DesignTimeDbContextFactoryBase<ApplicationContext>
    {
        protected override ApplicationContext CreateNewInstance(DbContextOptions<ApplicationContext> options,
            IGetClaimsProvider userData, IConfiguration configuration)
        {
            return new ApplicationContext(options, userData, configuration);
        }

        protected override ApplicationContext CreateNewInstance(DbContextOptions<ApplicationContext> options,
            IGetClaimsProvider userData)
        {
            return new ApplicationContext(options, userData);
        }
    }
}