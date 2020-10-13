using System;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Identity;

namespace CareTaskr.Service.Service
{
    public class ProviderService : ParentService, IProviderService
    {
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly IFileService _uploadService;
        private readonly UserManager<User> _userManager;

        public ProviderService(IGenericUnitOfWork genericUnitOfWork, IMapper mapper, UserManager<User> userManager,
            IFileService uploadService) : base(genericUnitOfWork)

        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
            _userManager = userManager;
            _uploadService = uploadService;
        }


        #region Provider

        public ResponseViewModel CreateProvider(Guid currentUserId, ProviderRequestViewModel model)
        {
            return CreateUpdateProvider(currentUserId, model, Guid.Empty);
        }

        public ResponseViewModel UpdateProvider(Guid currentUserId, Guid providerPublicId,
            ProviderRequestViewModel model)
        {
            return CreateUpdateProvider(currentUserId, model, providerPublicId);
        }

        private ResponseViewModel CreateUpdateProvider(Guid currentUserId, ProviderRequestViewModel model,
            Guid providerPublicId)
        {
            var repo = _genericUnitOfWork.GetRepository<Provider, int>();
            Provider provider;

            if (providerPublicId != Guid.Empty)
            {
                //UPDATE
                if (repo.FirstOrDefault(c =>
                    c.PublicId != providerPublicId && c.RegistrationNumber == model.RegistrationNumber) != null)
                    throw new ArgumentException(
                        $"Provider with registration number '{model.RegistrationNumber}' already exists!");

                provider = repo.FirstOrDefault(c => c.PublicId == providerPublicId);
                if (provider == null)
                    throw new ArgumentException("Provider does not exist");

                provider.ModifiedById = currentUserId;
                provider.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                if (repo.FirstOrDefault(c => c.RegistrationNumber == model.RegistrationNumber) != null)
                    throw new ArgumentException(
                        $"Provider with registration number '{model.RegistrationNumber}' already exists!");


                provider = new Provider
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
            }

            provider.ABNNumber = model.ABNNumber;


            provider.BusinessEmail = model.BusinessEmail;
            provider.CompanyName = model.CompanyType;
            //provider.IsNDISRegistered = model.IsNDISRegistered;
            provider.NDISNumber = model.NDISNumber;
            provider.NDISServicesProvided = model.NDISServicesProvided;
            provider.Services = model.Services;
            provider.PhoneNumber = model.PhoneNumber;
            //provider.PrimaryContactEmail = model.PrimaryContactEmail;
            //provider.PrimaryContactFirstName = model.PrimaryContactFirstName;
            //provider.PrimaryContactLastName = model.PrimaryContactLastName;
            provider.TradingName = model.TradingName;
            provider.RegistrationNumber = model.RegistrationNumber;
            provider.Name = model.Name;


            if (providerPublicId == Guid.Empty)
                repo.Add(provider);
            else
                repo.Update(provider);

            _genericUnitOfWork.SaveChanges();
            SetProviderDefaultData(provider, currentUserId);


            return new ResponseViewModel<ProviderViewModel>
                {Data = _mapper.Map<ProviderViewModel>(provider), Success = true};
        }

        private void SetProviderDefaultData(Provider provider, Guid currentUserId)
        {
            if (provider.AppointmentTypes == null || !provider.AppointmentTypes.Any())
            {
                var repo = _genericUnitOfWork.GetRepository<AppointmentType, int>();
                foreach (DictionaryEntry entry in DefaultData.AppointmentTypes)
                {
                    var name = entry.Key.ToString();
                    var isBillable = (bool) entry.Value;
                    var type = new AppointmentType
                    {
                        CreatedDate = GeneralService.CurrentDate,
                        CreatedById = currentUserId,
                        Provider = provider,
                        Name = name,
                        IsBillable = isBillable
                    };
                    repo.Add(type);
                }

                _genericUnitOfWork.SaveChanges();
            }

            if (provider.BillingSettings == null)
            {
                var billingSettings = new BillingSettings();
                billingSettings.CreatedDate = GeneralService.CurrentDate;
                billingSettings.CreatedById = currentUserId;
                billingSettings.Provider = provider;
                AddEntity<BillingSettings, int>(billingSettings);
            }
        }

        public DataSourceResult ListProvider(Guid currentUserId, DataRequestModel dataRequest)
        {
            //TODO: return only related with the user
            var queryable = _genericUnitOfWork.GetRepository<Provider, Guid>().GetAll().AsQueryable();

            var result = queryable.ToDataSourceResult<Provider, ProviderViewModel>(_mapper, dataRequest,
                new Sort {Field = "", Direction = SortOrder.ASCENDING});

            return result;
        }


