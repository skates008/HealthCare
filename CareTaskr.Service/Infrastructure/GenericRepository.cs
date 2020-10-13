using System;
using System.Linq;
using System.Linq.Expressions;
using Caretaskr.Data;
using Microsoft.EntityFrameworkCore;

namespace CareTaskr.Service.Infrastructure
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : class
    {
        private readonly DbSet<TEntity> _dbSet;

        public GenericRepository(ApplicationContext dataContext)
        {
            DataContext = dataContext;
            _dbSet = DataContext.Set<TEntity>();
        }

        public ApplicationContext DataContext { get; }

        public IQueryable<TEntity> GetAll(Expression<Func<TEntity, bool>> expression = null)
        {
            if (expression == null)
                return _dbSet;

            return _dbSet.Where(expression);
        }

        public void Add(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentException("entity");
            _dbSet.Add(entity);
        }

        public void Update(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentException("entity");
            if (DataContext.Entry(entity).State == EntityState.Detached) _dbSet.Attach(entity);
            DataContext.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(TEntity entity)
        {
            if (DataContext.Entry(entity).State == EntityState.Detached)
                _dbSet.Attach(entity);
            _dbSet.Remove(entity);
        }

        public TEntity GetById(TKey id)
        {
            return _dbSet.Find(id);
        }

        public TEntity FirstOrDefault()
        {
            return _dbSet.FirstOrDefault();
        }

        public TEntity FirstOrDefault(Expression<Func<TEntity, bool>> expression = null)
        {
            if (expression == null)
                return _dbSet.FirstOrDefault();
            return _dbSet.FirstOrDefault(expression);
        }

        public TEntity SingleOrDefault(Expression<Func<TEntity, bool>> expression = null)
        {
            if (expression == null)
                return _dbSet.SingleOrDefault();
            return _dbSet.SingleOrDefault(expression);
        }

        public IQueryable<TEntity> GetAllIgnoreGlobalQueries(Expression<Func<TEntity, bool>> expression = null)
        {
            if (expression == null)
                return _dbSet;

            return _dbSet.IgnoreQueryFilters().Where(expression);
        }
    }
}