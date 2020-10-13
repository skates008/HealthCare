using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Constant;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Constant;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace CareTaskr.Service.Service
{
    public class UserManagementService : ParentService, IUserManagementService
    {

        private readonly IAccountService _accountService;
        private readonly IEmailService _emailService;

        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;
        private readonly RoleManager<Role> _roleManager;
        private readonly ViewRender _viewRender;

        public UserManagementService(IGenericUnitOfWork genericUnitOfWork,
            RoleManager<Role> roleManager,
            IEmailService emailService, ViewRender viewRender,
            IAccountService accountService,
            IMapper mapper) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _roleManager = roleManager;
            _mapper = mapper;
            _viewRender = viewRender;
            _emailService = emailService;
            _accountService = accountService;
        }

        private static UserType GetUserTypeByRoleId(Guid roleId)
        {
            UserType userType;
            if (roleId == new Guid(ApplicationConstants.SuperAdminRoleGuid))
                userType = UserType.Owner;

            else if (roleId == new Guid(ApplicationConstants.AdminRoleGuid))
                userType = UserType.Manager;

            else if (roleId == new Guid(ApplicationConstants.TherapistRoleGuid))
                userType = UserType.User;

            else throw new ArgumentException("Invalid Role");

            return userType;
        }

        #region Role

        public async Task<ResponseViewModel> CreateRole(Guid currentUserId, RoleRegisterRequestViewModel model)
        {
            var roleRepo = _genericUnitOfWork.GetRepository<Role, Guid>();
            var roleTaskActionRepo = _genericUnitOfWork.GetRepository<RoleTaskAction, Guid>();

            var roleExists = await _roleManager.FindByNameAsync(model.Name);
            if (roleExists != null)
                throw new ArgumentException("Role Already Exists");


            var role = new Role
            {
                Id = Guid.NewGuid(),
                Name = model.Name,
                SystemDefined = false,
                CreatedDate = GeneralService.CurrentDate,
                CreatedBy = currentUserId,
                IsActive = true
            };

            model.TaskAction.ForEach(m =>
            {
                if (m.IsChecked)
                {
                    var roletaskAction = new RoleTaskAction
                    {
                        TaskActionId = m.Id,
                        RoleId = role.Id
                    };
                    roleTaskActionRepo.Add(roletaskAction);
                }
            });

            roleRepo.Add(role);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public ResponseViewModel UpdateRole(Guid currentUserId, UpdateRoleRequestViewModel model)
        {
            var roleRepo = _genericUnitOfWork.GetRepository<Role, Guid>();
            var roleTaskActionRepo = _genericUnitOfWork.GetRepository<RoleTaskAction, Guid>();

            var roleExists = roleRepo.GetAll().Where(x => x.Name == model.Name && x.Id != model.Id);
            if (roleExists.Any())
                throw new ArgumentException("Role Already Exists");


            var roleEntity = _genericUnitOfWork.GetRepository<Role, Guid>().FirstOrDefault(c => c.Id == model.Id);

            var roleTaskActionList = roleTaskActionRepo.GetAll().Where(x => x.RoleId == model.Id);
            roleTaskActionList.ToList().ForEach(r => { roleTaskActionRepo.Delete(r); });


            roleEntity.Name = model.Name;

            roleEntity.ModifiedDate = GeneralService.CurrentDate;
            roleEntity.ModifiedBy = currentUserId;


            model.TaskAction.ForEach(m =>
            {
                if (m.IsChecked)
                {
                    var roletaskAction = new RoleTaskAction
                    {
                        TaskActionId = m.Id,
                        RoleId = model.Id
                    };
                    roleTaskActionRepo.Add(roletaskAction);
                }
            });

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> { Data = "", Success = true };
        }

        public DataSourceResult ListRole(DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<Role, Guid>().GetAll().AsQueryable();

            var result = queryable.ToDataSourceResult<Role, RoleListViewModel>(
                _mapper, dataRequest, new Sort { Field = "Hierarchy", Direction = SortOrder.ASCENDING });


            return result;
        }

        public ResponseViewModel<RoleResponseViewModel> GetRoleById(Guid id)
        {
            var repo = _genericUnitOfWork.GetRepository<Role, Guid>();
            var moduleRepo = _genericUnitOfWork.GetRepository<Module, Guid>();

            var role = repo.FirstOrDefault(c => c.Id == id);

            if (role == null)
                throw new ArgumentException("Role does not exists");


            var result = moduleRepo.GetAll().ToList().Select(p => new ModuleViewModel
            {
                ModuleName = p.ModuleName,
                TaskAction = ListPageTree(id, p.ModuleId)
            }).ToList();

            var roleResponse = new RoleResponseViewModel
            {
                Id = role.Id,
                Name = role.Name,
                Modules = result
            };


            return new ResponseViewModel<RoleResponseViewModel> { Data = roleResponse, Success = true };
        }

        public List<TaskActionViewModel> ListPageTree(Guid roleId, int id)
        {
            var taskActionRepo = _genericUnitOfWork.GetRepository<TaskAction, int>().GetAll()
                .Where(x => x.ModuleId == id);
            var moduleRepo = _genericUnitOfWork.GetRepository<RoleTaskAction, int>().GetAll()
                .Where(x => x.RoleId == roleId && x.TaskAction.ModuleId == id);


            var result = from t in taskActionRepo
                         join rt in moduleRepo on t.Id equals rt.TaskActionId into Details
                         from m in Details.DefaultIfEmpty()
                         select new TaskActionViewModel
                         {
                             Id = t.Id,
                             DisplayName = t.DisplayName,
                             ModuleId = t.ModuleId,
                             IsChecked = m != null ? true : false
                         };
            return result.ToList();
        }


        public ResponseViewModel DeleteRole(Guid currentUserId, Guid roleId)
        {
            var roleRepo = _genericUnitOfWork.GetRepository<Role, Guid>();
            var roleEntity = roleRepo.FirstOrDefault(x => x.Id == roleId);
            if (roleEntity == null)
                throw new ArgumentException("Role Does not exist");
            if (roleEntity.SystemDefined)
                throw new ArgumentException("Cannot Delete Role");


            roleEntity.ModifiedBy = currentUserId;
            roleEntity.ModifiedDate = GeneralService.CurrentDate;
            roleEntity.IsActive = false;
            roleRepo.Update(roleEntity);


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel { Success = true };
        }


        public ResponseViewModel<List<ModuleViewModel>> InitRoleCreate()
        {
            var moduleRepo = _genericUnitOfWork.GetRepository<Module, Guid>();

            var result = moduleRepo.GetAll().ToList().Select(p => new ModuleViewModel
            {
                ModuleName = p.ModuleName,
                TaskAction = ListTaskActionModule(p.ModuleId)
            }).ToList();

            return new ResponseViewModel<List<ModuleViewModel>> { Data = result, Success = true };
        }


        public List<TaskActionViewModel> ListTaskActionModule(int id)
        {
            var result = _genericUnitOfWork.GetRepository<TaskAction, int>().GetAll().Where(x => x.ModuleId == id)
                .Select(b => new TaskActionViewModel
                {
                    Id = b.Id,
                    DisplayName = b.DisplayName,
                    ActionName = b.ActionName,
                    ModuleId = b.ModuleId
                }).ToList();

            return result;
        }

        #endregion

        #region User

        public async Task<ResponseViewModel> AddUser(Guid currentUserId, UserRequestViewModel model)
        {
            var providerUserRepo = _genericUnitOfWork.GetRepository<ProviderUser, int>();
            var userRoleRepo = _genericUnitOfWork.GetRepository<UserRole, Guid>();
            var provider = GetUserProvider(currentUserId);
            var repo = _genericUnitOfWork.GetRepository<User, Guid>();
            var users = repo.GetAll();

            var emailExists = users.Any(c => c.Email == model.Email.Trim());
            if (emailExists)
                throw new ArgumentNullException("User with the email already exists in the system",
                    innerException: null);

            var phoneExists = users.Any(c => c.PhoneNumber == model.PhoneNumber.Trim());
            if (phoneExists)
                throw new ArgumentNullException("User with the phone number already exists in the system",
                    innerException: null);

            var userType = GetUserTypeByRoleId(model.RoleId);

            var addressEntity = _mapper.Map<Address>(model.Address);


            #region Insert user

            var mappedUser = _mapper.Map<UserRequestViewModel, User>(model);

            mappedUser.Id = Guid.NewGuid();
            mappedUser.AccessFailedCount = 0;
            mappedUser.LockoutEnabled = false;
            mappedUser.TwoFactorEnabled = false;
            mappedUser.SecurityStamp = Guid.NewGuid().ToString();
            mappedUser.UserName = model.Email;
            mappedUser.PhoneNumber = model.PhoneNumber;
            mappedUser.Email = model.Email;
            mappedUser.UserType = userType;
            mappedUser.IsActive = true;
            mappedUser.CreatedById = currentUserId;
            mappedUser.CreatedDate = GeneralService.CurrentDate;
            mappedUser.IsRegistrationComplete = true;
            mappedUser.Address = addressEntity;

            repo.Add(mappedUser);

            #endregion

            #region Link user to provider

            var provideruser = new ProviderUser
            {
                Provider = provider,
                UserId = mappedUser.Id
            };

            #endregion

            providerUserRepo.Add(provideruser);

            #region Insert Role

            _genericUnitOfWork.GetRepository<UserRole, Guid>().Add(new UserRole
            {
                UserId = mappedUser.Id,
                RoleId = model.RoleId
            });

            #endregion;


            _genericUnitOfWork.SaveChanges();

            UpdateUserTeams(ref mappedUser, model.Teams);


            #region Send  Email

            await _accountService.SendEmailConfirmationLink(mappedUser.Id, mappedUser.Email);


            #endregion

            return new ResponseViewModel<string> { Data = "", Success = true };
        }


        public ResponseViewModel UpdateUser(Guid currentUserId, UserViewModel model)
        {
            var provider = GetUserProvider(currentUserId);
            var repo = _genericUnitOfWork.GetRepository<User, Guid>();
            var users = repo.GetAll();

            var providerUserRepo = _genericUnitOfWork.GetRepository<ProviderUser, int>();
            var userEntity = repo.FirstOrDefault(c => c.Id == model.Id);

            if (userEntity == null)
                throw new ArgumentException("User doesnot exists");

            //if (userEntity.SystemDefined)
            //    throw new ArgumentException("Cannot Update User");


            //if (userEntity.UserType == UserType.Owner)
            //    throw new ArgumentException("Cannot Update User");


            var userRoleRepo = _genericUnitOfWork.GetRepository<UserRole, Guid>();

            var emailExists = users.Any(c => c.Email == model.Email.Trim() && c.Id != model.Id);
            if (emailExists)
                throw new ArgumentException("User with the email already exists in the system", innerException: null);

            var phoneExists = users.Any(c => c.PhoneNumber == model.PhoneNumber.Trim() && c.Id != model.Id);
            if (phoneExists)
                throw new ArgumentException("User with the phone number already exists in the system",
                    innerException: null);

            var userType = GetUserTypeByRoleId(model.RoleId);

            #region Update User

            var userMapped = _mapper.Map(model, userEntity);
            if (userMapped.AddressId == null)
            {
                userMapped.Address = _mapper.Map<Address>(model.Address);
            }
            userMapped.UserType = userType;
            userMapped.ModifiedById = currentUserId;
            userMapped.ModifiedDate = GeneralService.CurrentDate;
            userMapped.IsRegistrationComplete = true;


            repo.Update(userMapped);

            #endregion

            #region Insert Role

            var userRole = userRoleRepo.FirstOrDefault(c => c.UserId == userEntity.Id);

            if (userRole == null) //add
            {
                _genericUnitOfWork.GetRepository<UserRole, Guid>().Add(new UserRole
                {
                    UserId = userEntity.Id,
                    RoleId = model.RoleId
                });
            }
            else //update
            {
                userRoleRepo.Delete(userRole);

                _genericUnitOfWork.GetRepository<UserRole, Guid>().Add(new UserRole
                {
                    UserId = userEntity.Id,
                    RoleId = model.RoleId
                });
            }

            #endregion;

            #region Link to Provider

            var providerUserEntity = providerUserRepo.FirstOrDefault(c => c.UserId == userEntity.Id);

            if (userRole == null) //add
            {
                _genericUnitOfWork.GetRepository<ProviderUser, Guid>().Add(new ProviderUser
                {
                    Provider = provider,
                    UserId = userEntity.Id
                });
            }
            else //update
            {
                providerUserEntity.Provider = provider;
                providerUserRepo.Update(providerUserEntity);
            }

            #endregion;

            _genericUnitOfWork.SaveChanges();

            UpdateUserTeams(ref userMapped, model.Teams);

            return new ResponseViewModel<string> { Data = "", Success = true };
        }


        public ResponseViewModel<UserViewModel> GetUserById(Guid currentUserId, Guid userId)
        {
            var repo = _genericUnitOfWork.GetRepository<User, Guid>();
            var roleRepo = _genericUnitOfWork.GetRepository<UserRole, Guid>();


            var user = repo.FirstOrDefault(c => c.Id == userId);

            if (user == null)
                throw new ArgumentException("User does not exists");
            var role = roleRepo.FirstOrDefault(x => x.UserId == userId);

            var result = _mapper.Map<User, UserViewModel>(user);
            result.RoleId = role.RoleId;

            return new ResponseViewModel<UserViewModel> { Data = result, Success = true };
        }

        public DataSourceResult ListUsers(Guid currentUserId, DataRequestModel dataRequest)
        {
            var provider = GetUserProvider(currentUserId);
            var user = _genericUnitOfWork.GetRepository<User, Guid>().GetAll(x => x.IsActive);
            var providerUser = _genericUnitOfWork.GetRepository<ProviderUser, Guid>().GetAll();

            var queryable = user.Join(providerUser.Where(x => x.Provider == provider)
                , u => u.Id,
                pu => pu.UserId, (u, pu) => new
                {
                    User = u,
                    providerUser = pu
                }).Select(c => new UserListViewModel
                {
                    Id = c.User.Id,
                    FirstName = c.User.FirstName,
                    LastName = c.User.LastName,
                    FullName = c.User.FullName,
                    Email = c.User.Email,
                    Role = c.User.UserRoles.FirstOrDefault().Role.Name,
                    UserType = c.User.UserType.ToString(),
                    CreatedDate = c.User.CreatedDate
                });

            if (dataRequest.Filter != null)
                if (dataRequest.Filter.ContainsKey("name") && dataRequest.Filter["name"] != null)

                {
                    var filter = dataRequest.Filter["name"];
                    queryable = queryable.Where(p => p.FullName.Contains(filter) || p.FirstName.Contains(filter)
                                                                                 || p.Email.Contains(filter)
                                                                                 || p.LastName.Contains(filter));
                }


            var result = queryable.ToDataSourceResult(dataRequest,
                new Sort { Field = "CreatedDate", Direction = SortOrder.DESCENDING });
            return result;
        }

        public ResponseViewModel DeleteUser(Guid currentUserId, Guid userId)
        {
            var currentDate = GeneralService.CurrentDate;
            var userRepo = _genericUnitOfWork.GetRepository<User, Guid>();


            var userEntity = userRepo.FirstOrDefault(x => x.Id == userId);
            if (userEntity == null)
                throw new ArgumentException("User Doesnot exists");


            userEntity.IsActive = false;
            userEntity.ModifiedDate = currentDate;
            userEntity.ModifiedById = currentUserId;


            userRepo.Update(userEntity);

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel { Success = true };
        }

        #endregion


        #region Teams

        public ResponseViewModel CreateTeam(Guid currentUserId, TeamRequestViewModel model)
        {
            return createUpdateTeam(currentUserId, model, Guid.Empty);
        }

        public ResponseViewModel UpdateTeam(Guid currentUserId, Guid teamId, TeamRequestViewModel model)
        {
            return createUpdateTeam(currentUserId, model, teamId);
        }


        private ResponseViewModel createUpdateTeam(Guid currentUserId, TeamRequestViewModel model, Guid teamId)
        {
            var repo = _genericUnitOfWork.GetRepository<Team, int>();

            if (repo.FirstOrDefault(x => x.Name == model.Name && x.PublicId != teamId) != null)
                throw new ArgumentException($"A Team named '{model.Name}' already exists!");

            Team team;
            if (teamId != Guid.Empty)
            {
                //UPDATE
                team = GetEntity<Team, int>(teamId);
                team.ModifiedById = currentUserId;
                team.ModifiedDate = GeneralService.CurrentDate;
            }
            else
            {
                //CREATE
                team = new Team
                {
                    CreatedDate = GeneralService.CurrentDate,
                    CreatedById = currentUserId,
                    IsActive = true
                };
            }

            team.Name = model.Name;
            team.Provider = GetUserProvider(currentUserId);

            if (teamId == Guid.Empty)
                repo.Add(team);
            else
                repo.Update(team);


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<TeamViewModel> { Data = _mapper.Map<TeamViewModel>(team), Success = true };
        }

        public ResponseViewModel GetTeam(Guid currentUserId, Guid teamId)
        {
            var team = GetEntity<Team, int>(teamId);
            return new ResponseViewModel<TeamViewModel> { Data = _mapper.Map<TeamViewModel>(team), Success = true };
        }


        public ResponseViewModel ListTeamUsers()
        {
            var team = _genericUnitOfWork.GetRepository<Team, Guid>().GetAll().ToList();

            var result = team.Select(r => new TeamResourceViewModel
            {
                Id = r.Name.ToString(),
                Title = r.Name,
                Children = r.Users
                    .Select(c => new ResourceViewModel
                    {
                        Id = r.Name + "_" + c.UserId.ToString().ToUpper(),
                        Title = c.User.FullName
                    }).ToList()
            }).ToList();
            //var mappedResult = _mapper.Map<List<TeamResourceViewModel>>(team.ToList());


            return new ResponseViewModel<List<TeamResourceViewModel>> { Data = result, Success = true };
        }

        //for grid
        public DataSourceResult ListTeams(Guid currentUserId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<Team, Guid>().GetAll().AsQueryable();

            var result = queryable.ToDataSourceResult<Team, TeamViewModel>(_mapper, dataRequest,
                new Sort { Field = "CreatedDate", Direction = SortOrder.ASCENDING });

            return result;
        }

        public ResponseViewModel DeleteTeam(Guid currentUserId, Guid teamId)
        {
            DeleteEntity<Team, int>(currentUserId, teamId);
            return new ResponseViewModel<TeamViewModel> { Success = true };
        }

        public ResponseViewModel AddTeamUser(Guid currentUserId, Guid teamId, TeamUserRequestViewModel model)
        {
            var team = GetEntity<Team, int>(teamId);
            var user = GetUser(model.Id);

            if (!user.Providers.Any(x => x.Provider == team.Provider))
                throw new ArgumentException("User does not belong to provider!");


            var repo = _genericUnitOfWork.GetRepository<TeamUser, int>();

            //need to ignore the globalquery (isActive) in case we need to add an already deleted user to the team 
            var teamUser = repo.GetAllIgnoreGlobalQueries(x => x.User == user && x.Team == team).FirstOrDefault();
            if (teamUser == null)
            {
                teamUser = new TeamUser
                {
                    Team = team,
                    User = user
                };
                team.Users.Add(teamUser);
            }
            else
            {
                teamUser.IsActive = true;
            }

            team = UpdateEntity<Team, int>(team);

            return new ResponseViewModel<TeamViewModel> { Data = _mapper.Map<TeamViewModel>(team), Success = true };
        }

        public ResponseViewModel DeleteTeamUser(Guid currentUserId, Guid teamId, Guid userId)
        {
            var team = GetEntity<Team, int>(teamId);

            var teamUser = team.Users.FirstOrDefault(x => x.UserId == userId);
            if (teamUser != null) teamUser.IsActive = false;

            UpdateEntity<Team, int>(team);

            return new ResponseViewModel<TeamViewModel> { Success = true };
        }

        private void UpdateUserTeams(ref User user, List<UserTeamViewModel> userTeams)
        {
            var repo = _genericUnitOfWork.GetRepository<TeamUser, int>();
            var userId = user.Id;

            if (user.Teams == null) user.Teams = new List<TeamUser>();
            foreach (var x in user.Teams)
            {
                x.IsActive = false;
                repo.Update(x);
            }

            foreach (var userTeam in userTeams)
            {
                var ut = repo.GetAllIgnoreGlobalQueries(x => x.UserId == userId && x.Team.PublicId == userTeam.Id)
                    .FirstOrDefault();
                if (ut == null)
                {
                    var team = GetEntity<Team, int>(userTeam.Id);
                    ut = new TeamUser { User = user, Team = team };
                    repo.Add(ut);
                    user.Teams.Add(ut);
                }
                else
                {
                    ut.IsActive = true;
                    repo.Update(ut);
                }
            }

            _genericUnitOfWork.SaveChanges();
        }

        #endregion
    }
}