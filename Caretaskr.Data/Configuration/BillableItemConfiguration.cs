using CareTaskr.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caretaskr.Data.Configuration
{
    public class BillableItemConfiguration : IEntityTypeConfiguration<BillableItem>
    {
        public void Configure(EntityTypeBuilder<BillableItem> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Provider)
                .WithMany()
                .HasForeignKey(e => e.ProviderId);

            builder.HasMany(e => e.PriceLst)
                .WithOne(e => e.BillableItem)
                .HasForeignKey(e => e.BillableItemId);
        }
    }

    public class BillableItemPriceConfiguration : IEntityTypeConfiguration<BillableItemPrice>
    {
        public void Configure(EntityTypeBuilder<BillableItemPrice> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.BillableItem)
                .WithMany()
                .HasForeignKey(e => e.BillableItemId);
        }
    }
}