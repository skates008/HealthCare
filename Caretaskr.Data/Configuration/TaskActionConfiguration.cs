using CareTaskr.Domain.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class TaskActionConfiguration : IEntityTypeConfiguration<TaskAction>
    {
        public void Configure(EntityTypeBuilder<TaskAction> builder)
        {
            builder.Property(e => e.Id)
                .ValueGeneratedNever();

            builder.Property(e => e.DisplayName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.ActionName)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasOne(d => d.Page)
                .WithMany()
                .HasForeignKey(d => d.PageId);

            builder.HasOne(d => d.Module)
                .WithMany()
                .HasForeignKey(d => d.ModuleId);

            builder.HasIndex(b => b.ActionName)
                .IsUnique();
        }
    }

    public class RoleTaskActionConfiguration : IEntityTypeConfiguration<RoleTaskAction>
    {
        public void Configure(EntityTypeBuilder<RoleTaskAction> builder)
        {
            builder.HasKey(e => new {e.TaskActionId, e.RoleId});
            builder.HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey(e => e.RoleId);

            builder.HasOne(d => d.TaskAction)
                .WithMany()
                .HasForeignKey(d => d.TaskActionId);
        }
    }
}