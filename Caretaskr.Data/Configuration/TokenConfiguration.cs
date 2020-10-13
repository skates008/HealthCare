using CareTaskr.Domain.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class TokenConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.ToTable("AspNetRefreshToken");
            builder.HasKey(e => e.Id);


            builder.Property(e => e.Token)
                .IsRequired();

            builder.Property(e => e.UserId)
                .IsRequired();

            builder.HasAlternateKey(e => e.UserId);
            builder.HasAlternateKey(e => e.Token);
            builder.HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId);
        }
    }
}