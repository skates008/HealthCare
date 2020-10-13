using Caretaskr.Data.DataAuthorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CareTaskr.Domain.DataAuthorization
{
    public static class DataKeyExtensions
    {
        /// <summary>
        /// This is called in the overridden SaveChanges in the application's DbContext
        /// Its job is to call the SetTenantKey on entities that have it and are being created

        public static void MarkCreatedItemWithDataKeys(this DbContext context)
        {

            foreach (var entityEntry in context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
            {
                if (entityEntry.Entity is ITenantData entityToMark)
                {
                    entityToMark.SetTenantDataKey();
                }
                if (entityEntry.Entity is IPatientData entityToMark2)
                {
                    entityToMark2.SetPatientDataKey();
                }
            }
        }

    }
}