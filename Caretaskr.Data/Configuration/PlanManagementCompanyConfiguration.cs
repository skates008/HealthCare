using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class PlanManagementCompanyConfiguration : IEntityTypeConfiguration<PlanManagementCompany>
    {
        public void Configure(EntityTypeBuilder<PlanManagementCompany> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Provider)
                .WithMany()
                .HasForeignKey(e => e.ProviderId);
        }
    }
}