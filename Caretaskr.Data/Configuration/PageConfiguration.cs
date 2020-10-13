using CareTaskr.Domain.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class PageConfiguration : IEntityTypeConfiguration<Page>
    {
        public void Configure(EntityTypeBuilder<Page> builder)
        {
            builder.Property(e => e.Id)
                .ValueGeneratedNever();

            builder.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Path)
                .HasMaxLength(200);

            builder.Property(e => e.Icon)
                .HasMaxLength(100);

            builder.Property(e => e.DisplayOrder)
                .IsRequired();
        }
    }

    public class UserPageConfiguration : IEntityTypeConfiguration<UserPage>
    {
        public void Configure(EntityTypeBuilder<UserPage> builder)
        {
            builder.HasKey(e => new {e.PageId, e.RoleId});
            builder.HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey(e => e.RoleId)
                .HasConstraintName("FK_UserPages_Roles");

            builder.HasOne(d => d.Page)
                .WithMany()
                .HasForeignKey(d => d.PageId)
                .HasConstraintName("FK_UserPages_Pages");
        }
    }
}