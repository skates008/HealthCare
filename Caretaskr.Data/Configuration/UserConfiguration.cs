using CareTaskr.Domain.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(s => s.CreatedBy)
                .WithMany()
                .HasForeignKey(s => s.CreatedById);


            builder.HasOne(e => e.Address)
                .WithMany()
                .HasForeignKey(x => x.AddressId);

            builder.HasOne(s => s.ModifiedBy)
                .WithMany()
                .HasForeignKey(s => s.ModifiedById);
        }
    }
}