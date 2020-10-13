using System;

namespace CareTaskr.Service.Infrastructure
{
    public interface IGenericUnitOfWork : IDisposable
    {
        GenericRepository<TEntity, TKey> GetRepository<TEntity, TKey>() where TEntity : class;
        void SaveChanges();
    }
}