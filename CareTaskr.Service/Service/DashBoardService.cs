using System;
using System.Linq;
using System.Threading.Tasks;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Helpers;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Identity;

namespace CareTaskr.Service.Service
{
    public class DashBoardService : IDashBoardService
    {
        private readonly IEmailService _emailService;
        private readonly IFPatientService _fhirPatientService;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IPatientService _patientService;
        private readonly UserManager<User> _userManager;
        private readonly ViewRender _viewRender;

        public DashBoardService(IGenericUnitOfWork genericUnitOfWork, UserManager<User> userManager,
            IPatientService patientService,
            IEmailService emailService, ViewRender viewRender,
            IFPatientService fhirPatientService)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _userManager = userManager;
            _patientService = patientService;
            _viewRender = viewRender;
            _emailService = emailService;
            _fhirPatientService = fhirPatientService;
        }


        public async Task<ResponseViewModel<InitRegistrationtViewModel>> InitRegistration(Guid currentUserId)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var carerRepo = _genericUnitOfWork.GetRepository<CarerPatient, int>();
            if (user == null)
                throw new ArgumentException("User not found");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");

            var result = new InitRegistrationtViewModel();

            if (user.UserType == UserType.Client)
            {
                var patient = patientRepo.FirstOrDefault(x => x.UserId == user.Id);
                result.FirstName = patient.FirstName;
                result.LastName = patient.LastName;
                result.HasCarer = patient.HasCarer;
                if (patient.HasCarer)
                {
                    var carer = carerRepo.FirstOrDefault(x => x.PatientId == patient.Id);
                    result.CarerFirstName = carer.Carer.FirstName;
                    result.CarerLastName = carer.Carer.LastName;
                    result.CarerContact = carer.Carer.Contact;
                    result.CarerRelation = carer.Carer.CarerPatients.First().Relation;
                    result.CarerFirstName = carer.Carer.FirstName;
                }
            }

            return new ResponseViewModel<InitRegistrationtViewModel> {Data = result, Success = true};
        }

        public async Task<ResponseViewModel> RegistrationComplete(Guid currentUserId, InitRegistrationtViewModel model)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();
            var carerRepo = _genericUnitOfWork.GetRepository<Carer, Guid>();
            if (user == null)
                throw new ArgumentException("User not found");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");


            user.FullName = string.Join(" ", model.FirstName, model.LastName);
            user.IsRegistrationComplete = true;
            userRepo.Update(user);

            var isNewCarer = false;
            var randomPassword = SecurityService.CreateRandomPassword();
            ;

            if (user.UserType == UserType.Client)
            {
                var patient = patientRepo.FirstOrDefault(x => x.UserId == currentUserId);
                if (patient == null)
                    throw new ArgumentException("Patient Does not exists");

                patient.FirstName = model.FirstName;
                patient.LastName = model.LastName;

                patient.ModifiedDate = GeneralService.CurrentDate;
                patient.ModifiedById = currentUserId;
                patient.HasCarer = model.HasCarer;


                if (model.HasCarer)
                    _patientService.SetCarer(currentUserId, model, patient, out isNewCarer, out randomPassword);

                var result = _fhirPatientService.UpdatePatient(patient);
                if (!result.Success)
                    throw new ArgumentException("Unable to update Patient data on FHIR Server");

                patientRepo.Update(patient);
            }

            _genericUnitOfWork.SaveChanges();

            if (isNewCarer && model.HasCarer)
            {
                #region Send  Email

                var emailModel = new PatientRegistrationViewModel
                {
                    FullName = string.Join(" ", model.CarerFirstName, model.CarerLastName),
                    Password = randomPassword
                };
                var email = model.CarerEmail;

                var html = _viewRender.Render("EmailTemplate/PatientRegistration", emailModel);
                _emailService.SendEmailAsync(email, "CareTaskr : Carer", html);

                #endregion
            }

            return new ResponseViewModel<string> {Data = "", Success = true};
        }
    }
}