        public async Task<ResponseViewModel> RegistrationComplete(Guid currentUserId,
            ProviderRegistrationCompleteViewModel model)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            var providerRepo = _genericUnitOfWork.GetRepository<Provider, int>();
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();
            var carerRepo = _genericUnitOfWork.GetRepository<Carer, Guid>();
            if (user == null)
                throw new ArgumentException("User not found");

            if (user.UserType != UserType.Owner)

                throw new ArgumentException("Invalid Request");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");


            var provider = GetUserProvider(currentUserId);

            if (provider == null)
                throw new ArgumentException("Provider Does not exists");

            user.FirstName = model.PrimaryContactFirstName;
            user.LastName = model.PrimaryContactLastName;
            user.FullName = string.Join(" ", model.PrimaryContactFirstName, model.PrimaryContactLastName);
            user.IsRegistrationComplete = true;
            user.Position = model.PrimaryContactPosition;
            userRepo.Update(user);


            //if (providerRepo.FirstOrDefault(c => c != provider && c.RegistrationNumber == model.RegistrationNumber) != null)
            //    throw new ArgumentException($"Provider with registration number '{model.RegistrationNumber}' already exists!");


            if (providerRepo.FirstOrDefault(c => c != provider && c.BusinessEmail == model.BusinessEmail) != null)
                throw new ArgumentException($"Provider with Business Email '{model.BusinessEmail}' already exists!");


            var providerMapped = _mapper.Map(model, provider);
            providerRepo.Update(providerMapped);


            _genericUnitOfWork.SaveChanges();
            SetProviderDefaultData(provider, currentUserId);

