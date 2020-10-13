using System;
using Caretaskr.Common.Configuration;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Service.Infrastructure;

namespace CareTaskr.Service.Service
{
    public class ParentService
    {
        private readonly IGenericUnitOfWork _genericUnitOfWork;


        public ParentService(IGenericUnitOfWork genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
        }

        protected Provider GetUserProvider(Guid userId)
        {
            var repo = _genericUnitOfWork.GetRepository<ProviderUser, int>();

            //we are assuming that a ser is only associated to a provider
            var entity = repo.FirstOrDefault(x => x.User.Id == userId);
            if (entity != null) return entity.Provider;
            throw new ArgumentException($"User {userId} is not associated to a provider");
        }

        protected User GetUser(Guid userId)
        {
            var repo = _genericUnitOfWork.GetRepository<User, int>();

            //we are assuming that a ser is only associated to a provider
            var entity = repo.FirstOrDefault(x => x.Id == userId);
            if (entity != null) return entity;
            throw new ArgumentException($"User {userId} does not exist");
        }

        protected PatientRecord GetPatientRecord(Guid currentUserId, Guid publicPatientId)
        {
            var repo = _genericUnitOfWork.GetRepository<PatientRecord, int>();

            var provider = GetUserProvider(currentUserId);
            var patientId = GetInternalId<Patient, Guid>(publicPatientId);

            //we are assuming that a ser is only associated to a provider
            var entity = repo.FirstOrDefault(x => x.Provider == provider && x.PatientId == patientId);
            if (entity != null) return entity;
            throw new ArgumentException("No patient record found.");
        }


        //TODO: nake use of method GetEntity...
        protected TKey GetInternalId<TEntity, TKey>(Guid publicId) where TEntity : BaseEntity<TKey>
        {
            var repo = _genericUnitOfWork.GetRepository<TEntity, TKey>();
            var entity = repo.FirstOrDefault(x => x.PublicId == publicId);
            if (entity == null) throw new ArgumentException("Invalid Public Id");
            return entity.Id;
        }

        protected TEntity GetEntity<TEntity, TKey>(Guid publicId) where TEntity : BaseEntity<TKey>
        {
            var repo = _genericUnitOfWork.GetRepository<TEntity, TKey>();
            var entity = repo.FirstOrDefault(x => x.PublicId == publicId);
            if (entity == null) throw new ArgumentException("Invalid Id");
            return entity;
        }


        protected TEntity AddEntity<TEntity, TKey>(TEntity entity) where TEntity : class
        {
            var repo = _genericUnitOfWork.GetRepository<TEntity, TKey>();
            repo.Add(entity);
            _genericUnitOfWork.SaveChanges();
            return entity;
        }

        protected TEntity UpdateEntity<TEntity, TKey>(TEntity entity) where TEntity : class
        {
            var repo = _genericUnitOfWork.GetRepository<TEntity, TKey>();
            repo.Update(entity);
            _genericUnitOfWork.SaveChanges();
            return entity;
        }

        protected Guid GetPatientId(Guid currentUserId)
        {
            var repo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var entity = repo.FirstOrDefault(x => x.UserId == currentUserId);
            if (entity == null)
                throw new ArgumentException("Invalid  Id");
            return entity.Id;
        }


        protected int GetPatientProviderId(Guid userId)
        {
            var repo = _genericUnitOfWork.GetRepository<PatientRecord, int>();

            //we are assuming that a ser is only associated to a provider
            var entity = repo.FirstOrDefault(x => x.Patient.UserId == userId);
            if (entity != null) return entity.ProviderId;
            throw new ArgumentException($"Patient {userId} is not associated to a provider");
        }

        //TODO: make use of GetEntity
        protected void DeleteEntity<TEntity, TKey>(Guid currentUserid, Guid publicId, string entityName = "")
            where TEntity : BaseEntity<TKey>
        {
            var repo = _genericUnitOfWork.GetRepository<TEntity, TKey>();
            var entity = repo.FirstOrDefault(x => x.PublicId == publicId);
            if (entity == null)
                throw new ArgumentException($"{entityName} Does not Exist");
            if (!entity.IsActive)
                throw new ArgumentException($"{entityName} has already been deleted");

            entity.IsActive = false;
            if (currentUserid != Guid.Empty) entity.ModifiedById = currentUserid;
            entity.ModifiedDate = GeneralService.CurrentDate;


            repo.Update(entity);
            _genericUnitOfWork.SaveChanges();
        }
    }
}