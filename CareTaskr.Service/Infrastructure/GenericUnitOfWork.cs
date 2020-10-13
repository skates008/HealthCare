using System;
using Caretaskr.Common.Exceptions;
using Caretaskr.Data;

namespace CareTaskr.Service.Infrastructure
{
    public class GenericUnitOfWork : IGenericUnitOfWork
    {
        private ApplicationContext _context;

        public GenericUnitOfWork(ApplicationContext context)
        {
            _context = context;
        }

        public GenericRepository<TEntity, TKey> GetRepository<TEntity, TKey>() where TEntity : class
        {
            return new GenericRepository<TEntity, TKey>(_context);
        }

        public void SaveChanges()
        {
            try
            {
                _context.SaveChanges();
            }

            catch (Exception ex)
            {
                throw new DBException();
            }
        }

        /// <summary>
        ///     Disposes the current object
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        ///     Disposes all external resources.
        /// </summary>
        /// <param name="disposing">The dispose indicator.</param>
        private void Dispose(bool disposing)
        {
            if (disposing)
                if (_context != null)
                {
                    _context.Dispose();
                    _context = null;
                }
        }
    }
}