            return new ResponseViewModel<ProviderViewModel>
                {Data = _mapper.Map<ProviderViewModel>(provider), Success = true};
        }

        public ResponseViewModel<ProviderUpdateResponseViewModel> GetProviderDetails(Guid currentUserId)
        {
            var provider = GetUserProvider(currentUserId);

            if (provider == null)
                throw new ArgumentException("Provider Does not exists");

            var profilePicture = _genericUnitOfWork.GetRepository<ProviderDocument, int>().FirstOrDefault(x =>
                x.ProviderId == provider.Id && x.DocumentTypeId == ProviderDocumentType.BusinessProfile);

            var result = _mapper.Map<Provider, ProviderUpdateResponseViewModel>(provider);
            result.ProfileImage = profilePicture == null
                ? ""
                : _uploadService.GetContainerSasUri(profilePicture?.ThumbnailImageName);

            return new ResponseViewModel<ProviderUpdateResponseViewModel> {Data = result, Success = true};
        }

        public ResponseViewModel UpdateBusinessProfile(Guid currentUserId, ProviderUpdateRequestViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var providerRepo = _genericUnitOfWork.GetRepository<Provider, int>();

            var provider = GetUserProvider(currentUserId);


            if (provider == null)
                throw new ArgumentException("Provider Does not exists");

            SetProviderDefaultData(provider,
                currentUserId); //double check if provider has all info initialized - later n will not e necessary to do this here!!


            switch (model.Action)
            {
                case ProviderAction.Basic:

                    provider.Name = model.Name;
                    provider.TradingName = model.TradingName;
                    provider.CompanyType = model.CompanyType;
                    provider.ABNNumber = model.ABNNumber;
                    provider.RegisteredCompanyAddress = model.RegisteredCompanyAddress;
                    break;

                case ProviderAction.Business:

                    if (providerRepo.FirstOrDefault(c => c != provider && c.BusinessEmail == model.BusinessEmail) !=
                        null)
                        throw new ArgumentException(
                            $"Provider with Business Email '{model.BusinessEmail}' already exists!");

                    provider.BusinessEmail = model.BusinessEmail;
                    provider.PhoneNumber = model.PhoneNumber;
                    provider.CompanyType = model.CompanyType;
                    provider.BusinessWebSite = model.BusinessWebSite;
                    provider.BusinessAddress = model.BusinessAddress;
                    break;

                case ProviderAction.Service:

                    provider.Services = model.Services;
                    provider.RegistrationNumber = model.RegistrationNumber;
                    provider.MedicareRegistrationNumber = model.MedicareRegistrationNumber;

                    break;

                case ProviderAction.Account:

                    provider.ProviderBankDetails.ToList().ForEach(x => x.IsActive = false);

                    foreach (var item in model.BankDetails)
                    {
                        ProviderBankDetails bankDetail;

                        if (item.Id == Guid.Empty || item.Id == null)
                        {
                            bankDetail = new ProviderBankDetails
                            {
                                ProviderId = provider.Id,
                                BankName = item.BankName,
                                AccountNumber = item.AccountNumber,
                                BICSWIFTCode = item.BICSWIFTCode,
                                BankAddress = item.BankAddress,
                                BranchName = item.BranchName,
                                CreatedDate = currentDate,
                                CreatedById = currentUserId,
                                IsActive = true
                            };
                            provider.ProviderBankDetails.Add(bankDetail);
                        }
                        else
                        {
                            //update

                            var internalId = GetInternalId<ProviderBankDetails, int>((Guid) item.Id);
                            bankDetail = provider.ProviderBankDetails.First(x => x.Id == internalId);

                            if (bankDetail == null)
                                throw new ArgumentException("Bank Details Does not Exists");

                            bankDetail.BankName = item.BankName;
                            bankDetail.AccountNumber = item.AccountNumber;
                            bankDetail.BICSWIFTCode = item.BICSWIFTCode;
                            bankDetail.BankAddress = item.BankAddress;
                            bankDetail.BranchName = item.BranchName;
                            bankDetail.ModifiedById = currentUserId;
                            bankDetail.ModifiedDate = currentDate;
                            bankDetail.IsActive = true;
                        }
                    }

                    break;
                case ProviderAction.Billing:
                    //billing settings
                    if (provider.BillingSettings == null) provider.BillingSettings = new BillingSettings();
                    _mapper.Map(model.BillingSettings, provider.BillingSettings);
                    provider.BillingSettings.ModifiedById = currentUserId;
                    provider.BillingSettings.ModifiedDate = GeneralService.CurrentDate;

                    break;
            }


            providerRepo.Update(provider);


            _genericUnitOfWork.SaveChanges();

            return new ResponseViewModel<string> {Data = "", Success = true};
        }

        #endregion

        #region AppointmentTypes

        public ResponseViewModel CreateAppointmentType(Guid currentUserId, AppointmentTypeViewModel model)
        {
            return createUpdateAppointmentType(currentUserId, model, Guid.Empty);
        }

        public ResponseViewModel UpdateAppointmentType(Guid currentUserId, Guid appointmentTypeId, AppointmentTypeViewModel model)
        {
            return createUpdateAppointmentType(currentUserId, model, appointmentTypeId);
        }


        private ResponseViewModel createUpdateAppointmentType(Guid currentUserId, AppointmentTypeViewModel model, Guid appointmentTypeId)
        {
            var provider = GetUserProvider(currentUserId);
            var repo = _genericUnitOfWork.GetRepository<AppointmentType, int>();


            if (repo.FirstOrDefault(x => x.Name == model.Name && x.Provider == provider && x.PublicId != appointmentTypeId) != null)
                throw new ArgumentException($"A Appointment Type named '{model.Name}' already exists!");

            AppointmentType appointmentType;
            if (appointmentTypeId != Guid.Empty)
            {
                //UPDATE
                appointmentType = GetEntity<AppointmentType, int>(appointmentTypeId);
                appointmentType.ModifiedById = currentUserId;
                appointmentType.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                appointmentType = new AppointmentType
                {
                    Provider = provider,
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
            }

            appointmentType.Name = model.Name;
            appointmentType.IsBillable = model.IsBillable;

            if (appointmentTypeId == Guid.Empty)
                repo.Add(appointmentType);
            else
                repo.Update(appointmentType);


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AppointmentTypeViewModel> { Data = _mapper.Map<AppointmentTypeViewModel>(appointmentType), Success = true };
        }

        public ResponseViewModel GetAppointmentType(Guid currentUserId, Guid appointmentTypeId)
        {
            var appointmentType = GetEntity<AppointmentType, int>(appointmentTypeId);
            return new ResponseViewModel<AppointmentTypeViewModel> { Data = _mapper.Map<AppointmentTypeViewModel>(appointmentType), Success = true };
        }

        public DataSourceResult ListAppointmentTypes(Guid currentUserId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<AppointmentType, Guid>().GetAll().AsQueryable();

            var result = queryable.ToDataSourceResult<AppointmentType, AppointmentTypeViewModel>(_mapper, dataRequest,
                new Sort { Field = "CreatedDate", Direction = SortOrder.ASCENDING });

            return result;
        }

        public ResponseViewModel DeleteAppointmentType(Guid currentUserId, Guid appointmentTypeId)
        {
            DeleteEntity<AppointmentType, int>(currentUserId, appointmentTypeId);
            return new ResponseViewModel<AppointmentTypeViewModel> { Success = true };
        }

        #endregion
    }
}