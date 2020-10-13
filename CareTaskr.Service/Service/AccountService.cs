using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Constant;
using Caretaskr.Common.Dto;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Constant;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Caretaskr.Service.Service
{
    public class AccountService : IAccountService
    {
        private readonly CareTaskrUrl _careTaskrUrls;
        private readonly IEmailService _emailService;
        private readonly EncryptionService _encryptionService;
        private readonly IFPatientService _fhirPatientService;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly UserManager<User> _userManager;
        private readonly ViewRender _viewRender;
        private readonly IJwtFactory jwtFactory;

        public AccountService(IGenericUnitOfWork genericUnitOfWork,
            IOptions<CareTaskrUrl> careTaskrUrls,
            UserManager<User> userManager,
            IJwtFactory jwtFactory,
            JwtIssuerOptions jwtOptions,
            IEmailService emailService,
            ViewRender viewRender,
            IFPatientService fhirPatientService,
            EncryptionService encryptionService)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _jwtOptions = jwtOptions;
            _careTaskrUrls = careTaskrUrls.Value;
            _userManager = userManager;
            this.jwtFactory = jwtFactory;
            _viewRender = viewRender;
            _emailService = emailService;
            _fhirPatientService = fhirPatientService;
            _encryptionService = encryptionService;
        }


        public async Task<ResponseViewModel> RegisterUser(UserRegisterRequestViewModel model)
        {
            var repo = _genericUnitOfWork.GetRepository<User, Guid>();
            var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();

            var checkUserByEmail = await _userManager.FindByEmailAsync(model.Email);
            if (checkUserByEmail != null)
                throw new ArgumentException("Email address already exists in the system");

            ProviderUser providerUser = default;
            var providerUserRepo = _genericUnitOfWork.GetRepository<ProviderUser, int>();

            var roleId = default(Guid);
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = model.UserType.ToString(),
                UserName = model.Email,
                Email = model.Email,
                EmailConfirmed = false,
                UserType = model.UserType,
                IsActive = true,
                IsRegistrationComplete = false
            };

            if (model.UserType == UserType.Owner)
            {
                var providerRepo = _genericUnitOfWork.GetRepository<Provider, Guid>();
                roleId = new Guid(ApplicationConstants.SuperAdminRoleGuid);

                var provider = new Provider
                {
                    PrimaryContactEmail = model.Email,
                    IsActive = true,
                    CreatedDate = GeneralService.CurrentDate
                };

                providerRepo.Add(provider);

                providerUser = new ProviderUser
                {
                    Provider = provider,
                    UserId = user.Id
                };

                providerUserRepo.Add(providerUser);
            }

            else if (model.UserType == UserType.Client)
            {
                var patientRecordRepo = _genericUnitOfWork.GetRepository<PatientRecord, Guid>();
                //var providerRepo = _genericUnitOfWork.GetRepository<Provider, int>().FirstOrDefault();

                roleId = new Guid(ApplicationConstants.ParticipantRoleGuid);
                var patient = new Patient
                {
                    UserId = user.Id,
                    Id = Guid.NewGuid(),
                    FirstName = "",
                    LastName = "",
                    DateOfBirth = DateTime.MinValue,
                    CreatedDate = GeneralService.CurrentDate,
                    IsActive = true
                };

                //FHIR ---
                var fhirResult = _fhirPatientService.CreatePatient(patient);
                if (fhirResult.Success)
                {
                    patient.FhirResourceId = fhirResult.DataFirstItem().FhirResourceId;
                    patient.FhirResourceUri = fhirResult.DataFirstItem().FhirResourceUri;
                }
                else
                {
                    throw new ArgumentException("Unable to save Patient data on FHIR Server");
                }
                //FHIR --/

                patientRepo.Add(patient);
                //patientRecordRepo.Add(patientRecord);
            }


            else
            {
                throw new ArgumentException("Invalid User Type");
            }

            var roleName = _genericUnitOfWork.GetRepository<Role, Guid>().FirstOrDefault(x => x.Id == roleId).Name;

            var result = await _userManager.CreateAsync(user, model.Password);
            var roleResult = await _userManager.AddToRoleAsync(user, roleName);
            if (result.Succeeded && roleResult.Succeeded)
            {
                user = await _userManager.FindByNameAsync(user.UserName);
                if (result.Succeeded)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(JwtClaimTypes.Name, user.FullName)
                    };

                    var claimaddresult = await _userManager.AddClaimsAsync(user, claims);

                    if (claimaddresult.Succeeded)
                    {
                        var res = new ResponseViewModel<RegisterResponseViewModel>
                        { Data = new RegisterResponseViewModel { UserId = user.Id }, Success = true };
                        _genericUnitOfWork.SaveChanges();

                        //Force tenantDataKey update - need the provider's ID generated by the DB 
                        providerUserRepo.Update(providerUser);
                        _genericUnitOfWork.SaveChanges();

                        await SendEmailConfirmationLink(user.Id, user.Email);
                        return res;
                    }

                    await _userManager.DeleteAsync(user);
                }
                else
                {
                    await _userManager.DeleteAsync(user);
                }
            }
            else
            {
                await _userManager.DeleteAsync(user);
                throw new ArgumentException(result.Errors.FirstOrDefault().Description);
            }

            throw new ArgumentException(result.Errors.FirstOrDefault().Description);
        }


        public async Task<ResponseViewModel> Login(SignInViewModel model)
        {
            try
            {
                var identity = await GetClaimsIdentity(model.UserName, model.Password);
                if (identity == null)
                    throw new ArgumentException("Invalid username or password.");

                var user = await GetUserByUserType(model.UserName);


                var roleId = await GetRoleId(user);

                //-- TODO: needs refactoring --
                user = SetTenantKey(user);
                //-----/
                var tokenRepo = _genericUnitOfWork.GetRepository<RefreshToken, Guid>();
                var refreshToken = tokenRepo.SingleOrDefault(t => t.UserId == user.Id);

                if (refreshToken != null)
                    tokenRepo.Delete(refreshToken);

                var newRefreshToken = CreateRefreshToken(user.Id);

                _genericUnitOfWork.SaveChanges();

                var result = await Tokens.GenerateJwt(user, identity, jwtFactory, _jwtOptions,
                    new JsonSerializerSettings { Formatting = Formatting.Indented });


                var menus = new List<UserPageViewModel>();
                var userwisePage = _genericUnitOfWork.GetRepository<UserPage, Guid>().GetAll()
                    .Where(c => c.RoleId == roleId && c.Page.ShowInView).Select(p => new UserPageViewModel
                    {
                        PageDisplayOrder = p.Page.DisplayOrder,
                        PageId = p.Page.Id,
                        PageParentPageId = p.Page.ParentPageId,
                        PagePath = p.Page.Path,
                        Title = p.Page.Title,
                        url = p.Page.Path,
                        name = p.Page.Title,
                        icon = p.Page.Icon
                    }).ToList();
                userwisePage.Where(c => c.PageParentPageId == null).OrderBy(c => c.PageDisplayOrder).ToList().ForEach(
                    p =>
                    {
                        p.ChildPages = GetChildPages(userwisePage, p.PageId);
                        p.children = GetChildPages(userwisePage, p.PageId);
                        menus.Add(p);
                    });

                result.UserPages = menus;
                result.RefreshToken = newRefreshToken.Token;

                return new ResponseViewModel<SignInResponseViewModel> { Data = result, Success = true };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<ResponseViewModel> ForgotPassword(ForgotPasswordViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
                throw new ArgumentException(ErrorMessage.USER_DOES_NOT_EXIST);


            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            code = HttpUtility.UrlEncode(code);
            var userId = user.Id.ToString();
            userId = HttpUtility.UrlEncode(userId);

            var appUrl = _careTaskrUrls.WebUrl;
            var emailObj = new ForgotPasswordNotificationViewModel
            {
                FullName = user.FullName,
                CallbackUrl = $"{appUrl}/auth/resetpassword?userId={userId}&code={code}",
                LogoUrl = appUrl + ImageConstant.LOGO_URL,
                WebUrl = appUrl
            };

            //var html = _viewRender.Render(EmailTemplate.FORGOT_PASSWORD, emailModel);
            //await _emailService.SendEmailAsync(user.Email, "Caretaskr : Forgot Password", html);


            await _emailService.SendEmailDynamicTemplate(user.Email, SENDGRIDEMAILTEMPLATE.FORGOT_PASSWORD, emailObj);
            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public async Task<ResponseViewModel> ResetPassword(ResetPasswordViewModel model)
        {
            var code = model.Code;
            code = HttpUtility.UrlDecode(code);
            code = code.Replace(" ", "+");
            if (string.IsNullOrEmpty(code))
                throw new ArgumentException("Invalid information.");

            var user = await _userManager.FindByIdAsync(model.UserId.ToString());

            if (user == null)
                throw new ArgumentException("Invalid token.");

            var messsage = await _userManager.ResetPasswordAsync(user, code, model.Password);
            if (!messsage.Succeeded) throw new ArgumentException("Invalid Token");

            //var emailModel = new ResetPasswordConfirmationNotificationViewModel
            //{
            //    FullName = user.FullName
            //};


            //var html = _viewRender.Render(EmailTemplate.RESET_PASSWORD_CONFIRMATION_SUCCESS, emailModel);
            //await _emailService.SendEmailAsync(user.Email, "Caretaskr : Password Reset Successfully", html);
            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public async Task<ResponseViewModel> ConfirmEmail(EmailConfirmationViewModel model)
        {
            var code = model.Code;
            code = HttpUtility.UrlDecode(code);
            code = code.Replace(" ", "+");
            code = _encryptionService.Decrypt(code);

            if (string.IsNullOrEmpty(code))
                return new ResponseViewModel<string> { Data = "", Success = false };


            var codeKey = code.Split(",");
            var userId = new Guid(codeKey[0]);
            var dateTime = codeKey[1];

            var user = await _userManager.FindByIdAsync(userId.ToString());


            if (user == null || user.EmailConfirmed)
                return new ResponseViewModel<string> { Data = "", Success = false };


            var date = DateTime.ParseExact(dateTime, "ddMMyyyyHHmmss", CultureInfo.InvariantCulture);
            if (date < DateTime.Now)
                return new ResponseViewModel<string> { Data = "", Success = false };

            user.EmailConfirmed = true;
            var passwordExists = await _userManager.HasPasswordAsync(user);


            await _userManager.UpdateAsync(user);
            var appUrl = _careTaskrUrls.WebUrl;
            var resetpasswordUrl = string.Empty;

            if (!passwordExists)
            {
                var resetCode = await _userManager.GeneratePasswordResetTokenAsync(user);
                resetCode = HttpUtility.UrlEncode(resetCode);
                var Id = user.Id.ToString();
                Id = HttpUtility.UrlEncode(Id);
                resetpasswordUrl = $"{appUrl}/auth/resetpassword?userId={Id}&code={resetCode}";
            }

            var emailObj = new EmailConfirmationNotificationViewModel
            {
                FullName = user.FullName,
                CallBackUrl = $"{appUrl}{UrlConstant.AUTH_LOGIN}",
                ResetPasswordUrl = passwordExists ? "" : resetpasswordUrl,
                LogoUrl = appUrl + ImageConstant.LOGO_URL,
            };


            //var html = _viewRender.Render(EmailTemplate.EMAIL_CONFIRMATION_SUCCESS, emailObj);
            //await _emailService.SendEmailAsync(user.Email, "Caretaskr : Email Confirm Success", html);

            await _emailService.SendEmailDynamicTemplate(user.Email, SENDGRIDEMAILTEMPLATE.EMAIL_CONFIRMATION_SUCCESS, emailObj);


            return new ResponseViewModel<object> { Data = new { ResetPassword = !passwordExists }, Success = true };
        }


        public async Task<ResponseViewModel<InitRegistrationtViewModel>> InitRegistration(Guid currentUserId)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());

            if (user == null)
                throw new ArgumentException("User not found");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");

            var result = new InitRegistrationtViewModel();
            result.FullName = user.FullName;


            return new ResponseViewModel<InitRegistrationtViewModel> { Data = result, Success = true };
        }

        public async Task<ResponseViewModel> RegistrationComplete(Guid currentUserId, InitRegistrationtViewModel model)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();

            if (user == null)
                throw new ArgumentException("User not found");

            if (user.IsRegistrationComplete)
                throw new ArgumentException("Registration already Completed");


            user.FullName = model.FullName;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.IsRegistrationComplete = true;

            userRepo.Update(user);

            _genericUnitOfWork.SaveChanges();

            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public async Task<ResponseViewModel> IsRegistrationComplete(Guid currentUserId)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());

            if (user == null)
                throw new ArgumentException("User not found");

            var isRegistrationComplete = user.IsRegistrationComplete;


            return new ResponseViewModel<bool> { Data = isRegistrationComplete, Success = true };
        }

        public async Task<ResponseViewModel> RefreshToken(Guid currentUserId, RefreshTokenViewModel model)
        {
            var tokenRepo = _genericUnitOfWork.GetRepository<RefreshToken, Guid>();
            var tokenEntity = tokenRepo.SingleOrDefault(t => t.Token == model.Token && t.UserId == currentUserId);


            if (tokenEntity == null)
                throw new ArgumentException("Invalid");

            if (tokenEntity.ExpiresUtc < DateTime.Now.ToUniversalTime())
                throw new ArgumentException("Invalid");

            //  if (!await _signinManager.CanSignInAsync(refreshTokenFromDatabase.User))
            //    throw new ArgumentException("Invalid");


            var user = await _userManager.FindByIdAsync(tokenEntity.User.Id.ToString());
            user = SetTenantKey(user);
            var loginInfo = await GetLoginInfo(user);
            var identity = await Task.FromResult(jwtFactory.GenerateClaimsIdentity(user.UserName, loginInfo));


            tokenRepo.Delete(tokenEntity);

            var newRefreshToken = CreateRefreshToken(user.Id);

            _genericUnitOfWork.SaveChanges();

            var response = new TokenResponseViewModel
            {
                AccessToken = await jwtFactory.GenerateEncodedToken(user.UserName,
                    loginInfo.Role, user.TenantDataKey,
                    user.PatientDataKey, identity),
                RefreshToken = newRefreshToken.Token
            };


            return new ResponseViewModel<TokenResponseViewModel> { Data = response, Success = true };
        }

        public async Task<ResponseViewModel> ChangePassword(Guid currentUserId, ChangePasswordViewModel model)
        {
            var user = await _userManager.FindByIdAsync(currentUserId.ToString());
            if (user == null)
                throw new ArgumentException(ErrorMessage.USER_DOES_NOT_EXIST);

            if (model.CurrentPassword == model.NewPassword)
                throw new ArgumentException(ErrorMessage.OLD_AND_NEW_PASSWORD_CANNOT_BE_SAME);

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                var error = result.Errors.FirstOrDefault();
                if (error.Code == "PasswordMismatch")
                    throw new ArgumentException(ErrorMessage.CONFIRM_PASSWORD_INCORRECT);

                throw new ArgumentException(result.Errors.FirstOrDefault().Description);
            }

            user.LastPasswordChangeDate = GeneralService.CurrentDate;

            await _userManager.UpdateAsync(user);
            return new ResponseViewModel<string> { Data = "", Success = true };
        }


        private async Task<Guid> GetRoleId(User user)
        {
            var role = await _userManager.GetRolesAsync(user);
            if (role.Count < 0)
                throw new ArgumentException("Invalid Role");

            var roleId = _genericUnitOfWork.GetRepository<Role, Guid>().FirstOrDefault(x => x.Name == role[0]).Id;
            return roleId;
        }


        private async Task<User> GetUserByUserType(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user.UserType == UserType.PrimaryCustodian)
            {
                var carerPatient = _genericUnitOfWork.GetRepository<CarerPatient, Guid>()
                    .FirstOrDefault(x => x.Carer.User.Id == user.Id);
                user = await _userManager.FindByNameAsync(carerPatient.Patient.User.UserName);
                return user;
            }

            return user;
        }

        private void IsPatientAndHasCarer(User user)
        {
            if (user.UserType == UserType.Client)
            {
                var patientRepo = _genericUnitOfWork.GetRepository<Patient, Guid>();
                var patientExists = patientRepo.FirstOrDefault(x => x.UserId == user.Id);
                if (patientExists == null) throw new ArgumentException("Invalid username or password.");

                if (patientExists.HasCarer)
                    throw new ArgumentException("Not Authorized To login");
            }
        }

        private async Task<ClaimsIdentity> GetClaimsIdentity(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return await Task.FromResult<ClaimsIdentity>(null);

            // get the user to verifty
            var userToVerify = await _userManager.FindByNameAsync(userName);

            // check the credentials
            if (await _userManager.CheckPasswordAsync(userToVerify, password))
            {
                if (!userToVerify.IsActive)
                    throw new ArgumentException("Your account is not active. Please contact administrator.");

                if (!userToVerify.EmailConfirmed)
                    throw new ArgumentException("Your Email Address is not confirmed. Please review you inbox.");

                //check if usertype is patient and has carer
                IsPatientAndHasCarer(userToVerify);

                userToVerify = await GetUserByUserType(userName);
                var loginInfo = await GetLoginInfo(userToVerify);

                return await Task.FromResult(jwtFactory.GenerateClaimsIdentity(userName, loginInfo));
            }

            return await Task.FromResult<ClaimsIdentity>(null);
        }

        private List<UserPageViewModel> GetChildPages(List<UserPageViewModel> pages, int? parentPageId)
        {
            var childpages = pages.Where(c => c.PageParentPageId == parentPageId).OrderBy(c => c.PageDisplayOrder);
            return childpages
                .Select(c => new UserPageViewModel
                {
                    children = GetChildPages(pages, c.PageId),
                    PageDisplayOrder = c.PageDisplayOrder,
                    icon = c.PageIcon,
                    PageId = c.PageId,
                    PageParentPageId = c.PageParentPageId,
                    url = c.PagePath,
                    Title = c.Title
                }).ToList();
        }

        public async Task SendEmailConfirmationLink(Guid userId, string email)
        {
            var todaysDate = GeneralService.CurrentDate;
            var codeKey = userId + "," + todaysDate.AddDays(1).ToString("ddMMyyyyHHmmss");
            var code = _encryptionService.Encrypt(codeKey);

            var webServerHost = _careTaskrUrls.WebUrl;


            var emailModel = new NewUserRegistrationViewModel
            {

                CallBackUrl = $"{webServerHost}{UrlConstant.CONFIRM_EMAIL}{code}",
                WebUrl = webServerHost,
                //Todo find new way to send image to template
                EmailIconUrl = webServerHost + ImageConstant.EMAIL_ICON,
                LogoUrl = webServerHost + ImageConstant.LOGO_URL,
            };


            //var html = _viewRender.Render(EmailTemplate.EMAIL_CONFIRMATION, model);
            //await _emailService.SendEmailAsync(email, "Caretaskr Customer : Email Confirmation", html);
            await _emailService.SendEmailDynamicTemplate(email, SENDGRIDEMAILTEMPLATE.EMAIL_VERIFICATION, emailModel);
        }


        private async Task<LoginInfo> GetLoginInfo(User userToVerify)
        {
            var role = await _userManager.GetRolesAsync(userToVerify);

            var roleId = _genericUnitOfWork.GetRepository<Role, Guid>().FirstOrDefault(x => x.Name == role[0]).Id;
            var profilePicture = _genericUnitOfWork.GetRepository<UserDocument, int>().FirstOrDefault(x =>
                x.UserId == userToVerify.Id && x.DocumentTypeId == UserDocumentType.UserProfile);
            var loginInfo = new LoginInfo
            {
                UserId = userToVerify.Id,
                FullName = userToVerify.FullName,
                Email = userToVerify.Email,
                IsRegistrationComplete = userToVerify.IsRegistrationComplete,
                Role = role[0],
                DisplayPicture = profilePicture?.DocumentPath
            };
            return loginInfo;
        }

        private User SetTenantKey(User user)
        {
            switch (user.UserType)
            {
                case UserType.Owner:
                case UserType.Manager:
                case UserType.User:
                    Expression<Func<ProviderUser, bool>> expression = x => x.User == user;
                    var providerIds = _genericUnitOfWork.GetRepository<ProviderUser, Guid>()
                        .GetAllIgnoreGlobalQueries(expression).Select(x => x.Provider.GetDataKey());
                    user.TenantDataKey = string.Join(",", providerIds);

                    if (string.IsNullOrEmpty(user.TenantDataKey))
                        throw new Exception("User must belong to a Provider");

                    break;

                case UserType.Client:
                    Expression<Func<Patient, bool>> expressionPatient = x => x.User == user;
                    var patientIds = _genericUnitOfWork.GetRepository<Patient, Guid>()
                        .GetAllIgnoreGlobalQueries(expressionPatient).Select(x => x.GetDataKey());
                    user.PatientDataKey = string.Join(",", patientIds);
                    break;

                case UserType.PrimaryCustodian:
                    Expression<Func<CarerPatient, bool>> expressionCarer = x => x.Carer.User == user;
                    var carerPatientIds = _genericUnitOfWork.GetRepository<CarerPatient, Guid>()
                        .GetAllIgnoreGlobalQueries(expressionCarer).Select(x => x.Patient.GetDataKey());
                    user.PatientDataKey = string.Join(",", carerPatientIds);
                    break;
            }

            return user;
        }

        private RefreshToken CreateRefreshToken(Guid userId)
        {
            var tokenRepo = _genericUnitOfWork.GetRepository<RefreshToken, Guid>();

            var newRefreshToken = new RefreshToken
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Token = Guid.NewGuid().ToString(),
                IssuedUtc = DateTime.Now.ToUniversalTime(),
                ExpiresUtc = DateTime.Now.AddMinutes(5)
            };

            tokenRepo.Add(newRefreshToken);
            return newRefreshToken;
        }

        public async Task<ResponseViewModel> ResendEmailConfirmation(Guid currentUserId, ResendEmailConfirmationViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());

            if (user == null)
                throw new ArgumentException(ErrorMessage.USER_DOES_NOT_EXIST);

            if (user.EmailConfirmed)
                throw new ArgumentException("Email Address already Confirmed");


            await SendEmailConfirmationLink(user.Id, user.Email);

            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        //for manual email confirmation
        public async Task<ResponseViewModel> ForceEmailConfirm(Guid currentUserId, RegisterResponseViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
                throw new ArgumentException(ErrorMessage.USER_DOES_NOT_EXIST);

            if (user.EmailConfirmed)
                throw new ArgumentException("Email Address already Confirmed");

            user.EmailConfirmed = true;

            await _userManager.UpdateAsync(user);
            return new ResponseViewModel<string> { Data = "", Success = true };
        }
    }
}