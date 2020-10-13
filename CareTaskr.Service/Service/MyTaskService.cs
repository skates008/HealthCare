using System;
using System.Linq;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;

namespace CareTaskr.Service.Service
{
    public class MyTaskService : IMyTaskService
    {
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;

        public MyTaskService(IGenericUnitOfWork genericUnitOfWork, IMapper mapper)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
        }

        public ResponseViewModel CreateMyTask(Guid currentUserId, CreateMyTaskViewModel model)
        {
            var repo = _genericUnitOfWork.GetRepository<MyTask, int>();

            var currentDate = GeneralService.CurrentDate;
            var taskExists = repo.GetAll(x => x.Title == model.Title && x.UserId == currentUserId);

            if (taskExists.Any())
                throw new ArgumentException("Title Already exists");


            var task = new MyTask
            {
                UserId = currentUserId,
                Title = model.Title,
                Description = model.Description,
                IssueDate = currentDate,
                DueDate = model.DueDate,
                CreatedDate = currentDate,
                CreatedById = currentUserId,
                IsActive = true
            };

            repo.Add(task);


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> {Data = "", Success = true};
        }

        public DataSourceResult ListMyTask(Guid currentUserId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<MyTask, Guid>().GetAll(x => x.UserId == currentUserId)
                .AsQueryable();

            var result = queryable.ToDataSourceResult<MyTask, MyTaskListViewModel>(_mapper, dataRequest,
                new Sort {Field = "CreatedDate", Direction = SortOrder.DESCENDING});

            return result;
        }

        public ResponseViewModel UpdateMyTask(Guid currentUserId, UpdateMyTaskViewModel model)
        {
            var repo = _genericUnitOfWork.GetRepository<MyTask, Guid>();

            var myTask = repo.FirstOrDefault(x => x.PublicId == model.Id);

            var titleExists = repo.GetAll().Any(x =>
                x.Title == model.Title && x.UserId == currentUserId && x.PublicId != model.Id);
            if (titleExists)
                throw new ArgumentException("Title already Exists");


            myTask.Title = model.Title;
            myTask.Description = model.Description;
            myTask.IssueDate = GeneralService.CurrentDate;
            myTask.DueDate = model.DueDate;

            myTask.ModifiedDate = GeneralService.CurrentDate;
            myTask.ModifiedById = currentUserId;


            repo.Update(myTask);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> {Data = "", Success = true};
        }


        public ResponseViewModel DeleteTask(Guid currentUserId, Guid id)
        {
            var repo = _genericUnitOfWork.GetRepository<MyTask, Guid>();
            var entity = repo.FirstOrDefault(x => x.PublicId == id);

            if (entity == null || entity.UserId != currentUserId)
                throw new ArgumentException("Task Does not exist");


            entity.ModifiedById = currentUserId;
            entity.ModifiedDate = GeneralService.CurrentDate;
            entity.IsActive = false;
            repo.Update(entity);


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel {Success = true};
        }

        public ResponseViewModel<MyTaskResponseViewModel> GetMyTaskServiceById(Guid currentUserId, Guid id)
        {
            var repo = _genericUnitOfWork.GetRepository<MyTask, Guid>();
            var entity = repo.FirstOrDefault(x => x.UserId == currentUserId && x.PublicId == id);

            if (entity == null)
                throw new ArgumentException("Task Does not exist");

            var result = new MyTaskResponseViewModel
            {
                Description = entity.Description,
                DueDate = entity.DueDate,
                IssueDate = entity.IssueDate,
                Title = entity.Title,
                Id = entity.PublicId
            };

            return new ResponseViewModel<MyTaskResponseViewModel> {Success = true, Data = result};
        }
    }
}