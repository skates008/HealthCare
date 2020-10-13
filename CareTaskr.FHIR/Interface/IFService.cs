namespace CareTaskr.Service.Interface
{
    public interface IFService
    {
        //TEntity Create<TEntity, Guid>(TEntity entity, Guid id) where TEntity : class;
        //TEntity Update<TEntity, TKey>(TEntity entity, Guid id) where TEntity : class;
        //bool Delete<TEntity, TKey>(Guid id) where TEntity : class;
        //TEntity GetById<TEntity, TKey>(Guid id) where TEntity : class;

        void enrich<TEntity>(TEntity entity) where TEntity : class;
    }
}