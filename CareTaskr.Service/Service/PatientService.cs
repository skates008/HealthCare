using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Constant;
using Caretaskr.Common.Helpers;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Constant;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using CareTaskr.Service.Reporting;
using CareTaskr.Service.Tools;
using DinkToPdf.Contracts;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace CareTaskr.Service.Service
{
    public class PatientService : ParentService, IPatientService
    {
        private readonly IBillingService _billingService;
        private readonly CareTaskrUrl _careTaskrUrls;
        private readonly IConverter _converter;
        private readonly IEmailService _emailService;
        private readonly EncryptionService _encryptionService;
        private readonly IFClinicalInfoService _fhirClinicalInfoService;
        private readonly IFDiagnosticsService _fhirDiagnosticsService;
        private readonly IFMedicationService _fhirMedicationService;
        private readonly IFPatientService _fhirPatientService;
        private readonly IFileService _fileService;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly ViewRender _viewRender;


        public PatientService(IGenericUnitOfWork genericUnitOfWork,
            IFPatientService fhirPatientService,
            IFClinicalInfoService fhirClinicalInfoService,
            IFMedicationService fhirMedicationService,
            IFDiagnosticsService fhirDiagnosticsService,
            IMapper mapper,
            IOptions<CareTaskrUrl> careTaskrUrls,
            UserManager<User> userManager,
            IEmailService emailService, ViewRender viewRender,
            EncryptionService encryptionService,
            IConverter converter,
            IFileService uploadService,
            IBillingService billingService) : base(genericUnitOfWork)

        {
            _genericUnitOfWork = genericUnitOfWork;
            _mapper = mapper;
            _fhirPatientService = fhirPatientService;
            _fhirClinicalInfoService = fhirClinicalInfoService;
            _fhirMedicationService = fhirMedicationService;
            _fhirDiagnosticsService = fhirDiagnosticsService;
            _userManager = userManager;
            _viewRender = viewRender;
            _emailService = emailService;
            _converter = converter;
            _encryptionService = encryptionService;
            _careTaskrUrls = careTaskrUrls.Value;
            _fileService = uploadService;
            _billingService = billingService;
        }


        #region Carer

        public void SetCarer(Guid currentUserId, object model, Patient patient, out bool isNewCarer,
            out string randomPassword)
        {
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();
            var carerRepo = _genericUnitOfWork.GetRepository<Carer, Guid>();
            var serializedModel = JsonConvert.SerializeObject(model);
            var custodianModel = JsonConvert.DeserializeObject<PatientCustodianViewModel>(serializedModel);
            isNewCarer = false;
            randomPassword = SecurityService.CreateRandomPassword();
            ;
            if (patient.HasCarer)
            {
                var carerExists = carerRepo.FirstOrDefault(x => x.Email == custodianModel.Email.Trim());
                if (carerExists == null)
                {
                    isNewCarer = true;
                    var carerUser = new User
                    {
                        Id = Guid.NewGuid(),
                        NormalizedEmail = custodianModel.Email.ToUpper(),
                        NormalizedUserName = custodianModel.Email.ToUpper(),
                        FullName = string.Join(" ", custodianModel.FirstName, custodianModel.LastName),
                        UserType = UserType.PrimaryCustodian,
                        UserName = custodianModel.Email,
                        Email = custodianModel.Email,
                        EmailConfirmed = true,
                        SecurityStamp = Guid.NewGuid().ToString()
                    };

                    var passwordHash = new PasswordHasher<User>().HashPassword(carerUser, randomPassword);
                    carerUser.PasswordHash = passwordHash;
                    userRepo.Add(carerUser);

                    var carer = new Carer
                    {
                        Id = Guid.NewGuid(),
                        UserId = carerUser.Id,
                        Email = custodianModel.Email,
                        FirstName = custodianModel.FirstName,
                        LastName = custodianModel.LastName,
                        Contact = custodianModel.Contact,
                        CreatedDate = GeneralService.CurrentDate,
                        CreatedById = currentUserId,
                        IsActive = true
                    };
                    carerRepo.Add(carer);

                    SetCarerPatients(carer, patient.Id, custodianModel.Relation, currentUserId);
                }

                else
                {
                    carerExists.FirstName = custodianModel.FirstName;
                    carerExists.LastName = custodianModel.LastName;
                    carerExists.Contact = custodianModel.Contact;

                    carerRepo.Update(carerExists);

                    SetCarerPatients(carerExists, patient.Id, custodianModel.Relation, currentUserId);
                }
            }
        }

        #endregion

        public async Task<ResponseViewModel<InitPatientRegistrationtViewModel>> InitRegistration(Guid currentUserId)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var carerRepo = _genericUnitOfWork.GetRepository<CarerPatient, int>();
            if (user == null)
                throw new ArgumentException("User not found");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");

            var result = new InitPatientRegistrationtViewModel();


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


            return new ResponseViewModel<InitPatientRegistrationtViewModel> { Data = result, Success = true };
        }

        public async Task<ResponseViewModel> RegistrationComplete(Guid currentUserId,
            InitPatientRegistrationtViewModel model)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();
            var carerRepo = _genericUnitOfWork.GetRepository<Carer, Guid>();
            if (user == null)
                throw new ArgumentException("User not found");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");


            var checkNdisExists = patientRepo.GetAll().Where(x => x.NDISNumber == model.NDISNumber).ToList();
            if (checkNdisExists.Any())
                throw new ArgumentException(ErrorMessage.NDIS_ALREADY_EXISTS);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.FullName = string.Join(" ", model.FirstName, model.LastName);
            user.IsRegistrationComplete = true;
            userRepo.Update(user);

            var isNewCarer = false;
            var randomPassword = SecurityService.CreateRandomPassword();
            ;

            var patient = patientRepo.FirstOrDefault(x => x.UserId == currentUserId);
            if (patient == null)
                throw new ArgumentException("Patient Does not exists");

            patient.FirstName = model.FirstName;
            patient.LastName = model.LastName;
            patient.NDISNumber = model.NDISNumber;
            patient.ModifiedDate = GeneralService.CurrentDate;
            patient.ModifiedById = currentUserId;
            patient.HasCarer = model.HasCarer;


            if (model.HasCarer) SetCarer(currentUserId, model, patient, out isNewCarer, out randomPassword);

            var result = _fhirPatientService.UpdatePatient(patient);
            if (!result.Success)
                throw new ArgumentException("Unable to update Patient data on FHIR Server");

            patientRepo.Update(patient);


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

                var html = _viewRender.Render(EmailTemplate.PATIENT_REGISTRATION, emailModel);
                await _emailService.SendEmailAsync(email, "Caretaskr : Carer", html);

                #endregion
            }

            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public DataSourceResult GetFiles(Guid currentUserId, Guid patientId, DataRequestModel dataRequest)
        {
            var patientRecord = GetPatientRecord(currentUserId, patientId);
            if (dataRequest.Filter == null)
                dataRequest.Filter = new Dictionary<string, string>();
            dataRequest.Filter.Add(Constants.QueryFilters.PATIENT_RECORD_ID, patientRecord.PublicId.ToString());
            return _fileService.ListFiles(currentUserId, dataRequest);
        }


        private void SetCarerPatients(Carer carer, Guid patientId, string relation, Guid currentUserId)
        {
            var carerPatientRepo = _genericUnitOfWork.GetRepository<CarerPatient, int>();
            var carerPatientExists = carerPatientRepo.FirstOrDefault(x => x.PatientId == patientId && x.Carer == carer);
            if (carerPatientExists == null)
            {
                var carerPatients = new CarerPatient
                {
                    CarerId = carer.Id,
                    PatientId = patientId,
                    Relation = relation,
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
                carerPatientRepo.Add(carerPatients);
            }
            else
            {
                carerPatientExists.PatientId = patientId;
                carerPatientExists.CarerId = carer.Id;
                carerPatientExists.Relation = relation;
                carerPatientExists.ModifiedById = currentUserId;
                carerPatientExists.CreatedDate = GeneralService.CurrentDate;
                carerPatientRepo.Update(carerPatientExists);
            }
        }

        private void SetPatientRecordDefaultData(Guid currentUserId, Provider provider, Patient patient)
        {
            var patientRecord = patient.PatientRecords?.FirstOrDefault(x => x.Provider == provider);
            if (patientRecord == null)
            {
                patientRecord = new PatientRecord
                {
                    Provider = provider,
                    Patient = patient,
                    BillingDetails = new BillingDetails()
                };
                AddEntity<PatientRecord, int>(patientRecord);
            }
            else if (patientRecord.BillingDetails == null)
            {
                var billingDetails = new BillingDetails
                { PatientRecord = patientRecord, CreatedDate = GeneralService.CurrentDate };
                AddEntity<BillingDetails, int>(billingDetails);
            }
        }


        //TODO: refactor entire UserDocumtnet/ProviderDocument methods/services
        //There should be a single "FileUpload" entity, and others entities link to it. Example: user.avatarId = fileUploadId
        protected string GetUserProfilePictureUrl(Guid userId)
        {
            var profilePicture = _genericUnitOfWork.GetRepository<UserDocument, int>()
                .FirstOrDefault(x => x.UserId == userId && x.DocumentTypeId == UserDocumentType.UserProfile);

            return profilePicture == null ? "" : _fileService.GetContainerSasUri(profilePicture?.ThumbnailImageName);
        }


        public List<PatientWarning> GetPatientRecordWarnings(PatientRecord patientRecord)
        {
            var warnings = new List<PatientWarning>();

            var currentDate = GeneralService.CurrentDate;


            //TODO: find best way to optimize this (cache, db?) and move strings somehwere else
            //careplan
            var activeCareplans = patientRecord.Careplans.Where(x => !x.isDefault && x.Status == CareplanStatus.Active && x.StartDate <= currentDate && x.DueDate >= currentDate);
            if (!activeCareplans.Any())
                warnings.Add(new PatientWarning { Type = WarningType.CAREPLAN, Text = "Please create a care plan" });
            activeCareplans.Where(x => x.ReviewDate > currentDate).ToList().ForEach(x =>
                warnings.Add(new PatientWarning
                { Type = WarningType.CAREPLAN, Text = $"Care plan {x.Title} review date is due." }));


            //service agreements
            var agreements =
                patientRecord.ServiceAgreements.Where(x =>
                    x.ValidFromDate <= currentDate && x.ValidToDate >= currentDate);
            if (!agreements.Any())
                warnings.Add(new PatientWarning
                { Type = WarningType.SERVICE_AGREEMENT, Text = "No service agreement in place" });


            //assessment
            var assessments =
                patientRecord.Assesments.Where(x => x.ValidFromDate <= currentDate && x.ValidToDate >= currentDate);
            if (!assessments.Any())
                warnings.Add(new PatientWarning { Type = WarningType.ASSESSMENT, Text = "No active Assessment found" });

            //

            return warnings;
        }

        #region Patient

        public async Task<ResponseViewModel> CreatePatient(Guid currentUserId, PatientRegisterRequestViewModel model)
        {
            //using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            //{
            try
            {
                var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();

                var carerRepo = _genericUnitOfWork.GetRepository<Carer, Guid>();

                var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();

                var provider = GetUserProvider(currentUserId);

                var checkUserByEmail = await _userManager.FindByEmailAsync(model.Email);
                if (checkUserByEmail != null)
                    throw new ArgumentException(ErrorMessage.EMAIL_ALREADY_EXISTS);

                var checkNdisExists = patientRepo.GetAll(x => x.NDISNumber == model.NDISNumber).ToList();
                if (checkNdisExists.Any())
                    throw new ArgumentException(ErrorMessage.NDIS_ALREADY_EXISTS);

                var randomPassword = SecurityService.CreateRandomPassword();

                var addressEntity = _mapper.Map<Address>(model.Address);

                var schoolAddressEntity = new Address();

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Address = addressEntity,
                    FullName = string.Join(" ", model.FirstName, model.LastName),
                    UserType = UserType.Client,
                    UserName = model.Email,
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    IsRegistrationComplete = false,
                    IsActive = true
                };

                user.Address.AddressType = "Client Address";

                var patient = new Patient
                {
                    UserId = user.Id,
                    Id = Guid.NewGuid(),
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Gender = model.Gender,
                    //Ethnicity = model.Ethnicity,
                    DateOfBirth = model.DateOfBirth,
                    NDISNumber = model.NDISNumber,
                    PreferredName = model.PreferredName,
                    Country = model.Country,
                    Language = model.Language,
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true,
                    HasCarer = model.HasCarer,
                    SchoolName = model.SchoolName,

                    SchoolTeacherName = model.SchoolTeacherName,
                    SchoolTeacherEmail = model.SchoolTeacherEmail,
                    SchoolPrimaryContact = model.SchoolPrimaryContact,
                    SchoolContactNumber = model.SchoolContactNumber,
                    SchoolEmail = model.SchoolEmail
                };

                if (model.SchoolAddress != null && !string.IsNullOrEmpty(model.SchoolAddress.Address))
                {
                    schoolAddressEntity = _mapper.Map<Address>(model.SchoolAddress);
                    patient.SchoolAddress = schoolAddressEntity;
                    patient.SchoolAddress.AddressType = AddressType.SchoolAddress.ToString();
                }


                var patientCarers = new List<Carer>();
                if (patient.HasCarer)
                {
                    //TODO: refactor this

                    var order = 1;
                    foreach (var custodianModel in model.GetAllCustodians())
                    {
                        var carerUserId = Guid.NewGuid();
                        var carerExists = carerRepo.FirstOrDefault(x => x.Email == custodianModel.Email.Trim());
                        if (carerExists == null)
                        {
                            var checkUserByEmailCarer = await _userManager.FindByEmailAsync(custodianModel.Email);
                            if (checkUserByEmailCarer != null &&
                                checkUserByEmailCarer.UserType == UserType.PrimaryCustodian)
                                throw new ArgumentException("Cannot Create Carer Email, Email Already Exists!");
                            var carerUser = new User
                            {
                                Id = carerUserId,
                                NormalizedEmail = custodianModel.Email.ToUpper(),
                                NormalizedUserName = custodianModel.Email.ToUpper(),
                                FullName = string.Join(" ", custodianModel.FirstName, custodianModel.LastName),
                                UserType = UserType.PrimaryCustodian,
                                UserName = custodianModel.Email,
                                Email = custodianModel.Email,
                                SecurityStamp = Guid.NewGuid().ToString()
                            };

                            var passwordHash = new PasswordHasher<User>().HashPassword(carerUser, randomPassword);
                            carerUser.PasswordHash = passwordHash;
                            userRepo.Add(carerUser);

                            var carer = new Carer
                            {
                                Id = Guid.NewGuid(),
                                Order = order++,
                                User = carerUser,
                                Email = custodianModel.Email,
                                FirstName = custodianModel.FirstName,
                                LastName = custodianModel.LastName,
                                Contact = custodianModel.Contact,
                                CreatedDate = GeneralService.CurrentDate,
                                CreatedById = currentUserId,
                                IsActive = true
                            };
                            carerRepo.Add(carer);

                            SetCarerPatients(carer, patient.Id, custodianModel.Relation, currentUserId);
                            patientCarers.Add(carer);
                        }
                        else
                        {
                            throw new ArgumentException("Carer Email Already Exists!");
                        }
                    }
                }


                //FHIR ---
                var result = _fhirPatientService.CreatePatient(patient);
                if (result.Success)
                {
                    patient.FhirResourceId = result.DataFirstItem().FhirResourceId;
                    patient.FhirResourceUri = result.DataFirstItem().FhirResourceUri;
                }
                else
                {
                    await _userManager.DeleteAsync(user);
                    throw new ArgumentException("Unable to save Patient data on FHIR Server");
                }

                var roleId = new Guid(ApplicationConstants.ParticipantRoleGuid);
                var roleName = _genericUnitOfWork.GetRepository<Role, Guid>().FirstOrDefault(x => x.Id == roleId).Name;
                var userResult = await _userManager.CreateAsync(user, randomPassword);
                var roleResult = await _userManager.AddToRoleAsync(user, roleName);

                if (userResult.Succeeded && roleResult.Succeeded)
                {
                    user = await _userManager.FindByNameAsync(user.UserName);
                    if (userResult.Succeeded)
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(JwtClaimTypes.Name, user.FullName)
                            //new Claim(JwtClaimTypes.PhoneNumber, user.PhoneNumber)
                        };

                        var claimaddresult = await _userManager.AddClaimsAsync(user, claims);

                        if (!claimaddresult.Succeeded) await _userManager.DeleteAsync(user);
                    }
                    else
                    {
                        await _userManager.DeleteAsync(user);
                    }
                }
                else
                {
                    throw new ArgumentException(userResult.Errors.FirstOrDefault().Description);
                }

                patientRepo.Add(patient);


                _genericUnitOfWork.SaveChanges();
                SetPatientRecordDefaultData(currentUserId, provider, patient);
                UpdatePatientRecordDetails(currentUserId, GetPatientRecord(currentUserId, patient.PublicId),
                    model.BillingDetails);


                // scope.Complete();

                #region Send  Email

                //find user to send the email: either user itself or primary carer/custodian
                var userToSendEmail = patientCarers.Count > 0 ? patientCarers[0].User : user;
                var todaysDate = GeneralService.CurrentDate;
                var userId = userToSendEmail.Id;
                var codeKey = userId + "," + todaysDate.AddDays(1).ToString("ddMMyyyyHHmmss");
                var code = _encryptionService.Encrypt(codeKey);

                var webServerHost = _careTaskrUrls.WebUrl;


                var emailModel = new PatientRegistrationViewModel
                {
                    FullName = model.HasCarer ? model.FirstName + " " + model.LastName : user.FullName,
                    Password = randomPassword,
                    CallBackUrl = $"{webServerHost}{UrlConstant.CONFIRM_EMAIL}{code}"
                };

                var html = _viewRender.Render(EmailTemplate.PATIENT_REGISTRATION, emailModel);
                await _emailService.SendEmailAsync(userToSendEmail.Email, "Welcome to Caretaskr", html);

                #endregion

                CreatePatientDefaultCarePlan(currentUserId, patient);

                return new ResponseViewModel<string> { Data = "", Success = true };
            }

            catch (Exception ex)
            {
                //scope.Dispose();
                throw new Exception(ex.Message);
            }


            //}
        }

        private void CreatePatientDefaultCarePlan(Guid currentUserId, Patient patient)
        {
            var model = new CreateCarePlanViewModel();
            model.BillingType = BillingType.SELF_MANAGED;
            model.DueDate = DateTime.MaxValue;
            model.FamilyGoals = new List<FamilyGoalsViewModel>();
            model.FundedSupport = new List<FundedSupportViewModel>();
            model.PatientId = patient.PublicId;
            model.Practitioners = new List<CareplanPractitionerViewModel>();
            model.StartDate = GeneralService.CurrentDate;
            model.Status = CareplanStatus.Active;
            model.Title = Constants.Strings.Careplan.DEFAULT_CARE_PLAN_TITLE; //<<<-  validate this
            model.KeyPractitionerId = currentUserId;
            CreateCarePlan(currentUserId, model, true);
        }


        public ResponseViewModel UpdatePatient(Guid currentUserId, UpdatePatientRequestViewModel model)
        {
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();

            var provider = GetUserProvider(currentUserId);

            var patient = GetEntity<Patient, Guid>(model.Id);

            var userEntity = userRepo.FirstOrDefault(x => x.Id == patient.UserId);

            var checkNdisExists =
                patientRepo.GetAll().Any(x => x.NDISNumber == model.NDISNumber && x.PublicId != model.Id);
            if (checkNdisExists)
                throw new ArgumentException("NDIS already Exists");

            SetPatientRecordDefaultData(currentUserId, provider,
                patient); //only need it here until the product stabilises

            var userMapped = _mapper.Map(model, userEntity);
            if (userMapped.AddressId == null)
            {
                userMapped.Address = _mapper.Map<Address>(model.Address);
            }

            userMapped.ModifiedById = currentUserId;
            userMapped.ModifiedDate = GeneralService.CurrentDate;


            userRepo.Update(userMapped);

            var patientMapped = _mapper.Map(model, patient);

            patientMapped.ModifiedById = currentUserId;
            patientMapped.ModifiedDate = GeneralService.CurrentDate;

            if (!string.IsNullOrEmpty(model.SchoolAddress?.Address))
            {
                var schoolAddressEntity = _mapper.Map<Address>(model.SchoolAddress);
                patient.SchoolAddress = schoolAddressEntity;
                patient.SchoolAddress.AddressType = AddressType.SchoolAddress.ToString();
            }
            else
            {
                patientMapped.SchoolAddressId = null;
            }


            patientRepo.Update(patient);


            var checkProviderExists =
                patient.PatientRecords.Any(c => c.PatientId == patient.Id && c.Provider == provider);
            if (!checkProviderExists) SetPatientRecordDefaultData(currentUserId, provider, patient);
            ;

            UpdatePatientRecordDetails(currentUserId, GetPatientRecord(currentUserId, patient.PublicId),
                model.BillingDetails);

            var isNewCarer = false;
            var randomPassword = string.Empty;

            //####
            foreach (var custodianModel in model.GetAllCustodians())
            {
                bool isNewCustodian;
                string custodianRandomPassword;
                SetCarer(currentUserId, custodianModel, patient, out isNewCustodian, out custodianRandomPassword);
                isNewCarer = isNewCarer ? isNewCarer : isNewCustodian;
                randomPassword = string.IsNullOrEmpty(randomPassword) ? custodianRandomPassword : randomPassword;
            }


            //FHIR --
            var result = _fhirPatientService.UpdatePatient(patient);
            if (!result.Success)
                throw new ArgumentException("Unable to update Patient data on FHIR Server");
            //FHIR --/

            _genericUnitOfWork.SaveChanges();
            if (isNewCarer && model.HasCarer)
            {
                #region Send  Email

                var emailModel = new PatientRegistrationViewModel
                {
                    FullName =
                        string.Join(" ", model.Custodians.Primary?.FirstName, model.Custodians.Primary?.LastName),
                    Password = randomPassword
                };
                var email = model.Custodians.Primary?.Email;

                var html = _viewRender.Render(EmailTemplate.PATIENT_REGISTRATION, emailModel);
                _emailService.SendEmailAsync(email, "CareTaskr : Carer", html);

                #endregion
            }

            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        private void UpdatePatientRecordDetails(Guid currentUserId, PatientRecord patientRecord,
            BillingDetailsViewModel billingDetails)
        {
            patientRecord.BillingDetails = _mapper.Map(billingDetails, patientRecord.BillingDetails);
            patientRecord.ModifiedById = currentUserId;
            patientRecord.ModifiedDate = GeneralService.CurrentDate;
            UpdateEntity<PatientRecord, int>(patientRecord);
        }


        //for edit
        public ResponseViewModel<PatientResponseViewModel> GetPatientById(Guid currentUserId, Guid id)
        {
            var repo = _genericUnitOfWork.GetRepository<Patient, Guid>();

            var carerPatientRepo = _genericUnitOfWork.GetRepository<CarerPatient, Guid>();
            var patient = repo.FirstOrDefault(c => c.PublicId == id);

            if (patient == null)
                throw new ArgumentException("Patient does not exists");


            _fhirPatientService.EnrichPatient(ref patient);

            var patientResponse = _mapper.Map<Patient, PatientResponseViewModel>(patient);
            //TODO: method to enrich patient with other patirentrecord data
            patientResponse.BillingDetails =
                _mapper.Map<BillingDetailsViewModel>(GetPatientRecord(currentUserId, patient.PublicId)?.BillingDetails);
            patientResponse.AvatarUrl = GetUserProfilePictureUrl(patient.UserId); //TODO: <-- needs refactor
            patientResponse.RemainingFunds =
                _billingService.GetRemainingFunds(GetPatientRecord(currentUserId, id)); //TODO: <-- needs refactor


            if (patient.HasCarer)
            {
                var isPrimary = true;
                foreach (var carerPatient in patient.CarerPatients.OrderBy(x => x.Carer.Order == 0)
                    .ThenBy(x => x.Carer.Order))
                {
                    var custodianVM = new PatientCustodianViewModel
                    {
                        FirstName = carerPatient.Carer.FirstName,
                        LastName = carerPatient.Carer.LastName,
                        Relation = carerPatient.Relation,
                        Contact = carerPatient.Carer.Contact,
                        Email = carerPatient.Carer.Email
                    };
                    if (isPrimary)
                    {
                        isPrimary = false;
                        patientResponse.Custodians.Primary = custodianVM;
                    }
                    else
                    {
                        patientResponse.Custodians.Secondary.Add(custodianVM);
                    }
                }
            }

            patientResponse.Warnings =
                _mapper.Map<List<PatientWarningViewModel>>(
                    GetPatientRecordWarnings(GetPatientRecord(currentUserId, patient.PublicId)));


            return new ResponseViewModel<PatientResponseViewModel> { Data = patientResponse, Success = true };
        }

        //details
        public ResponseViewModel<PatientDetailsResponseViewModel> GetPatientDetailsById(Guid currentUserId, Guid id)
        {
            var repo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var currentDate = GeneralService.CurrentDate;
            var carerPatientRepo = _genericUnitOfWork.GetRepository<CarerPatient, Guid>();

            var patient = repo.FirstOrDefault(c => c.PublicId == id);

            if (patient == null)
                throw new ArgumentException("Patient does not exists");

            var carePlanList = _mapper.Map<List<CarePlanListViewModel>>(
                _genericUnitOfWork.GetRepository<Careplan, int>()
                    .GetAll(x => x.IsActive && x.PatientRecord.PatientId == patient.Id).ToList()
            );
            var allergiesList = _mapper.Map<List<AllergiesListViewModel>>(
                _genericUnitOfWork.GetRepository<Allergies, Guid>().GetAll(x => x.IsActive && x.PatientId == patient.Id)
                    .ToList()
            );
            var medicationsList = _mapper.Map<List<MedicationListViewModel>>(
                _genericUnitOfWork.GetRepository<Medication, Guid>()
                    .GetAll(x => x.IsActive && x.PatientId == patient.Id).ToList()
            );

            var timeEntryList = _mapper.Map<List<TimeEntryViewModel>>(
                _genericUnitOfWork.GetRepository<TimeEntry, int>()
                    .GetAll(x => x.IsActive && x.Careplan.PatientRecord.PatientId == patient.Id).ToList()
            );

            var country = _genericUnitOfWork.GetRepository<Country, int>()
                .FirstOrDefault(x => x.CountryCode == patient.Country);
            //FHIR --

            _fhirPatientService.EnrichPatient(ref patient);
            //FHIR --/ 

            var patientResponse = _mapper.Map<Patient, PatientDetailsResponseViewModel>(patient);

            //enrich with patientRecord data (create a method for this)
            patientResponse.BillingDetails =
                _mapper.Map<BillingDetailsViewModel>(GetPatientRecord(currentUserId, patient.PublicId)?.BillingDetails);
            patientResponse.AvatarUrl = GetUserProfilePictureUrl(patient.UserId); //TODO: <-- needs refactor
            patientResponse.RemainingFunds =
                _billingService.GetRemainingFunds(GetPatientRecord(currentUserId, id)); //TODO: <-- needs refactor


            if (patient.HasCarer)
            {
                var isPrimary = true;
                foreach (var carerPatient in patient.CarerPatients.OrderBy(x => x.Carer.Order == 0)
                    .ThenBy(x => x.Carer.Order))
                {
                    var custodianVM = new PatientCustodianViewModel
                    {
                        FirstName = carerPatient.Carer.FirstName,
                        LastName = carerPatient.Carer.LastName,
                        Relation = carerPatient.Relation,
                        Contact = carerPatient.Carer.Contact,
                        Email = carerPatient.Carer.Email
                    };
                    if (isPrimary)
                    {
                        isPrimary = false;
                        patientResponse.Custodians.Primary = custodianVM;
                    }
                    else
                    {
                        patientResponse.Custodians.Secondary.Add(custodianVM);
                    }
                }
            }

            patientResponse.CarePlans = carePlanList;
            patientResponse.Allergies = ExtractAllergiesByPatient(allergiesList);
            patientResponse.Medications = ExtractMedicationByPatient(medicationsList);

            //get from patient and appointment
            //patientResponse.Assesments = ListAssessmentByPatient(id);
            //patientResponse.Observations = ListObservationByPatient(id);
            //patientResponse.TreatmentNotes = ListTreatmentNoteByPatient(id);
            patientResponse.TimeEntry = timeEntryList;

            var upcomingApointment = PatientUpcomingAppointment(patient.Id);
            patientResponse.NextAppointment = upcomingApointment.FirstOrDefault();

            patientResponse.NextAppointments = upcomingApointment;

            patientResponse.Warnings =
                _mapper.Map<List<PatientWarningViewModel>>(
                    GetPatientRecordWarnings(GetPatientRecord(currentUserId, patient.PublicId)));


            return new ResponseViewModel<PatientDetailsResponseViewModel> { Data = patientResponse, Success = true };
        }

        private List<AppointmentResponseViewModel> PatientUpcomingAppointment(Guid patientId)
        {
            var appointmetRepo = _genericUnitOfWork.GetRepository<Appointment, Guid>();
            var currentDate = GeneralService.CurrentDate;

            Expression<Func<Appointment, bool>> expression = c => c.PatientRecord.PatientId == patientId
                                                                  && c.AppointmentDate.Date >= currentDate.Date
                                                                  && c.AppointmentStatus != AppointmentStatus.Canceled;


            var appointmentList = appointmetRepo.GetAll(expression).OrderBy(t => t.AppointmentDate);
            var result = _mapper.Map<List<AppointmentResponseViewModel>>(appointmentList.ToList());
            return result;
        }

        public ResponseViewModel DeletePatient(Guid currentUserId, Guid patientId)
        {
            var currentDate = GeneralService.CurrentDate;
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();

            var patient = patientRepo.FirstOrDefault(x => x.PublicId == patientId);
            if (patient == null)
                throw new ArgumentException("Patient Does not exists");


            patient.IsActive = false;
            patient.NDISNumber = patient.NDISNumber;
            patient.ModifiedById = currentUserId;
            patient.ModifiedDate = currentDate;

            patientRepo.Update(patient);

            _genericUnitOfWork.SaveChanges();


            return new ResponseViewModel { Success = true };
        }


        public DataSourceResult ListPatient(Guid currentUserId, DataRequestModel dataRequest)
        {
            var provider = GetUserProvider(currentUserId);
            Expression<Func<Patient, bool>> expression = c => c.PatientRecords.Any(p => p.Provider == provider);

            var queryable = _genericUnitOfWork.GetRepository<Patient, Guid>().GetAll(expression);
            if (dataRequest.Filter != null)
                if (dataRequest.Filter.ContainsKey("name") && dataRequest.Filter["name"] != null)

                {
                    var filter = dataRequest.Filter["name"];
                    queryable = queryable.Where(p =>
                        p.User.FullName.Contains(filter) || p.User.FirstName.Contains(filter) ||
                        p.User.LastName.Contains(filter)
                        || p.User.Email.Contains(filter)
                        || p.NDISNumber.Contains(filter));
                }

            var result = queryable.ToList();
            _fhirPatientService.EnrichPatient(ref result);

            foreach (var r in result)
                r.Warnings = GetPatientRecordWarnings(GetPatientRecord(currentUserId, r.PublicId));

            var finalResult = result.AsQueryable().ToDataSourceResult<Patient, PatientListResponseViewModel>(_mapper, dataRequest,
                   new Sort { Field = "CreatedDate", Direction = SortOrder.DESCENDING });

            return finalResult;
            //return new DataResult<PatientListResponseViewModel>(
            //    _mapper.Map<ICollection<PatientListResponseViewModel>>(result));
        }


        public ResponseViewModel<PatientProfileResponseViewModel> GetLoggedInPatientDetails(Guid currentUserId)
        {
            var repo = _genericUnitOfWork.GetRepository<Patient, Guid>();

            var patientResponse = repo.FirstOrDefault(x => x.UserId == currentUserId);
            if (patientResponse == null)
                throw new ArgumentException("Invalid Patient");

            var result = _mapper.Map<PatientProfileResponseViewModel>(patientResponse);

            return new ResponseViewModel<PatientProfileResponseViewModel> { Data = result, Success = true };
        }

        #endregion

        #region Medication

        public ResponseViewModel CreateMedication(Guid currentUserId, CreateMedicationRequestViewModel model)
        {
            var patientId = GetPatientId(currentUserId);
            var medicationRepo = _genericUnitOfWork.GetRepository<Medication, Guid>();

            var medication = new Medication
            {
                Id = Guid.NewGuid(),
                Manufacturer = model.Manufacturer,
                Medicine = model.Medicine,
                FormOfMedicine = model.FormOfMedicine,
                Amount = model.Amount,
                Frequency = model.Frequency,
                ExpirationDate = model.ExpirationDate,
                PatientId = patientId,

                CreatedDate = GeneralService.CurrentDate,
                CreatedById = currentUserId,
                IsActive = true
            };

            medicationRepo.Add(medication);

            //FHIR ---
            var result = _fhirMedicationService.CreateMedication(medication);
            if (result.Success)
            {
                medication.FhirResourceId = result.Get(medication.Id).FhirResourceId;
                medication.FhirResourceUri = result.Get(medication.Id).FhirResourceUri;
            }
            else
            {
                throw new ArgumentException("Unable to save Medication data on FHIR Server");
            }
            //FHIR --/


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<MedicationListViewModel>
            { Data = _mapper.Map<MedicationListViewModel>(medication), Success = true };
        }

        public DataSourceResult ListMedication(Guid currentUserId, DataRequestModel dataRequest)
        {
            var patientId = GetPatientId(currentUserId);
            var queryable = _genericUnitOfWork.GetRepository<Medication, Guid>().GetAll()
                .Where(x => x.Patient.Id == patientId).AsQueryable();

            var result = queryable.ToDataSourceResult<Medication, MedicationListViewModel>(_mapper, dataRequest,
                new Sort { Field = "Medicine", Direction = SortOrder.ASCENDING });

            //TODO: find a proper way of creating an enricher, probably passing on the Fhir service to DataSourceResult!
            var fResourceIdLst = new List<Guid>();
            foreach (MedicationListViewModel r in result.Data)
                fResourceIdLst.Add(GetInternalId<Medication, Guid>(r.Id));
            var medicationLst = _fhirMedicationService.GetMedicationLst(fResourceIdLst);
            foreach (MedicationListViewModel r in result.Data)
            {
                var medication = (Medication)medicationLst.DataHash[GetInternalId<Medication, Guid>(r.Id)];
                r.Medicine = medication.Medicine;
                r.FormOfMedicine = medication.FormOfMedicine;
                r.Amount = medication.Amount;
                r.ExpirationDate = medication.ExpirationDate;
                r.Manufacturer = medication.Manufacturer;
            }

            return result;
        }

        private List<MedicationListViewModel> ExtractMedicationByPatient(List<MedicationListViewModel> result)
        {
            var fResourceIdLst = new List<Guid>();
            foreach (var r in result) fResourceIdLst.Add(GetInternalId<Medication, Guid>(r.Id));

            var medicationLst = _fhirMedicationService.GetMedicationLst(fResourceIdLst);
            foreach (var r in result)
            {
                var medication = (Medication)medicationLst.DataHash[GetInternalId<Medication, Guid>(r.Id)];
                r.Medicine = medication.Medicine;
                r.FormOfMedicine = medication.FormOfMedicine;
                r.Amount = medication.Amount;
                r.ExpirationDate = medication.ExpirationDate;
                r.Manufacturer = medication.Manufacturer;
            }

            return result;
        }

        private List<AllergiesListViewModel> ExtractAllergiesByPatient(List<AllergiesListViewModel> result)
        {
            var fResourceIds = new List<Guid>();
            foreach (var r in result) fResourceIds.Add(GetInternalId<Allergies, Guid>(r.Id));
            var allergyResult = _fhirClinicalInfoService.GetAllergy(fResourceIds);
            foreach (var r in result)
            {
                var allergy = (Allergies)allergyResult.DataHash[GetInternalId<Allergies, Guid>(r.Id)];
                r.Allergen = allergy.Allergen;
                r.ClinicalStatus = allergy.ClinicalStatus.ToString();
                r.Critical = allergy.Critical.ToString();
                r.LastOccurenceDate = allergy.LastOccurenceDate;
            }

            return result;
        }


        public ResponseViewModel DeleteMedication(Guid currentUserId, Guid medicationId)
        {
            var patientId = GetPatientId(currentUserId);
            var medicationRepo = _genericUnitOfWork.GetRepository<Medication, Guid>();
            var medicationEntity = medicationRepo.FirstOrDefault(x => x.PublicId == medicationId);

            if (medicationEntity == null || medicationEntity.PatientId != patientId)
                throw new ArgumentException("Medication Does not exist");


            medicationEntity.ModifiedById = currentUserId;
            medicationEntity.ModifiedDate = GeneralService.CurrentDate;
            medicationEntity.IsActive = false;
            medicationRepo.Update(medicationEntity);

            //FHIR ---
            var result = _fhirMedicationService.DeleteMedication(medicationEntity.Id);
            if (!result.Success) throw new ArgumentException("Unable to delete Medication on FHIR Server");
            //FHIR --/

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel { Success = true };
        }

        public ResponseViewModel CreateAllergies(Guid currentUserId, CreateAllergiesRequestViewModel model)
        {
            var patientId = GetPatientId(currentUserId);
            var allergiesRepo = _genericUnitOfWork.GetRepository<Allergies, Guid>();


            var allergy = new Allergies
            {
                Id = Guid.NewGuid(),
                ClinicalStatus = model.ClinicalStatus,
                Category = model.Category,
                Critical = model.Critical,
                LastOccurenceDate = model.LastOccurenceDate,
                Allergen = model.Allergen,
                PatientId = patientId,
                CreatedDate = GeneralService.CurrentDate,
                CreatedById = currentUserId,
                IsActive = true
            };

            allergiesRepo.Add(allergy);

            //FHIR ---
            var result = _fhirClinicalInfoService.CreateAllergy(allergy);
            if (result.Success)
            {
                allergy.FhirResourceId = result.DataFirstItem().FhirResourceId;
                allergy.FhirResourceUri = result.DataFirstItem().FhirResourceUri;
            }
            else
            {
                throw new ArgumentException("Unable to save Patient data on FHIR Server");
            }
            //FHIR --/


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<AllergiesListViewModel>
            { Data = _mapper.Map<AllergiesListViewModel>(allergy), Success = true };
        }

        public DataSourceResult ListAllergies(Guid currentUserId, DataRequestModel dataRequest)
        {
            var patientId = GetPatientId(currentUserId);

            var queryable = _genericUnitOfWork.GetRepository<Allergies, Guid>().GetAll()
                .Where(x => x.Patient.Id == patientId).AsQueryable();

            var result = queryable.ToDataSourceResult<Allergies, AllergiesListViewModel>(_mapper, dataRequest,
                new Sort { Field = "ClinicalStatus", Direction = SortOrder.ASCENDING });

            //TODO: find a proper way of creating an enricher, probably passing on the Fhir service to DataSourceResult!
            var fResourceIds = new List<Guid>();
            foreach (AllergiesListViewModel r in result.Data) fResourceIds.Add(GetInternalId<Allergies, Guid>(r.Id));
            var allergyResult = _fhirClinicalInfoService.GetAllergy(fResourceIds);
            foreach (AllergiesListViewModel r in result.Data)
            {
                var allergy = (Allergies)allergyResult.DataHash[GetInternalId<Allergies, Guid>(r.Id)];
                r.Allergen = allergy.Allergen;
                r.ClinicalStatus = allergy.ClinicalStatus.ToString();
                r.Critical = allergy.Critical.ToString();
                r.LastOccurenceDate = allergy.LastOccurenceDate;
            }

            return result;
        }

        public ResponseViewModel DeleteAllergy(Guid currentUserId, Guid allergyId)
        {
            var patientId = GetPatientId(currentUserId);
            var allergiesRepo = _genericUnitOfWork.GetRepository<Allergies, Guid>();

            var allergiesEntity = allergiesRepo.FirstOrDefault(x => x.PublicId == allergyId);
            if (allergiesEntity == null || allergiesEntity.PatientId != patientId)
                throw new ArgumentException("Allergies Does not exist");

            allergiesEntity.ModifiedById = currentUserId;
            allergiesEntity.ModifiedDate = GeneralService.CurrentDate;
            allergiesEntity.IsActive = false;
            allergiesRepo.Update(allergiesEntity);

            //FHIR ---
            //var result = _fhirClinicalInfoService.DeleteAllergy(allergyId);
            //if (!result.Success)
            //{
            //    throw new ArgumentException("Unable to delete Allergy on FHIR Server");
            //}
            //FHIR --/

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel { Success = true };
        }

        #endregion

        #region Assessments

        public ResponseViewModel CreateUpdateAssesment(Guid currentUserId, AssesmentRequestViewModel model)
        {
            Assesment assesment;
            if (model.Id != null)
            {
                //UPDATE
                assesment = GetEntity<Assesment, int>((Guid)model.Id);
                assesment.ModifiedById = currentUserId;
                assesment.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                assesment = new Assesment
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    PatientRecord = GetPatientRecord(currentUserId, model.PatientId)
                };
            }


            assesment = _mapper.Map(model, assesment);


            if (model.FilesToUpload != null)
            {
                if (assesment.Files == null)
                    assesment.Files = new List<PatientRecordFile>();
                var filesUploaded = _fileService.Upload(currentUserId, assesment.PatientRecord, model.FilesToUpload,
                    PatientRecordFileType.Assessment);
                assesment.Files = assesment.Files.Concat(filesUploaded).ToList();
            }

            if (model.Id == null)
                AddEntity<Assesment, int>(assesment);
            else
                UpdateEntity<Assesment, int>(assesment);

            return new ResponseViewModel<AssesmentViewModel>
            { Data = _mapper.Map<AssesmentViewModel>(assesment), Success = true };
        }

        public ResponseViewModel DeleteAssesment(Guid currentUserId, Guid assessmentId)
        {
            var assesment = GetEntity<Assesment, int>(assessmentId);

            //TODO: validate if user has access  to the assesment;
            if (assesment.Files != null)
                assesment.Files.ToList().ForEach(x => DeleteEntity<PatientRecordFile, int>(currentUserId, x.PublicId));
            DeleteEntity<Assesment, int>(currentUserId, assesment.PublicId);

            return new ResponseViewModel { Success = true };
        }

        public ResponseViewModel GetAssesment(Guid currentUserId, Guid assesmentId)
        {
            var assesment = GetEntity<Assesment, int>(assesmentId);
            return new ResponseViewModel<AssesmentViewModel>
            { Data = _mapper.Map<AssesmentViewModel>(assesment), Success = true };
        }


        public DataSourceResult ListAssesments(Guid currentUserId, Guid patientId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<Assesment, Guid>().GetAll()
                .Where(x => x.PatientRecord.Patient.PublicId == patientId).AsQueryable();

            var result = queryable.ToDataSourceResult<Assesment, AssesmentViewModel>(_mapper, dataRequest,
                new Sort { Field = "", Direction = SortOrder.ASCENDING });

            return result;
        }

        #endregion

        #region Service Agreeemnts

        public ResponseViewModel CreateUpdateServiceAgreement(Guid currentUserId,
            ServiceAgreementRequestViewModel model)
        {
            ServiceAgreement serviceAgreement;
            if (model.Id != null)
            {
                //UPDATE
                serviceAgreement = GetEntity<ServiceAgreement, int>((Guid)model.Id);
                serviceAgreement.ModifiedById = currentUserId;
                serviceAgreement.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                serviceAgreement = new ServiceAgreement
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    PatientRecord = GetPatientRecord(currentUserId, model.PatientId)
                };
            }


            serviceAgreement = _mapper.Map(model, serviceAgreement);


            if (model.FilesToUpload != null)
            {
                if (serviceAgreement.Files == null)
                    serviceAgreement.Files = new List<PatientRecordFile>();

                var filesUploaded = _fileService.Upload(currentUserId, serviceAgreement.PatientRecord,
                    model.FilesToUpload, PatientRecordFileType.Service_Agreement);
                serviceAgreement.Files = serviceAgreement.Files.Concat(filesUploaded).ToList();
            }

            if (model.Id == null)
                AddEntity<ServiceAgreement, int>(serviceAgreement);
            else
                UpdateEntity<ServiceAgreement, int>(serviceAgreement);

            return new ResponseViewModel<ServiceAgreementViewModel>
            { Data = _mapper.Map<ServiceAgreementViewModel>(serviceAgreement), Success = true };
        }

        public ResponseViewModel DeleteServiceAgreement(Guid currentUserId, Guid assessmentId)
        {
            var serviceAgreement = GetEntity<ServiceAgreement, int>(assessmentId);

            //TODO: validate if user has access  to the serviceAgreement;
            if (serviceAgreement.Files != null)
                serviceAgreement.Files.ToList()
                    .ForEach(x => DeleteEntity<PatientRecordFile, int>(currentUserId, x.PublicId));
            DeleteEntity<ServiceAgreement, int>(currentUserId, serviceAgreement.PublicId);

            return new ResponseViewModel { Success = true };
        }

        public ResponseViewModel GetServiceAgreement(Guid currentUserId, Guid serviceAgreementId)
        {
            var serviceAgreement = GetEntity<ServiceAgreement, int>(serviceAgreementId);
            return new ResponseViewModel<ServiceAgreementViewModel>
            { Data = _mapper.Map<ServiceAgreementViewModel>(serviceAgreement), Success = true };
        }


        public DataSourceResult ListServiceAgreements(Guid currentUserId, Guid patientId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<ServiceAgreement, Guid>().GetAll()
                .Where(x => x.PatientRecord.Patient.PublicId == patientId).AsQueryable();

            var result = queryable.ToDataSourceResult<ServiceAgreement, ServiceAgreementViewModel>(_mapper, dataRequest,
                new Sort { Field = "", Direction = SortOrder.ASCENDING });

            return result;
        }

        #endregion

        #region Observations

        public ResponseViewModel SaveObservation(Guid currentUserId, SavePatientObservationViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
            var observationRepo = _genericUnitOfWork.GetRepository<Observation, Guid>();

            var observationEntity =
                patientRepo.FirstOrDefault(x => x.Id == GetInternalId<Patient, Guid>(model.PatientId));
            if (observationEntity == null)
                throw new ArgumentException("Patient Does not Exists");

            var observation = new Observation
            {
                Id = Guid.NewGuid(),
                PatientRecord = GetPatientRecord(currentUserId, model.PatientId),
                Text = model.Observation,
                Date = currentDate,
                CreatedDate = currentDate,
                CreatedById = currentUserId
            };

            observationRepo.Add(observation);

            //FHIR ---
            var result = _fhirDiagnosticsService.CreateObservation(observation);
            if (result.Success)
            {
                var r = result.Get(observation.Id);
                observation.FhirResourceId = result.Get(observation.Id).FhirResourceId;
                observation.FhirResourceUri = result.Get(observation.Id).FhirResourceUri;
            }
            else
            {
                throw new ArgumentException("Unable to save Observation data on FHIR Server");
            }
            //FHIR --/


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<PatientObservationViewModel>
            { Data = _mapper.Map<PatientObservationViewModel>(observation), Success = true };
        }

        /*
        public List<PatientObservationListViewModel> ListObservationByPatient(Guid patientId)
        {
            var observationList = _genericUnitOfWork.GetRepository<Observation, Guid>().GetAll()
                .Where(x => x.PatientRecord.Patient.PublicId == patientId).ToList();

            var appointmentNoteList = _genericUnitOfWork.GetRepository<AppointmentNote, int>().GetAll(x =>
                x.NoteTypeId == NoteType.Observation
                && x.Appointment.PatientRecord.Patient.PublicId == patientId).ToList();

            var result = new List<PatientObservationListViewModel>();

            //TODO: find a proper way of creating an enricher, probably passing on the Fhir service to DataSourceResult!
            var fResourceIds = new List<Guid>();
            foreach (var r in observationList) fResourceIds.Add(r.Id);
            var observationResult = _fhirDiagnosticsService.GetObservationLst(fResourceIds);
            foreach (var r in observationList)
            {
                var observation = observationResult.Get(r.Id);
                r.Text = observation.Text;
            }

            observationList.ForEach(q =>
            {
                var patientObservation = new PatientObservationListViewModel
                {
                    Practitioner = "N/A",
                    Observation = q.Text
                };
                result.Add(patientObservation);
            });

            appointmentNoteList.ForEach(q =>
            {
                var patientAppointmentObservations = new PatientObservationListViewModel
                {
                    Practitioner = q.Appointment.Practitioner.FullName,
                    Observation = q.Note,
                    AppointmentDate = q.Appointment.AppointmentDate
                };
                result.Add(patientAppointmentObservations);
            });

            return result;
        }
        */
        #endregion

        #region Treatment Note

        //public ResponseViewModel SaveAssessment(SavePatientAssessmentViewModel model)
        //{
        //    var currentDate = GeneralService.CurrentDate;
        //    var patientRepo = _genericUnitOfWork.GetRepository<Patient, int>();
        //    var patientNoteRepo = _genericUnitOfWork.GetRepository<PatientNote, int>();
        //    var currentUserId = CustomHttpContext.GetUserLoginInfo().UserId;

        //    var patientEntity = patientRepo.FirstOrDefault(x => x.Id == model.PatientId);
        //    if (patientEntity == null)
        //        throw new ArgumentException("Patient Does not Exists");

        //    var patientNote = new PatientNote
        //    {
        //        PatientId = model.PatientId,
        //        NoteType = NoteType.Assessment.ToString(),
        //        NoteTypeId = NoteType.Assessment,
        //        Note = model.Assessment,
        //        CreatedDate = currentDate,
        //        CreatedById = currentUserId
        //    };

        //    patientNoteRepo.Add(patientNote);

        //    _genericUnitOfWork.SaveChanges();
        //    return new ResponseViewModel<string>() { Model = "", Success = true };
        //}
        /* review requirements
        public ResponseViewModel SaveTreatmentNote(Guid currentUserId, SavePatientTreatmentNoteViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, int>();
            var patientNoteRepo = _genericUnitOfWork.GetRepository<PatientNote, int>();


            var patientEntity = patientRepo.FirstOrDefault(x => x.PublicId == model.PatientId);
            if (patientEntity == null)
                throw new ArgumentException("Patient Does not Exists");

            var patientNote = new PatientNote
            {
                PatientRecord = GetPatientRecord(currentUserId, model.PatientId),
                NoteType = NoteType.TreatmentNote.ToString(),
                NoteTypeId = NoteType.TreatmentNote,
                Note = model.TreatmentNote,
                CreatedDate = currentDate,
                CreatedById = currentUserId
            };

            patientNoteRepo.Add(patientNote);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<PatientTreatmentNoteViewModel>
                {Data = _mapper.Map<PatientTreatmentNoteViewModel>(patientNote), Success = true};
        }

        public List<PatientTreatmentNoteListViewModel> ListTreatmentNoteByPatient(Guid patientId)
        {
            var patientTreatmentNoteList = _genericUnitOfWork.GetRepository<PatientNote, Guid>().GetAll().Where(
                x => x.PatientRecord.Patient.PublicId == patientId && x.NoteTypeId == NoteType.TreatmentNote
            ).ToList();
            var appointmentNoteList = _genericUnitOfWork.GetRepository<AppointmentNote, int>().GetAll(x =>
                x.NoteTypeId == NoteType.TreatmentNote
                && x.Appointment.PatientRecord.Patient.PublicId == patientId).ToList();

            var result = new List<PatientTreatmentNoteListViewModel>();


            patientTreatmentNoteList.ForEach(q =>
            {
                var patientTreatmentNote = new PatientTreatmentNoteListViewModel
                {
                    Practitioner = "N/A",
                    TreatmentNote = q.Note
                };
                result.Add(patientTreatmentNote);
            });

            appointmentNoteList.ForEach(q =>
            {
                var appointmentNote = new PatientTreatmentNoteListViewModel
                {
                    Practitioner = q.Appointment.Practitioner.FullName,
                    TreatmentNote = q.Note,
                    AppointmentDate = q.Appointment.AppointmentDate
                };
                result.Add(appointmentNote);
            });

            return result;
        }
        */
        #endregion

        #region Budget

        public ResponseViewModel CreateBudget(Guid currentUserId, CreateBudgetViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var patientId = GetPatientId(currentUserId);
            var budgetRepo = _genericUnitOfWork.GetRepository<Budget, int>();

            var budgetEntity =
                budgetRepo.GetAll().Any(x => x.BudgetName == model.BudgetName && x.PatientId == patientId);
            if (budgetEntity)
                throw new ArgumentException("Budget Name already exists");

            var budget = new Budget
            {
                PatientId = patientId,
                BudgetName = model.BudgetName,
                SourceOfBudget = model.SourceOfBudget,
                TotalBudget = model.TotalBudget,
                RemainingBudget = model.TotalBudget,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                CreatedDate = currentDate,
                ModifiedDate = currentDate,
                CreatedById = currentUserId,
                IsActive = true
            };

            budgetRepo.Add(budget);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<ListBudgetViewModel>
            { Data = _mapper.Map<ListBudgetViewModel>(budget), Success = true };
        }


        public ResponseViewModel DeleteBudget(Guid currentUserId, Guid budgetId)
        {
            var currentDate = GeneralService.CurrentDate;
            var budgetRepo = _genericUnitOfWork.GetRepository<Budget, int>();
            var fundedSupportRepo = _genericUnitOfWork.GetRepository<FundedSupport, int>();


            var budgetEntity = budgetRepo.FirstOrDefault(x => x.PublicId == budgetId);
            if (budgetEntity == null)
                throw new ArgumentException("Budget does not exists");

            var fundedSupportEntity = fundedSupportRepo.GetAll().Any(x => x.BudgetPlanId == budgetEntity.Id);

            if (fundedSupportEntity)
                throw new ArgumentException("Budget cannot be deleted Used By Careplan");

            budgetEntity.IsActive = false;
            budgetEntity.ModifiedDate = currentDate;
            budgetEntity.ModifiedById = currentUserId;


            budgetRepo.Update(budgetEntity);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel { Success = true };
        }

        public ResponseViewModel<List<ListBudgetViewModel>> ListBudgets(Guid currentUserId)
        {
            var currentDate = GeneralService.CurrentDate;
            var budgetRepo = _genericUnitOfWork.GetRepository<Budget, int>();
            var patientId = GetPatientId(currentUserId);

            var budgetEntity = budgetRepo.GetAll(x => x.PatientId == patientId);
            if (budgetEntity == null)
                throw new ArgumentException("Budget does not exists");

            var result = _mapper.Map<List<ListBudgetViewModel>>(budgetEntity);

            return new ResponseViewModel<List<ListBudgetViewModel>> { Success = true, Data = result };
        }

        #endregion

        #region Care Plan

        public ResponseViewModel ImportCarePlan(string documentUri)
        {
            FormRecognizerService.ImportCarePlanAsync(documentUri, "", "");

            return new ResponseViewModel();
        }


        public ResponseViewModel CreateCarePlan(Guid currentUserId, CreateCarePlanViewModel model,
            bool isDefaultCarePlan = false)
        {
            var carePlanRepo = _genericUnitOfWork.GetRepository<Careplan, int>();

            var patientRecord = GetPatientRecord(currentUserId, model.PatientId);

            var carePlanEntity = carePlanRepo.GetAll().Any(x => x.Title == model.Title
                                                                && x.PatientRecord == patientRecord
                                                                && x.IsActive);
            var fundedSupportRepo = _genericUnitOfWork.GetRepository<FundedSupport, int>();
            var budgetsRepo = _genericUnitOfWork.GetRepository<Budget, int>();

            if (carePlanEntity)
                throw new ArgumentException("Title already exists");

            var currentDate = GeneralService.CurrentDate;
            var carePlan = new Careplan
            {
                BillingType = model.BillingType,
                TotalBudget = model.TotalBudget,
                PatientRecord = patientRecord,
                Title = model.Title,
                ServiceBookingReference = model.ServiceBookingReference,
                StartDate = model.StartDate,
                Status = model.Status,
                DueDate = model.DueDate,
                ReviewDate = model.DueDate.HasValue
                    ? ((DateTime)model.DueDate).AddDays(-Careplan.REVIEW_WARNING_IN_DAYS)
                    : model.DueDate,
                KeyPractitionerId = model.KeyPractitionerId,
                isDefault = isDefaultCarePlan,
                CreatedDate = currentDate,
                CreatedById = currentUserId
            };

            carePlanRepo.Add(carePlan);

            foreach (var practitioner in model.Practitioners)
                carePlan.Practitioners.Add(new CareplanPractitioner
                {
                    UserId = (Guid)practitioner.Id,
                    Careplan = carePlan
                });

            foreach (var familyGoal in model.FamilyGoals)
            {
                CareplanFamilyGoal fGoal;

                fGoal = new CareplanFamilyGoal
                {
                    CarePlan = carePlan,
                    Title = familyGoal.Title,
                    Support = familyGoal.Support,
                    Strategy = familyGoal.Strategy,
                    CreatedDate = currentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
                carePlan.FamilyGoals.Add(fGoal);

                foreach (var shortTermGoal in familyGoal.ShortTermGoals)
                {
                    CareplanShortTermGoal stGoal;

                    if (!(string.IsNullOrEmpty(shortTermGoal.Title) &&
                          string.IsNullOrEmpty(shortTermGoal.OutcomeDetail) &&
                          string.IsNullOrEmpty(shortTermGoal.Strategy)
                          && string.IsNullOrEmpty(shortTermGoal.Description) && shortTermGoal.Outcome == null))
                    {
                        stGoal = new CareplanShortTermGoal
                        {
                            CarePlanFamilyGoal = fGoal,
                            CreatedDate = currentDate,
                            CreatedById = currentUserId,
                            IsActive = true,
                            Title = shortTermGoal.Title,
                            Description = shortTermGoal.Description,
                            Strategy = shortTermGoal.Strategy,
                            Outcome = (CareplanGoalOutcome?)shortTermGoal.Outcome,
                            OutcomeDetail = shortTermGoal.OutcomeDetail
                        };

                        fGoal.ShortTermGoals.Add(stGoal);
                    }
                }
            }
            /*
            if (model.FundedSupport.Count > 0)
                //NOTE : Removed for now

                //var diffCareplanFundedSupport = fundedSupportRepo.GetAll(x => x.IsActive).ToList();

                //var fundedSupportGroupList = model.FundedSupport.GroupBy(t => t.BudgetPlanId).Select(
                //                              t => new
                //                              {
                //                                  Id = t.Key,
                //                                  Value = t.Sum(u => u.FundAllocated)
                //                              }).ToList();

                //var fundedSupportEntityList = diffCareplanFundedSupport.GroupBy(t => t.BudgetPlanId).Select(t => new
                //{
                //    Id = t.Key,
                //    Value = t.Sum(u => u.FundAllocated)
                //}).ToList();

                //foreach (var f in fundedSupportGroupList)
                //{
                //    var fundedSupportEntitySum = fundedSupportEntityList.FirstOrDefault(x => x.Id == f.Id)?.Value;
                //    fundedSupportEntitySum = fundedSupportEntitySum == null ? default(decimal) : fundedSupportEntitySum;
                //    var budgetExceeded = budgetsRepo.FirstOrDefault(x => x.Id == f.Id && x.IsActive);

                //    if (budgetExceeded == null)
                //        throw new ArgumentException("Budget does not Exists");

                //    if (f.Value + fundedSupportEntitySum > budgetExceeded.TotalBudget)
                //        throw new ArgumentException("Budget Limit Exceeded");

                //    budgetExceeded.RemainingBudget = budgetExceeded.TotalBudget - (f.Value + fundedSupportEntitySum ?? 0);

                //    budgetsRepo.Update(budgetExceeded);
                //}

                model.FundedSupport.ForEach(item =>
                {
                    if (!(item.FundCategoryId == null && item.BudgetPlanId == null && item.FundAllocated == null))
                    {
                        var fundedSupport = new FundedSupport
                        {
                            CarePlan = carePlan,

                            FundCategoryId = item.FundCategoryId,
                            BudgetPlanId = item.BudgetPlanId,
                            FundAllocated = item.FundAllocated,
                            //Goal = item.Goal,
                            CreatedDate = currentDate,
                            CreatedById = currentUserId,
                            IsActive = true
                        };
                        fundedSupportRepo.Add(fundedSupport);
                    }
                });

            //REFACTOR: set billing Type (clarify requirements for funds)
            carePlan.BillingType = GetBillingType( carePlan.FundedSupports.FirstOrDefault()); 
            */

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public ResponseViewModel UpdateCarePlan(Guid currentUserId, CarePlanViewModel model)
        {
            var currentDate = GeneralService.CurrentDate;
            var patientId = GetInternalId<Patient, Guid>(model.PatientId);
            var carePlanRepo = _genericUnitOfWork.GetRepository<Careplan, int>();
            var familyGoalRepo = _genericUnitOfWork.GetRepository<CareplanFamilyGoal, int>();
            var budgetsRepo = _genericUnitOfWork.GetRepository<Budget, int>();

            var fundedSupportRepo = _genericUnitOfWork.GetRepository<FundedSupport, int>();


            var patientRecord = GetPatientRecord(currentUserId, model.PatientId);


            var carePlanEntity = carePlanRepo.FirstOrDefault(x => x.PublicId == model.Id);

            var titleExists = carePlanRepo.FirstOrDefault(x => x.PublicId != model.Id && x.Title == model.Title
                                                                                      && x.PatientRecord ==
                                                                                      patientRecord
                                                                                      && x.IsActive);
            if (titleExists != null)
                throw new ArgumentException("Title already exists");

            var fundedSupportEntity = fundedSupportRepo.GetAll()
                .Where(x => x.CarePlanId == carePlanEntity.Id && x.IsActive).ToList();

            carePlanEntity.BillingType = model.BillingType;
            carePlanEntity.TotalBudget = model.TotalBudget;
            carePlanEntity.Title = model.Title;
            carePlanEntity.ServiceBookingReference = model.ServiceBookingReference;
            carePlanEntity.KeyPractitionerId = model.KeyPractitionerId;
            carePlanEntity.StartDate = model.StartDate;
            carePlanEntity.DueDate = model.DueDate;
            carePlanEntity.ReviewDate = model.DueDate.HasValue
                ? ((DateTime)model.DueDate).AddDays(-Careplan.REVIEW_WARNING_IN_DAYS)
                : model.DueDate;
            //carePlanEntity.Goal = model.Goal;
            //carePlanEntity.Recomendations = model.Recomendations;
            carePlanEntity.Status = model.Status;
            carePlanEntity.ModifiedDate = GeneralService.CurrentDate;
            carePlanEntity.ModifiedById = currentUserId;

            //Threrapy Team
            carePlanEntity.Practitioners.Clear();
            foreach (var practitioner in model.Practitioners)
                carePlanEntity.Practitioners.Add(new CareplanPractitioner
                {
                    UserId = (Guid)practitioner.Id,
                    CareplanId = carePlanEntity.Id
                });

            carePlanRepo.Update(carePlanEntity);

            //mark all as active = false
            carePlanEntity.FamilyGoals.ToList().ForEach(x => x.IsActive = false);

            foreach (var familyGoal in model.FamilyGoals)
            {
                CareplanFamilyGoal fGoal;

                if (familyGoal.Id == Guid.Empty || familyGoal.Id == null)
                {
                    //create
                    fGoal = new CareplanFamilyGoal
                    {
                        CareplanId = carePlanEntity.Id,
                        Title = familyGoal.Title,
                        Support = familyGoal.Support,
                        Strategy = familyGoal.Strategy,
                        CreatedDate = currentDate,
                        CreatedById = currentUserId,
                        IsActive = true
                    };
                    carePlanEntity.FamilyGoals.Add(fGoal);
                }
                else
                {
                    //update
                    var internalId = GetInternalId<CareplanFamilyGoal, int>((Guid)familyGoal.Id);
                    fGoal = carePlanEntity.FamilyGoals.First(x => x.Id == internalId);

                    if (fGoal == null)
                        throw new ArgumentException("Goal Does not Exists");

                    fGoal.Title = familyGoal.Title;
                    fGoal.Support = familyGoal.Support;
                    fGoal.Strategy = familyGoal.Strategy;
                    fGoal.ModifiedById = currentUserId;
                    fGoal.ModifiedDate = currentDate;
                    fGoal.IsActive = true;
                }

                //short term goals
                if (fGoal.ShortTermGoals == null)
                    fGoal.ShortTermGoals = new List<CareplanShortTermGoal>();
                else
                    fGoal.ShortTermGoals.ToList().ForEach(x => x.IsActive = false);
                foreach (var shortTermGoal in familyGoal.ShortTermGoals)
                {
                    CareplanShortTermGoal stGoal;

                    if (shortTermGoal.Id == Guid.Empty || shortTermGoal.Id == null)
                    {
                        //create
                        stGoal = new CareplanShortTermGoal
                        {
                            CarePlanFamilyGoal = fGoal,
                            CreatedDate = currentDate,
                            CreatedById = currentUserId
                        };

                        fGoal.ShortTermGoals.Add(stGoal);
                    }
                    else
                    {
                        //update
                        var internalId = GetInternalId<CareplanShortTermGoal, int>((Guid)shortTermGoal.Id);
                        stGoal = fGoal.ShortTermGoals.First(x => x.Id == internalId);

                        if (stGoal == null)
                            throw new ArgumentException("Short Term Goal Does not Exist");
                        stGoal.ModifiedById = currentUserId;
                        stGoal.ModifiedDate = currentDate;
                    }

                    stGoal.IsActive = true;
                    stGoal.Title = shortTermGoal.Title;
                    stGoal.Description = shortTermGoal.Description;
                    stGoal.Strategy = shortTermGoal.Strategy;
                    stGoal.Outcome = (CareplanGoalOutcome?)shortTermGoal.Outcome;
                    stGoal.OutcomeDetail = shortTermGoal.OutcomeDetail;
                }

                fGoal.ShortTermGoals = fGoal.ShortTermGoals.ToList();
            }

            /*
            if (model.FundedSupport.Count > 0)
                //var diffCareplanFundedSupport = fundedSupportRepo.GetAll().Where(x => x.CarePlanId != carePlanEntity.Id
                //                                                                                    ).ToList();

                //var fundedSupportGroupList = model.FundedSupport.GroupBy(t => t.BudgetPlanId).Select(
                //                              t => new
                //                              {
                //                                  Id = t.Key,
                //                                  Value = t.Sum(u => u.FundAllocated)
                //                              }).ToList();

                //var fundedSupportEntityList = diffCareplanFundedSupport.GroupBy(t => t.BudgetPlanId).Select(t => new
                //{
                //    Id = t.Key,
                //    Value = t.Sum(u => u.FundAllocated)
                //}).ToList();

                //foreach (var f in fundedSupportGroupList)
                //{
                //    var fundedSupportEntitySum = fundedSupportEntityList.FirstOrDefault(x => x.Id == f.Id)?.Value;
                //    fundedSupportEntitySum = fundedSupportEntitySum == null ? default(decimal) : fundedSupportEntitySum;
                //    var budgetExceeded = budgetsRepo.FirstOrDefault(x => x.Id == f.Id);
                //    if (budgetExceeded == null)
                //        throw new ArgumentException("Budget does not Exists");

                //    if (f.Value + fundedSupportEntitySum > budgetExceeded.TotalBudget)
                //        throw new ArgumentException("Budget Limit Exceeded");

                //    budgetExceeded.RemainingBudget = budgetExceeded.TotalBudget - (f.Value + fundedSupportEntitySum ?? 0);

                //    budgetsRepo.Update(budgetExceeded);
                //}

                model.FundedSupport.ForEach(item =>
                {
                    if (!(item.FundCategoryId == null && item.BudgetPlanId == null && item.FundAllocated == null))
                    {
                        if (item.Id == null)
                        {
                            var fundedSupport = new FundedSupport
                            {
                                CarePlanId = carePlanEntity.Id,

                                FundCategoryId = item.FundCategoryId,
                                BudgetPlanId = item.BudgetPlanId,
                                FundAllocated = item.FundAllocated,
                                //Goal = item.Goal,
                                CreatedDate = currentDate,
                                CreatedById = currentUserId,
                                IsActive = true
                            };
                            fundedSupportRepo.Add(fundedSupport);
                        }

                        else
                        {
                            var fundedSupportExists = fundedSupportEntity.FirstOrDefault(x => x.Id == item.Id);
                            if (fundedSupportExists == null)
                                throw new ArgumentException("Funded Support Does not Exists");
                            fundedSupportExists.FundCategoryId = item.FundCategoryId;
                            fundedSupportExists.BudgetPlanId = item.BudgetPlanId;
                            //fundedSupportExists.Goal = item.Goal;
                            fundedSupportExists.FundAllocated = item.FundAllocated;
                            fundedSupportExists.ModifiedById = currentUserId;
                            fundedSupportExists.ModifiedDate = currentDate;
                            fundedSupportRepo.Update(fundedSupportExists);
                        }
                    }
                });

            //REFACTOR: set billing Type (clarify requirements for funds)
            carePlanEntity.BillingType = GetBillingType(carePlanEntity.FundedSupports.FirstOrDefault());
            */
            carePlanEntity.FamilyGoals = carePlanEntity.FamilyGoals.ToList();

            _genericUnitOfWork.SaveChanges();

            //hide inactive data
            return new ResponseViewModel<CarePlanViewModel>
            { Data = _mapper.Map<CarePlanViewModel>(carePlanEntity), Success = true };
        }

        public ResponseViewModel DeleteCarePlan(Guid currentUserId, Guid patientId, Guid careplanId)
        {
            var currentDate = GeneralService.CurrentDate;
            var carePlanRepo = _genericUnitOfWork.GetRepository<Careplan, int>();


            var carePlanEntity = carePlanRepo.FirstOrDefault(x => x.PublicId == careplanId);
            if (carePlanEntity == null)
                throw new ArgumentException("CarePlan Doesnot exists");

            carePlanEntity.IsActive = false;
            carePlanEntity.ModifiedDate = currentDate;
            carePlanEntity.ModifiedById = currentUserId;


            carePlanRepo.Update(carePlanEntity);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel { Success = true };
        }

        public DataSourceResult ListCarePlan(Guid currentUserId,
            DataRequestModel dataRequest)
        {
            var provider = GetUserProvider(currentUserId);
            var user = GetUser(currentUserId);
            Expression<Func<Careplan, bool>> expression = c => c.IsActive;
            if (user.UserType == UserType.Client) expression = c => c.PatientRecord.Patient.UserId == currentUserId;
            var queryable = _genericUnitOfWork.GetRepository<Careplan, Guid>().GetAll(expression)
                .Where(c => c.PatientRecord.Provider == provider).AsQueryable();

            if (dataRequest.Filter != null)
                if (dataRequest.Filter.ContainsKey("name") && dataRequest.Filter["name"] != null)

                {
                    var filter = dataRequest.Filter["name"];
                    queryable = queryable.Where(p =>
                        p.Title.Contains(filter) || p.PatientRecord.Patient.FirstName.Contains(filter)
                                                 || p.PatientRecord.Patient.NDISNumber.Contains(filter)
                                                 || p.PatientRecord.Patient.LastName.Contains(filter));
                }

            //var result = queryable.ToCollectionResult(dataRequest,
            //    new Sort { Field = "CreatedDate", Direction = SortOrder.DESCENDING });

            //TODO:optimise this - caching or storing remaining funds on DB
            foreach (var careplan in queryable.ToList()) _billingService.EnrichWithFunds(careplan);

            var result = queryable.ToDataSourceResult<Careplan, CarePlanListViewModel>(_mapper, dataRequest,
              new Sort { Field = "CreatedDate", Direction = SortOrder.DESCENDING });

            return result;

            //var response = _mapper.Map<List<Careplan>, List<CarePlanListViewModel>>(result.ToList());
            //return new ResponseViewModel<List<CarePlanListViewModel>> { Data = response, Success = true };
        }

        public ResponseViewModel<CarePlanViewModel> GetCarePlanById(Guid patientId, Guid careplanId)
        {
            var repo = _genericUnitOfWork.GetRepository<Careplan, Guid>();
            var careplanEntity = repo.FirstOrDefault(c => c.PublicId == careplanId);
            _billingService.EnrichWithFunds(careplanEntity);

            var carePlanResponse = new CarePlanViewModel
            {
                Id = careplanEntity.PublicId,
                NDISNumber = careplanEntity.PatientRecord.Patient.NDISNumber,
                PatientId = careplanEntity.PatientRecord.Patient.PublicId,
                PatientName = careplanEntity.PatientRecord.Patient.User.FullName,
                KeyPractitionerId = careplanEntity.KeyPractitionerId,
                Title = careplanEntity.Title,
                ServiceBookingReference = careplanEntity.ServiceBookingReference,
                DueDate = careplanEntity.DueDate,
                StartDate = careplanEntity.StartDate,
                Status = careplanEntity.Status,
                BillingType = careplanEntity.BillingType,
                TotalBudget = careplanEntity.TotalBudget,
                RemainingFunds = careplanEntity.RemainingFunds,
                IsDefault = careplanEntity.isDefault

                //Recomendations = careplanEntity.Recomendations,
                //Goal = careplanEntity.Goal
            };

            carePlanResponse.FamilyGoals = _mapper.Map<List<FamilyGoalsViewModel>>(careplanEntity.FamilyGoals);
            carePlanResponse.FundedSupport = _mapper.Map<List<FundedSupportViewModel>>(careplanEntity.FundedSupports);
            carePlanResponse.Practitioners =
                _mapper.Map<List<CareplanPractitionerViewModel>>(careplanEntity.Practitioners);

            return new ResponseViewModel<CarePlanViewModel> { Data = carePlanResponse, Success = true };
        }


        public ResponseViewModel<CarePlanDetailsViewModel> GetCarePlanDetailsById(Guid patientId, Guid careplanId)
        {
            var repo = _genericUnitOfWork.GetRepository<Careplan, Guid>();
            var careplanEntity = repo.FirstOrDefault(c => c.PublicId == careplanId);

            if (careplanEntity == null)
                throw new ArgumentException("Care Plan does not exists");

            _billingService.EnrichWithFunds(careplanEntity);


            var carePlanResponse = new CarePlanDetailsViewModel
            {
                Id = careplanEntity.PublicId,
                BillingType = careplanEntity.BillingType,
                NDISNumber = careplanEntity.PatientRecord.Patient.NDISNumber,
                StartDate = careplanEntity.StartDate,
                DueDate = careplanEntity.DueDate,
                PatientId = careplanEntity.PatientRecord.Patient.PublicId,
                PatientName = careplanEntity.PatientRecord.Patient.User.FullName,
                KeyPractitionerName = careplanEntity.KeyPractitioner.FullName,
                Title = careplanEntity.Title,
                ServiceBookingReference = careplanEntity.ServiceBookingReference,
                Status = careplanEntity.Status.ToString(),
                CreatedDate = careplanEntity.CreatedDate,
                TotalBudget = careplanEntity.TotalBudget,
                RemainingFunds = careplanEntity.RemainingFunds,
                IsDefault = careplanEntity.isDefault
            };

            carePlanResponse.FamilyGoals = _mapper.Map<List<FamilyGoalsDetailsViewModel>>(
                careplanEntity.FamilyGoals.Where(x => x.IsActive &&
                                                      x.ShortTermGoals.Any(c => c.IsActive)));
            //carePlanResponse.Assessments = ListCarePlanAssessment(careplanEntity.PublicId);
            //carePlanResponse.Observations = ListCarePlanObservation(careplanEntity.PublicId);
            //carePlanResponse.TreatmentNotes = ListCarePlanTreatmentNote(careplanEntity.PublicId);
            carePlanResponse.Practitioners =
                _mapper.Map<List<CareplanPractitionerViewModel>>(careplanEntity.Practitioners);

            return new ResponseViewModel<CarePlanDetailsViewModel> { Data = carePlanResponse, Success = true };
        }
        /*
        public ResponseViewModel SaveCarePlanObservation(Guid currentUserId, SaveCarePlanObservationViewModel model)
        {
            //TODO: validate patient ID against careplan

            var carePlanRepo = _genericUnitOfWork.GetRepository<Careplan, int>();
            var carePlanNoteRepo = _genericUnitOfWork.GetRepository<CarePlanNote, int>();


            var carePlanEntity = carePlanRepo.FirstOrDefault(x => x.PublicId == model.CarePlanId);
            if (carePlanEntity == null)
                throw new ArgumentException("CarePlan Does not Exists");

            var patientNote = new CarePlanNote
            {
                CarePlanId = carePlanEntity.Id,
                NoteType = NoteType.Observation.ToString(),
                NoteTypeId = NoteType.Observation,
                Note = model.Observation,
                CreatedDate = GeneralService.CurrentDate,
                ModifiedDate = GeneralService.CurrentDate,
                CreatedById = currentUserId
            };

            carePlanNoteRepo.Add(patientNote);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<CarePlanObservationListViewModel>
                {Data = _mapper.Map<CarePlanObservationListViewModel>(patientNote), Success = true};
        }

        private List<CarePlanObservationListViewModel> ListCarePlanObservation(Guid careplanId)
        {
            var carePlanNotesObservations = _genericUnitOfWork.GetRepository<CarePlanNote, Guid>().GetAll(x =>
                x.Careplan.PublicId == careplanId && x.NoteTypeId == NoteType.Observation).ToList();

            var result = _mapper.Map<List<CarePlanObservationListViewModel>>(carePlanNotesObservations);

            return result;
        }
        */
        /*
        public ResponseViewModel SaveCarePlanAssessment(Guid currentUserId, SaveCarePlanAssessmentViewModel model)
        {
            //TODO: validate patient ID against careplan

            var carePlanRepo = _genericUnitOfWork.GetRepository<Careplan, int>();
            var carePlanNoteRepo = _genericUnitOfWork.GetRepository<CarePlanNote, int>();


            var carePlanEntity = carePlanRepo.FirstOrDefault(x => x.PublicId == model.CarePlanId);
            if (carePlanEntity == null)
                throw new ArgumentException("CarePlan Does not Exists");

            var patientNote = new CarePlanNote
            {
                CarePlanId = carePlanEntity.Id,
                NoteType = NoteType.Assessment.ToString(),
                NoteTypeId = NoteType.Assessment,
                Note = model.Assessment,
                CreatedDate = GeneralService.CurrentDate,
                ModifiedDate = GeneralService.CurrentDate,
                CreatedById = currentUserId
            };

            carePlanNoteRepo.Add(patientNote);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<CarePlanAssessmentListViewModel>
                {Data = _mapper.Map<CarePlanAssessmentListViewModel>(patientNote), Success = true};
        }


        private List<CarePlanAssessmentListViewModel> ListCarePlanAssessment(Guid careplanId)
        {
            var carePlanNotesAssessmentes = _genericUnitOfWork.GetRepository<CarePlanNote, Guid>().GetAll(x =>
                x.Careplan.PublicId == careplanId && x.NoteTypeId == NoteType.Assessment).AsQueryable();

            var result = _mapper.Map<List<CarePlanAssessmentListViewModel>>(carePlanNotesAssessmentes);

            return result;
        }

        public ResponseViewModel SaveCarePlanTreatmentNote(Guid currentUserId, SaveCarePlanTreatmentNoteViewModel model)
        {
            //TODO: validate patient ID against careplan

            var carePlanRepo = _genericUnitOfWork.GetRepository<Careplan, int>();
            var carePlanNoteRepo = _genericUnitOfWork.GetRepository<CarePlanNote, int>();


            var carePlanEntity = carePlanRepo.FirstOrDefault(x => x.PublicId == model.CarePlanId);
            if (carePlanEntity == null)
                throw new ArgumentException("CarePlan Does not Exists");

            var patientNote = new CarePlanNote
            {
                CarePlanId = carePlanEntity.Id,
                NoteType = NoteType.TreatmentNote.ToString(),
                NoteTypeId = NoteType.TreatmentNote,
                Note = model.TreatmentNote,
                CreatedDate = GeneralService.CurrentDate,
                ModifiedDate = GeneralService.CurrentDate,
                CreatedById = currentUserId
            };

            carePlanNoteRepo.Add(patientNote);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<CarePlanTreatmentNoteListViewModel>
                {Data = _mapper.Map<CarePlanTreatmentNoteListViewModel>(patientNote), Success = true};
        }

        private List<CarePlanTreatmentNoteListViewModel> ListCarePlanTreatmentNote(Guid careplanId)
        {
            var carePlanNotesTreatments = _genericUnitOfWork.GetRepository<CarePlanNote, Guid>().GetAll(x =>
                x.Careplan.PublicId == careplanId && x.NoteTypeId == NoteType.TreatmentNote).ToList();

            var result = _mapper.Map<List<CarePlanTreatmentNoteListViewModel>>(carePlanNotesTreatments);

            return result;
        }

      */
        public byte[] CarePlanSummaryReport(Guid currentUserId, Guid careplanId)
        {
            //TODO: check permissions
            var repo = _genericUnitOfWork.GetRepository<Careplan, Guid>();
            var carePlan = repo.FirstOrDefault(c => c.PublicId == careplanId);

            if (carePlan == null || carePlan.Status != CareplanStatus.Completed)
                throw new ArgumentException("Care Plan either does not exist, or it is in draft mode.");

            var html = _viewRender.Render("PdfTemplate/TherapySummaryService", carePlan);

            return PDFBuilder.ConvertHtmltoPdf(_converter, html);

            //return CarePlanSummaryReportGenerator.GenerateReport(_converter, carePlan);
        }

        public DataSourceResult ListPatientByCareplan(Guid currentUserId, DataRequestModel dataRequest)
        {
            var provider = GetUserProvider(currentUserId);

            var patient = _genericUnitOfWork.GetRepository<Patient, Guid>().GetAll();


            var careplans = _genericUnitOfWork.GetRepository<Careplan, int>().GetAll();

            var queryable = patient.Join(careplans.Where(k => k.KeyPractitionerId == currentUserId)
                , p => p.Id,
                c => c.PatientRecord.Patient.Id, (p, c) => new
                {
                    Patient = p,
                    Careplan = c
                }).Select(x => new PatientListResponseViewModel
                {
                    Id = x.Patient.Id,
                    FirstName = x.Patient.FirstName,
                    LastName = x.Patient.LastName,
                    NDISNumber = x.Patient.NDISNumber,
                    Gender = x.Patient.Gender,
                    Address = x.Patient.User.Address.Name,
                    AvailableBudget = x.Patient.Budgets.Sum(b => b.RemainingBudget)

                });


        
            var result = queryable.ToDataSourceResult(dataRequest,
                   new Sort { Field = "CreatedDate", Direction = SortOrder.DESCENDING });

            return result;
 
        }


        #endregion
    }
}