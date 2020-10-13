using System;
using System.Linq;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Constant;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;

namespace CareTaskr.Service.Service
{
    public class MyProfileService : IMyProfileService
    {
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileService _uploadService;


        public MyProfileService(IGenericUnitOfWork genericUnitOfWork, IMapper mapper, IFileService uploadService)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
            _uploadService = uploadService;
        }


        public ResponseViewModel UpdateBasicDetails(Guid currentUserId, MyProfileBasicDetailsViewModel model)
        {
            var repo = _genericUnitOfWork.GetRepository<User, Guid>();
            var userEntity = repo.FirstOrDefault(c => c.Id == currentUserId);
            var users = repo.GetAll();

            if (userEntity == null)
                throw new ArgumentException(ErrorMessage.USER_DOES_NOT_EXIST);

            var phoneExists = users.Any(c => c.PhoneNumber == model.PhoneNumber.Trim() && c.Id != currentUserId);
            if (phoneExists)
                throw new ArgumentException("User with the phone number already exists in the system",
                    innerException: null);


            var userMapped = _mapper.Map(model, userEntity);
            userMapped.ModifiedById = currentUserId;
            userMapped.ModifiedDate = GeneralService.CurrentDate;

            repo.Update(userMapped);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> {Data = "", Success = true};
        }


        public ResponseViewModel<MyProfileDetailsViewModel> GetUserDetails(Guid currentUserId)
        {
            var repo = _genericUnitOfWork.GetRepository<User, Guid>();
            var user = repo.FirstOrDefault(x => x.Id == currentUserId);

            if (user == null)
                throw new ArgumentException("User Does not exist");

            var profilePicture = _genericUnitOfWork.GetRepository<UserDocument, int>().FirstOrDefault(x =>
                x.UserId == user.Id && x.DocumentTypeId == UserDocumentType.UserProfile);


            var result = _mapper.Map<User, MyProfileDetailsViewModel>(user);
            result.ProfileImage = profilePicture == null
                ? ""
                : _uploadService.GetContainerSasUri(profilePicture?.ThumbnailImageName);
            return new ResponseViewModel<MyProfileDetailsViewModel> {Success = true, Data = result};
        }
    }
}