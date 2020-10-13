using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
using Caretaskr.Common.Extension;
using Caretaskr.Common.Extensions;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Constant;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using static Caretaskr.Common.Configuration.GeneralService;

namespace CareTaskr.Service.Service
{
    public class ListService : ParentService, IListService
    {
        private readonly IGenericUnitOfWork _genericUnitOfWork;

        private readonly IMapper _mapper;

        public ListService(IGenericUnitOfWork genericUnitOfWork,
            IMapper mapper) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
        }

        public IList<ListViewModel> ListGender()
        {
            return EnumList<Gender>.Get().ToList();
        }

        public IList<ListViewModel> ListEthinicity()
        {
            return EnumList<Ethnicity>.Get().ToList();
        }

        public IList<AppointmentTypeViewModel> ListTypeOfAppointments()
        {
            var repo = _genericUnitOfWork.GetRepository<AppointmentType, Guid>();
            var result = _mapper.Map<IList<AppointmentType>, IList<AppointmentTypeViewModel>>(repo.GetAll().ToList());
            return result;
        }

        public IList<ListViewModel> ListCountries()
        {
            var result = _genericUnitOfWork.GetRepository<Country, int>().GetAll();
            return _mapper.Map<IList<Country>, IList<ListViewModel>>(result.ToList());
        }

        public IList<ListViewModel> ListParticipant(Guid loggedInUserId)
        {
            var provider = GetUserProvider(loggedInUserId);
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();

            Expression<Func<Patient, bool>> expression = c => c.PatientRecords.Any(p => p.Provider == provider);

            var result =
                _mapper.Map<IList<Patient>, IList<ListViewModel>>(patientRepo.GetAll(expression)
                    .OrderBy(o => o.User.FullName).ToList());
            return result;
        }

        public IList<ListViewModel> ListPractioner(Guid loggedInUserId)
        {
            var provider = GetUserProvider(loggedInUserId);
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();

            Expression<Func<User, bool>> expression = c =>
                (c.UserType == UserType.User || c.UserType == UserType.Owner) &&
                c.Providers.Any(p => p.Provider == provider) && c.IsActive;

            var result =
                _mapper.Map<IList<User>, IList<ListViewModel>>(userRepo.GetAll(expression).OrderBy(o => o.FullName)
                    .ToList());

            return result;
        }

        public IList<ListViewModel> ListPractionerByTeam(Guid loggedInUserId, Guid teamId)
        {
            var provider = GetUserProvider(loggedInUserId);
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();

            Expression<Func<User, bool>> expression = c =>
                c.UserType == UserType.User && c.Providers.Any(p => p.Provider == provider) && c.IsActive;


            if (!(teamId == Guid.Empty || teamId == null))
            {
                Expression<Func<User, bool>> teamExpression = c => c.Teams.Any(x => x.Team.PublicId == teamId);
                expression = ExpressionBuilder.AndExpression(expression, teamExpression);
            }

            var result =
                _mapper.Map<IList<User>, IList<ListViewModel>>(userRepo.GetAll(expression).OrderBy(o => o.FullName)
                    .ToList());

            return result;
        }

        public IList<ListViewModel> ListBudgetByPatientId(Guid patientId)
        {
            var repo = _genericUnitOfWork.GetRepository<Budget, Guid>();

            Expression<Func<Budget, bool>> expression = c => c.Patient.PublicId == patientId && c.IsActive;

            var result = _mapper.Map<IList<Budget>, IList<ListViewModel>>(repo.GetAll(expression).ToList());

            return result;
        }

        public IList<ListViewModel> ListFundCategory()
        {
            var repo = _genericUnitOfWork.GetRepository<FundCategory, Guid>();

            var result = _mapper.Map<IList<FundCategory>, IList<ListViewModel>>(repo.GetAll(c => c.IsActive).ToList());
            return result;
        }

        public IList<ListBillableItemViewModel> ListBillableItems(Guid currentUserId)
        {
            var provider = GetUserProvider(currentUserId);
            var repo = _genericUnitOfWork.GetRepository<BillableItem, Guid>();


            var result =
                _mapper.Map<IList<BillableItem>, IList<ListBillableItemViewModel>>(
                    repo.GetAll(x => x.IsActive && x.ProviderId == provider.Id).ToList());
            return result;
        }

        public IList<ListCarePlanViewModel> ListCareplanByPatient(Guid patientId)
        {
            var repo = _genericUnitOfWork.GetRepository<Careplan, int>();

            Expression<Func<Careplan, bool>> expression = c =>
                c.IsActive && c.PatientRecord.Patient.PublicId == patientId && c.Status == CareplanStatus.Active;

            var result =
                _mapper.Map<IList<Careplan>, IList<ListCarePlanViewModel>>(repo.GetAll(expression).OrderBy(o => o.Title)
                    .ToList());
            return result;
        }

        public IList<ListViewModel> ListBillingType(Guid currentUserId)
        {
            var result = new List<ListViewModel>();
            foreach (BillingType billingType in Enum.GetValues(typeof(BillingType)))
                result.Add(new ListViewModel {Id = billingType, Text = billingType.GetDescription()});
            return result;
        }

        public IList<ListViewModel> ListUserType(Guid currentUserId)
        {
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();

            var user = userRepo.FirstOrDefault(x => x.Id == currentUserId);

            if (user == null)
                throw new ArgumentException("INvalid user");

            var roleIds = new string[3];
            if (user.UserType == UserType.Owner)
                roleIds = new[]
                {
                    ApplicationConstants.SuperAdminRoleGuid,
                    ApplicationConstants.AdminRoleGuid,
                    ApplicationConstants.TherapistRoleGuid
                };

            else if (user.UserType == UserType.Manager)
                roleIds = new[]
                {
                    ApplicationConstants.AdminRoleGuid,
                    ApplicationConstants.TherapistRoleGuid
                };

            else throw new ArgumentException("Bad Request");


            var result = _genericUnitOfWork.GetRepository<Role, Guid>().GetAll()
                .Where(p => roleIds.Contains(p.Id.ToString()))
                .ToList();

            return _mapper.Map<IList<Role>, IList<ListViewModel>>(result);
        }

        public IList<ListAddressViewModel> ListAddressTypes(Guid patientId)
        {
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();


            var patient = patientRepo.FirstOrDefault(x => x.PublicId == patientId);

            if (patient == null)
                throw new ArgumentException("Invalid Patient");

            var addressTypes = new List<ListAddressViewModel>();

            if (patient.User.AddressId != null) {
                var clientAddress = _mapper.Map<AddressViewModel>(patient.User.Address);
                clientAddress.AddressType = AddressType.ClientAddress.ToDescription() ;

                addressTypes.Add(new ListAddressViewModel
                {
                    Id = 1,
                    Text = clientAddress.AddressType,
                    Address = clientAddress
                });
            }

            if (patient.SchoolAddressId != null) {
                var schoolAddress = _mapper.Map<AddressViewModel>(patient.SchoolAddress);
                schoolAddress.AddressType = AddressType.SchoolAddress.ToDescription();
                addressTypes.Add(new ListAddressViewModel
                {
                    Id = 2,
                    Text = schoolAddress.AddressType,
                    Address = _mapper.Map<AddressViewModel>(patient.SchoolAddress),

                });
            }

            addressTypes.Add(new ListAddressViewModel
            {
                Id = 3,
                Text = AddressType.Other.ToString(),
                Address = new AddressViewModel() { 
                AddressType = AddressType.Other.ToString()
                }
            });


            return addressTypes;
        }
    }
}