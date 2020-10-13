using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Caretaskr.Common.Configuration;
using Caretaskr.Data;
using CareTaskr.Domain.Constant;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Entities.Account;
using CareTaskr.Domain.Enum;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CareTaskr.Service
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }

    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ApplicationContext _context;
        private readonly ILogger _logger;
        private readonly RoleManager<Role> _roleManager;
        private readonly UserManager<User> _userManager;

        public DatabaseInitializer(ApplicationContext context, ILogger<DatabaseInitializer> logger,
            UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public virtual async Task SeedAsync()
        {
            try
            {
                await _context.Database.MigrateAsync().ConfigureAwait(false);
                await RemoveUserPages(_context);
                SeedFundCateogry(_context);
                await SeedUserManagement(_context);
                SeedCountry(_context);
                SeedProvider(_context);

                FIX_DATA_ISSUES(_context);

                SetDataKeysForExistingEntities(_context);
            }

            catch (Exception ex)
            {
                //do nothing
            }
        }



        public async Task RemoveUserPages(ApplicationContext context)
        {
            await context.Database.ExecuteSqlRawAsync("DELETE FROM [UserPages]");
        }

        private async Task EnsureRoleAsync(Role role, List<int> menuIds)
        {
            _context.Roles.AddOrUpdate(ref role, x => new {x.Id});

            var userPages = new List<UserPage>();

            if (menuIds.Any())

                menuIds.Distinct().ToList()
                    .ForEach(m => { userPages.Add(new UserPage {PageId = m, RoleId = role.Id}); });

            userPages.ForEach(c => { _context.UserPages.AddOrUpdate(ref c, u => new {u.PageId, u.RoleId}); });


            await _context.SaveChangesAsync().ConfigureAwait(false);
        }

        private async Task EnsureTaskActionSeed(Role role, List<int> taskIds)
        {
            var roleActions = new List<RoleTaskAction>();

            if (taskIds.Any())

                taskIds.Distinct().ToList().ForEach(m =>
                {
                    roleActions.Add(new RoleTaskAction {TaskActionId = m, RoleId = role.Id});
                });

            roleActions.ForEach(c =>
            {
                _context.RoleTaskActions.AddOrUpdate(ref c, u => new {u.TaskActionId, u.RoleId});
            });


            _context.SaveChanges();
        }


        private async Task<User> CreateUserAsync(User user, string password, string[] roles)
        {
            if (await _userManager.FindByNameAsync(user.UserName) == null)
            {
                var result = await _userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    user = await _userManager.FindByNameAsync(user.UserName);
                    result = await _userManager.AddToRolesAsync(user, roles.Distinct());
                    if (result.Succeeded)
                        return user;
                    await _userManager.DeleteAsync(user);
                }

                throw new Exception(
                    $"Seeding \"{user.UserName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");
            }

            return user;
        }


        #region Fund Category

        public void SeedFundCateogry(ApplicationContext context)
        {
            try
            {
                if (!context.FundCategorys.Any())
                {
                    var fundCategories = new List<FundCategory>
                    {
                        new FundCategory {Id = 1, Name = SourceOfBudget.NDIS.ToString(), IsActive = true},
                        new FundCategory {Id = 2, Name = SourceOfBudget.SelfFunded.ToString(), IsActive = true},
                        new FundCategory {Id = 3, Name = SourceOfBudget.PlanManaged.ToString(), IsActive = true}
                    };

                    fundCategories.ForEach(c => { context.FundCategorys.AddOrUpdate(ref c, x => new {x.Id}); });
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
            }


        }

        #endregion

        #region TEMP
        private void FIX_DATA_ISSUES(ApplicationContext context)
        {
            try
            {
                context.Careplans.Where(x => x.TotalBudget == 0).ForEachAsync(x =>
                 {
                     x.TotalBudget = (decimal)x.FundedSupports.Sum(x => x.FundAllocated);
                     context.Update(x);
                 }
                );
                context.SaveChanges();
            }
            catch (Exception ex)
            {
            }
        }
        #endregion

        #region User Management

        public async Task SeedUserManagement(ApplicationContext context)
        {
            #region Pages

            try
            {
                var pages = new List<Page>
                {
                    new Page
                    {
                        Id = 1, Path = "/provider-dashboard", Title = "Dashboard", DisplayOrder = 1,
                        Icon = "flaticon-home", ShowInView = true
                    },
                    new Page
                    {
                        Id = 200, Path = "/therapist-dashboard", Title = "Dashboard", DisplayOrder = 1,
                        Icon = "flaticon-home", ShowInView = true
                    },

                    new Page
                    {
                        Id = 2, Path = "/participant-record", Title = "Client Records", DisplayOrder = 2,
                        Icon = "flaticon-users", ShowInView = true
                    },
                    new Page
                    {
                        Id = 3, Path = "/provider-appointments", Title = "Appointments", DisplayOrder = 3,
                        Icon = "flaticon-calendar-1", ShowInView = true
                    },
                    new Page
                    {
                        Id = 4, Path = "/careplans", Title = "Care Plans", DisplayOrder = 4, Icon = "flaticon-folder-1",
                        ShowInView = true
                    },
                    new Page
                    {
                        Id = 8, Path = "/times/timeEntry", Title = "Time Entries", DisplayOrder = 5,
                        Icon = "flaticon-stopwatch", ShowInView = true
                    },
                    new Page
                    {
                        Id = 12, Path = "/billing", Title = "Billing", DisplayOrder = 6, Icon = "flaticon-list-1",
                        ShowInView = true
                    },


                    new Page
                    {
                        Id = 5, Path = "/", Title = "Settings", DisplayOrder = 8, Icon = "flaticon-cogwheel-2",
                        ShowInView = true
                    },
                    new Page
                    {
                        Id = 10, Path = "/teams", Title = "Teams", DisplayOrder = 86, Icon = "", ShowInView = true,
                        ParentPageId = 5
                    },
                    new Page
                    {
                        Id = 6, Path = "/user-management/users", Title = "Users", DisplayOrder = 87, Icon = "",
                        ShowInView = true, ParentPageId = 5
                    },
                    new Page
                    {
                        Id = 7, Path = "/user-management/roles", Title = "Roles", DisplayOrder = 88, Icon = "",
                        ShowInView = false, ParentPageId = 5
                    },
                    new Page
                    {
                        Id = 9, Path = "/settings/billableItems", Title = "Billable Items", DisplayOrder = 89,
                        Icon = "", ShowInView = true, ParentPageId = 5
                    },
                    new Page
                    {
                        Id = 11, Path = "/provider/basic", Title = "Business Settings", DisplayOrder = 90, Icon = "",
                        ShowInView = true, ParentPageId = 5
                    },


                    new Page
                    {
                        Id = 100, Path = "/dashboard", Title = "Dashboard", DisplayOrder = 1,
                        Icon = "flaticon2-architecture-and-city", ShowInView = true
                    },
                    new Page
                    {
                        Id = 101, Path = "/participant-appointments", Title = "My Appointments", DisplayOrder = 2,
                        Icon = "flaticon2-expand", ShowInView = true
                    },
                    new Page
                    {
                        Id = 102, Path = "/profile", Title = "My Profile", DisplayOrder = 3,
                        Icon = "flaticon2-user-outline-symbol", ShowInView = true
                    },
                    new Page
                    {
                        Id = 103, Path = "/participant-careplan", Title = "My CarePlan", DisplayOrder = 4,
                        Icon = "flaticon2-heart-rate-monitor", ShowInView = true
                    },
                    new Page
                    {
                        Id = 104, Path = "/statements", Title = "My Statement", DisplayOrder = 5,
                        Icon = "flaticon2-paper", ShowInView = true
                    },
                    new Page
                    {
                        Id = 105, Path = "/my-settings", Title = "Settings", DisplayOrder = 6,
                        Icon = "flaticon-cogwheel-2", ShowInView = false
                    }
                };

                pages.ForEach(c => { context.Pages.AddOrUpdate(ref c, x => new {x.Id}); });
                context.SaveChanges();
            }

            catch (Exception ex)
            {
                //do nothing
            }

            #endregion

            var adminMenu = new List<int> {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};

            var participantMenu = new List<int> {100, 101, 102, 103, 104};

            var therapistMenu = new List<int> {200, 2, 3, 4, 8, 9, 10};


            #region Module

            var modules = new List<Module>
            {
                new Module {ModuleName = "UserManagement", DisplayName = "User Management"},
                new Module {ModuleName = "PatientManagement", DisplayName = "Patient Management"},
                new Module {ModuleName = "CarePlanManagement", DisplayName = "Care Plan Management"},
                new Module {ModuleName = "TimeEntriesManagement", DisplayName = "Time Entries Management"}
                //new Module{ ModuleName="BillingManagement",          DisplayName="Billing Management"          },
            };
            modules.ForEach(c => { context.Modules.AddOrUpdate(ref c, x => new {x.ModuleName}); });
            context.SaveChanges();

            #endregion Module

            #region Task Action

            var taskActionData = new List<TaskAction>
            {
                #region User Management

                new TaskAction
                {
                    Id = 1, ActionName = "CreateUser", DisplayName = "Create User", PageId = 6,
                    ModuleId = context.Modules.Single(t => t.ModuleName == "UserManagement").ModuleId
                },
                new TaskAction
                {
                    Id = 2, ActionName = "UpdateUser", DisplayName = "Update User", PageId = 6,
                    ModuleId = context.Modules.Single(t => t.ModuleName == "UserManagement").ModuleId
                },
                new TaskAction
                {
                    Id = 3, ActionName = "ReadUser", DisplayName = "Read User", PageId = 6,
                    ModuleId = context.Modules.Single(t => t.ModuleName == "UserManagement").ModuleId
                },
                new TaskAction
                {
                    Id = 4, ActionName = "DeleteUser", DisplayName = "Delete User", PageId = 6,
                    ModuleId = context.Modules.Single(t => t.ModuleName == "UserManagement").ModuleId
                },

                #endregion

                #region Patient Management

                new TaskAction
                {
                    Id = 5, ActionName = "CreatePatient", DisplayName = "Create Patient",
                    ModuleId = context.Modules.Single(t => t.ModuleName == "PatientManagement").ModuleId
                },
                new TaskAction
                {
                    Id = 6, ActionName = "UpdatePatient", DisplayName = "Update Patient",
                    ModuleId = context.Modules.Single(t => t.ModuleName == "PatientManagement").ModuleId
                },
                new TaskAction
                {
                    Id = 7, ActionName = "ReadPatient", DisplayName = "Read Patient",
                    ModuleId = context.Modules.Single(t => t.ModuleName == "PatientManagement").ModuleId
                },
                new TaskAction
                {
                    Id = 8, ActionName = "DeletePatient", DisplayName = "Delete Patient",
                    ModuleId = context.Modules.Single(t => t.ModuleName == "PatientManagement").ModuleId
                },

                #endregion

                //#region Care Plan Management                                                                                                           

                //new TaskAction { ActionName = "Create", DisplayName = "Create",  PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "CarePlanManagement").ModuleId },
                //new TaskAction { ActionName = "Update", DisplayName = "Update",  PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "CarePlanManagement").ModuleId },
                //new TaskAction { ActionName = "Read",   DisplayName = "Read",    PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "CarePlanManagement").ModuleId },
                //new TaskAction { ActionName = "Delete", DisplayName = "Delete",  PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "CarePlanManagement").ModuleId },

                //#endregion


                //#region Time Entries Management                                                                                                             

                //new TaskAction { ActionName = "Create", DisplayName = "Create",  PageId = 8, ModuleId = context.Modules.Single(t => t.ModuleName == "TimeEntriesManagement").ModuleId },
                //new TaskAction { ActionName = "Update", DisplayName = "Update",  PageId = 8, ModuleId = context.Modules.Single(t => t.ModuleName == "TimeEntriesManagement").ModuleId },
                //new TaskAction { ActionName = "Read",   DisplayName = "Read",    PageId = 8, ModuleId = context.Modules.Single(t => t.ModuleName == "TimeEntriesManagement").ModuleId },
                //new TaskAction { ActionName = "Delete", DisplayName = "Delete",  PageId = 8, ModuleId = context.Modules.Single(t => t.ModuleName == "TimeEntriesManagement").ModuleId },

                //#endregion

                //#region Billing Management   

                //new TaskAction { ActionName = "Create", DisplayName = "Create",  PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "BillingManagement").ModuleId },
                //new TaskAction { ActionName = "Update", DisplayName = "Update",  PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "BillingManagement").ModuleId },
                //new TaskAction { ActionName = "Read",   DisplayName = "Read",    PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "BillingManagement").ModuleId },
                //new TaskAction { ActionName = "Delete", DisplayName = "Delete",  PageId = 6, ModuleId = context.Modules.Single(t => t.ModuleName == "BillingManagement").ModuleId },

                //#endregion
            };

            taskActionData.ForEach(t => context.TaskActions.AddOrUpdate(ref t, x => new {x.Id}));

            #endregion


            #region Roles and Super Admins

            var ownerRole = new Role
            {
                Id = new Guid(ApplicationConstants.SuperAdminRoleGuid),
                Name = "Owner",
                NormalizedName = "OWNER",
                Description = "Provider Primary User",
                IsActive = true,
                SystemDefined = true,
                Hierarchy = 1
            };
            await EnsureRoleAsync(ownerRole, adminMenu);


            var adminRole = new Role
            {
                Id = new Guid(ApplicationConstants.AdminRoleGuid),
                Name = "Manager",
                NormalizedName = "MANAGER",
                Description = "Manager",
                IsActive = true,
                SystemDefined = true,
                Hierarchy = 2
            };

            await EnsureRoleAsync(adminRole, adminMenu);

            var therapistRole = new Role
            {
                Id = new Guid(ApplicationConstants.TherapistRoleGuid),
                Name = "User",
                NormalizedName = "User",
                Description = "Therapist",
                IsActive = true,
                SystemDefined = true,
                Hierarchy = 3
            };

            await EnsureRoleAsync(therapistRole, therapistMenu);

            var participantRole = new Role
            {
                Id = new Guid(ApplicationConstants.ParticipantRoleGuid),
                Name = "Client",
                NormalizedName = "Client",
                Description = "Client",
                IsActive = true,
                SystemDefined = true,
                Hierarchy = 4
            };

            await EnsureRoleAsync(participantRole, participantMenu);

            var superadminemail = "admin@caretaskr.co";
            var createdDate = DateTime.Now;
            var superUser = new User
            {
                Id = new Guid(ApplicationConstants.SuperAdminUserGuid),
                FirstName = "Super",
                LastName = "Admin",
                FullName = "Super Admin",
                EmailConfirmed = true,
                Email = superadminemail,
                NormalizedEmail = superadminemail.ToUpper(),
                UserName = superadminemail,
                NormalizedUserName = superadminemail.ToUpper(),
                SecurityStamp = Guid.NewGuid().ToString(),
                UserType = UserType.Owner,
                SystemDefined = true,
                IsActive = true,
                IsRegistrationComplete = true
            };
            await CreateUserAsync(superUser, "Admin@123", new[] {ownerRole.Name});

            #region Role Task Action

            var adminTaskAction = new List<int> {1, 2, 3, 4, 5, 6, 7, 8};

            await EnsureTaskActionSeed(ownerRole, adminTaskAction);
            await EnsureTaskActionSeed(adminRole, adminTaskAction);

            var fieldTeamTaskAction = new List<int> {2, 3, 5, 6, 7};
            await EnsureTaskActionSeed(therapistRole, fieldTeamTaskAction);

            var participantTaskAction = new List<int> {6};
            await EnsureTaskActionSeed(participantRole, participantTaskAction);

            #endregion

            context.SaveChanges();

            #endregion
        }

        #endregion

        #region Country

        public void SeedCountry(ApplicationContext context)
        {
            try
            {
                if (!context.Countries.Any())
                {
                    var countries = new List<Country>
                    {
                        new Country {Id = 1, CountryName = "Afghanistan", CountryCode = "AF", IsActive = true},
                        new Country {Id = 2, CountryName = "Åland Islands", CountryCode = "AX", IsActive = true},
                        new Country {Id = 3, CountryName = "Albania", CountryCode = "AL", IsActive = true},
                        new Country {Id = 4, CountryName = "Algeria", CountryCode = "DZ", IsActive = true},
                        new Country {Id = 5, CountryName = "American Samoa", CountryCode = "AS", IsActive = true},
                        new Country {Id = 6, CountryName = "AndorrA", CountryCode = "AD", IsActive = true},
                        new Country {Id = 7, CountryName = "Angola", CountryCode = "AO", IsActive = true},
                        new Country {Id = 8, CountryName = "Anguilla", CountryCode = "AI", IsActive = true},
                        new Country {Id = 9, CountryName = "Antarctica", CountryCode = "AQ", IsActive = true},
                        new Country {Id = 10, CountryName = "Antigua and Barbuda", CountryCode = "AG", IsActive = true},
                        new Country {Id = 11, CountryName = "Argentina", CountryCode = "AR", IsActive = true},
                        new Country {Id = 12, CountryName = "Armenia", CountryCode = "AM", IsActive = true},
                        new Country {Id = 13, CountryName = "Aruba", CountryCode = "AW", IsActive = true},
                        new Country {Id = 14, CountryName = "Australia", CountryCode = "AU", IsActive = true},
                        new Country {Id = 15, CountryName = "Austria", CountryCode = "AT", IsActive = true},
                        new Country {Id = 16, CountryName = "Azerbaijan", CountryCode = "AZ", IsActive = true},
                        new Country {Id = 17, CountryName = "Bahamas", CountryCode = "BS", IsActive = true},
                        new Country {Id = 18, CountryName = "Bahrain", CountryCode = "BH", IsActive = true},
                        new Country {Id = 19, CountryName = "Bangladesh", CountryCode = "BD", IsActive = true},
                        new Country {Id = 20, CountryName = "Barbados", CountryCode = "BB", IsActive = true},
                        new Country {Id = 21, CountryName = "Belarus", CountryCode = "BY", IsActive = true},
                        new Country {Id = 22, CountryName = "Belgium", CountryCode = "BE", IsActive = true},
                        new Country {Id = 23, CountryName = "Belize", CountryCode = "BZ", IsActive = true},
                        new Country {Id = 24, CountryName = "Benin", CountryCode = "BJ", IsActive = true},
                        new Country {Id = 25, CountryName = "Bermuda", CountryCode = "BM", IsActive = true},
                        new Country {Id = 26, CountryName = "Bhutan", CountryCode = "BT", IsActive = true},
                        new Country {Id = 27, CountryName = "Bolivia", CountryCode = "BO", IsActive = true},
                        new Country
                        {
                            Id = 28, CountryName = "Bosnia and Herzegovina", CountryCode = "BA", IsActive = true
                        },
                        new Country {Id = 29, CountryName = "Botswana", CountryCode = "BW", IsActive = true},
                        new Country {Id = 30, CountryName = "Bouvet Island", CountryCode = "BV", IsActive = true},
                        new Country {Id = 31, CountryName = "Brazil", CountryCode = "BR", IsActive = true},
                        new Country
                        {
                            Id = 32, CountryName = "British Indian Ocean Territory", CountryCode = "IO", IsActive = true
                        },
                        new Country {Id = 33, CountryName = "Brunei Darussalam", CountryCode = "BN", IsActive = true},
                        new Country {Id = 34, CountryName = "Bulgaria", CountryCode = "BG", IsActive = true},
                        new Country {Id = 35, CountryName = "Burkina Faso", CountryCode = "BF", IsActive = true},
                        new Country {Id = 36, CountryName = "Burundi", CountryCode = "BI", IsActive = true},
                        new Country {Id = 37, CountryName = "Cambodia", CountryCode = "KH", IsActive = true},
                        new Country {Id = 38, CountryName = "Cameroon", CountryCode = "CM", IsActive = true},
                        new Country {Id = 39, CountryName = "Canada", CountryCode = "CA", IsActive = true},
                        new Country {Id = 40, CountryName = "Cape Verde", CountryCode = "CV", IsActive = true},
                        new Country {Id = 41, CountryName = "Cayman Islands", CountryCode = "KY", IsActive = true},
                        new Country
                        {
                            Id = 42, CountryName = "Central African Republic", CountryCode = "CF", IsActive = true
                        },
                        new Country {Id = 43, CountryName = "Chad", CountryCode = "TD", IsActive = true},
                        new Country {Id = 44, CountryName = "Chile", CountryCode = "CL", IsActive = true},
                        new Country {Id = 45, CountryName = "China", CountryCode = "CN", IsActive = true},
                        new Country {Id = 46, CountryName = "Christmas Island", CountryCode = "CX", IsActive = true},
                        new Country
                        {
                            Id = 47, CountryName = "Cocos (Keeling) Islands", CountryCode = "CC", IsActive = true
                        },
                        new Country {Id = 48, CountryName = "Colombia", CountryCode = "CO", IsActive = true},
                        new Country {Id = 49, CountryName = "Comoros", CountryCode = "KM", IsActive = true},
                        new Country {Id = 50, CountryName = "Congo", CountryCode = "CG", IsActive = true},
                        new Country
                        {
                            Id = 51, CountryName = "Congo, The Democratic Republic of the", CountryCode = "CD",
                            IsActive = true
                        },
                        new Country {Id = 52, CountryName = "Cook Islands", CountryCode = "CK", IsActive = true},
                        new Country {Id = 53, CountryName = "Costa Rica", CountryCode = "CR", IsActive = true},
                        new Country {Id = 54, CountryName = "Cote D'Ivoire", CountryCode = "CI", IsActive = true},
                        new Country {Id = 55, CountryName = "Croatia", CountryCode = "HR", IsActive = true},
                        new Country {Id = 56, CountryName = "Cuba", CountryCode = "CU", IsActive = true},
                        new Country {Id = 57, CountryName = "Cyprus", CountryCode = "CY", IsActive = true},
                        new Country {Id = 58, CountryName = "Czech Republic", CountryCode = "CZ", IsActive = true},
                        new Country {Id = 59, CountryName = "Denmark", CountryCode = "DK", IsActive = true},
                        new Country {Id = 60, CountryName = "Djibouti", CountryCode = "DJ", IsActive = true},
                        new Country {Id = 61, CountryName = "Dominica", CountryCode = "DM", IsActive = true},
                        new Country {Id = 62, CountryName = "Dominican Republic", CountryCode = "DO", IsActive = true},
                        new Country {Id = 63, CountryName = "Ecuador", CountryCode = "EC", IsActive = true},
                        new Country {Id = 64, CountryName = "Egypt", CountryCode = "EG", IsActive = true},
                        new Country {Id = 65, CountryName = "El Salvador", CountryCode = "SV", IsActive = true},
                        new Country {Id = 66, CountryName = "Equatorial Guinea", CountryCode = "GQ", IsActive = true},
                        new Country {Id = 67, CountryName = "Eritrea", CountryCode = "ER", IsActive = true},
                        new Country {Id = 68, CountryName = "Estonia", CountryCode = "EE", IsActive = true},
                        new Country {Id = 69, CountryName = "Ethiopia", CountryCode = "ET", IsActive = true},
                        new Country
                        {
                            Id = 70, CountryName = "Falkland Islands (Malvinas)", CountryCode = "FK", IsActive = true
                        },
                        new Country {Id = 71, CountryName = "Faroe Islands", CountryCode = "FO", IsActive = true},
                        new Country {Id = 72, CountryName = "Fiji", CountryCode = "FJ", IsActive = true},
                        new Country {Id = 73, CountryName = "Finland", CountryCode = "FI", IsActive = true},
                        new Country {Id = 74, CountryName = "France", CountryCode = "FR", IsActive = true},
                        new Country {Id = 75, CountryName = "French Guiana", CountryCode = "GF", IsActive = true},
                        new Country {Id = 76, CountryName = "French Polynesia", CountryCode = "PF", IsActive = true},
                        new Country
                        {
                            Id = 77, CountryName = "French Southern Territories", CountryCode = "TF", IsActive = true
                        },
                        new Country {Id = 78, CountryName = "Gabon", CountryCode = "GA", IsActive = true},
                        new Country {Id = 79, CountryName = "Gambia", CountryCode = "GM", IsActive = true},
                        new Country {Id = 80, CountryName = "Georgia", CountryCode = "GE", IsActive = true},
                        new Country {Id = 81, CountryName = "Germany", CountryCode = "DE", IsActive = true},
                        new Country {Id = 82, CountryName = "Ghana", CountryCode = "GH", IsActive = true},
                        new Country {Id = 83, CountryName = "Gibraltar", CountryCode = "GI", IsActive = true},
                        new Country {Id = 84, CountryName = "Greece", CountryCode = "GR", IsActive = true},
                        new Country {Id = 85, CountryName = "Greenland", CountryCode = "GL", IsActive = true},
                        new Country {Id = 86, CountryName = "Grenada", CountryCode = "GD", IsActive = true},
                        new Country {Id = 87, CountryName = "Guadeloupe", CountryCode = "GP", IsActive = true},
                        new Country {Id = 88, CountryName = "Guam", CountryCode = "GU", IsActive = true},
                        new Country {Id = 89, CountryName = "Guatemala", CountryCode = "GT", IsActive = true},
                        new Country {Id = 90, CountryName = "Guernsey", CountryCode = "GG", IsActive = true},
                        new Country {Id = 91, CountryName = "Guinea", CountryCode = "GN", IsActive = true},
                        new Country {Id = 92, CountryName = "Guinea-Bissau", CountryCode = "GW", IsActive = true},
                        new Country {Id = 94, CountryName = "Guyana", CountryCode = "GY", IsActive = true},
                        new Country {Id = 95, CountryName = "Haiti", CountryCode = "HT", IsActive = true},
                        new Country
                        {
                            Id = 96, CountryName = "Heard Island and Mcdonald Islands", CountryCode = "HM",
                            IsActive = true
                        },
                        new Country
                        {
                            Id = 97, CountryName = "Holy See (Vatican City State)", CountryCode = "VA", IsActive = true
                        },
                        new Country {Id = 98, CountryName = "Honduras", CountryCode = "HN", IsActive = true},
                        new Country {Id = 99, CountryName = "Hong Kong", CountryCode = "HK", IsActive = true},
                        new Country {Id = 100, CountryName = "Hungary", CountryCode = "HU", IsActive = true},
                        new Country {Id = 101, CountryName = "Iceland", CountryCode = "IS", IsActive = true},
                        new Country {Id = 102, CountryName = "India", CountryCode = "IN", IsActive = true},
                        new Country {Id = 103, CountryName = "Indonesia", CountryCode = "ID", IsActive = true},
                        new Country
                        {
                            Id = 104, CountryName = "Iran, Islamic Republic Of", CountryCode = "IR", IsActive = true
                        },
                        new Country {Id = 105, CountryName = "Iraq", CountryCode = "IQ", IsActive = true},
                        new Country {Id = 106, CountryName = "Ireland", CountryCode = "IE", IsActive = true},
                        new Country {Id = 107, CountryName = "Isle of Man", CountryCode = "IM", IsActive = true},
                        new Country {Id = 108, CountryName = "Israel", CountryCode = "IL", IsActive = true},
                        new Country {Id = 109, CountryName = "Italy", CountryCode = "IT", IsActive = true},
                        new Country {Id = 110, CountryName = "Jamaica", CountryCode = "JM", IsActive = true},
                        new Country {Id = 111, CountryName = "Japan", CountryCode = "JP", IsActive = true},
                        new Country {Id = 112, CountryName = "Jersey", CountryCode = "JE", IsActive = true},
                        new Country {Id = 113, CountryName = "Jordan", CountryCode = "JO", IsActive = true},
                        new Country {Id = 115, CountryName = "Kazakhstan", CountryCode = "KZ", IsActive = true},
                        new Country {Id = 117, CountryName = "Kenya", CountryCode = "KE", IsActive = true},
                        new Country {Id = 118, CountryName = "Kiribati", CountryCode = "KI", IsActive = true},
                        new Country
                        {
                            Id = 119, CountryName = "Korea, Democratic People's Republic of", CountryCode = "KP",
                            IsActive = true
                        },

                        new Country {Id = 120, CountryName = "Korea, Republic of", CountryCode = "KR", IsActive = true},
                        new Country {Id = 121, CountryName = "Kuwait", CountryCode = "KW", IsActive = true},
                        new Country {Id = 122, CountryName = "Kyrgyzstan", CountryCode = "KG", IsActive = true},
                        new Country
                        {
                            Id = 123, CountryName = "Lao People's Democratic Republic", CountryCode = "LA",
                            IsActive = true
                        },

                        new Country {Id = 124, CountryName = "Latvia", CountryCode = "LV", IsActive = true},
                        new Country {Id = 125, CountryName = "Lebanon", CountryCode = "LB", IsActive = true},
                        new Country {Id = 126, CountryName = "Lesotho", CountryCode = "LS", IsActive = true},
                        new Country {Id = 127, CountryName = "Liberia", CountryCode = "LR", IsActive = true},
                        new Country
                        {
                            Id = 129, CountryName = "Libyan Arab Jamahiriya", CountryCode = "LY", IsActive = true
                        },
                        new Country {Id = 130, CountryName = "Liechtenstein", CountryCode = "LI", IsActive = true},
                        new Country {Id = 131, CountryName = "Lithuania", CountryCode = "LT", IsActive = true},
                        new Country {Id = 132, CountryName = "Luxembourg", CountryCode = "LU", IsActive = true},
                        new Country {Id = 133, CountryName = "Macao", CountryCode = "MO", IsActive = true},
                        new Country
                        {
                            Id = 134, CountryName = "Macedonia, The Former Yugoslav Republic of", CountryCode = "MK",
                            IsActive = true
                        },
                        new Country {Id = 135, CountryName = "Madagascar", CountryCode = "MG", IsActive = true},
                        new Country {Id = 136, CountryName = "Malawi", CountryCode = "MW", IsActive = true},
                        new Country {Id = 137, CountryName = "Malaysia", CountryCode = "MY", IsActive = true},
                        new Country {Id = 138, CountryName = "Maldives", CountryCode = "MV", IsActive = true},
                        new Country {Id = 139, CountryName = "Mali", CountryCode = "ML", IsActive = true},
                        new Country {Id = 140, CountryName = "Malta", CountryCode = "MT", IsActive = true},
                        new Country {Id = 141, CountryName = "Marshall Islands", CountryCode = "MH", IsActive = true},
                        new Country {Id = 142, CountryName = "Martinique", CountryCode = "MQ", IsActive = true},
                        new Country {Id = 143, CountryName = "Mauritania", CountryCode = "MR", IsActive = true},
                        new Country {Id = 144, CountryName = "Mauritius", CountryCode = "MU", IsActive = true},
                        new Country {Id = 145, CountryName = "Mayotte", CountryCode = "YT", IsActive = true},
                        new Country {Id = 146, CountryName = "Mexico", CountryCode = "MX", IsActive = true},
                        new Country
                        {
                            Id = 147, CountryName = "Micronesia, Federated States of", CountryCode = "FM",
                            IsActive = true
                        },
                        new Country
                        {
                            Id = 148, CountryName = "Moldova, Republic of", CountryCode = "MD", IsActive = true
                        },
                        new Country {Id = 149, CountryName = "Monaco", CountryCode = "MC", IsActive = true},
                        new Country {Id = 150, CountryName = "Mongolia", CountryCode = "MN", IsActive = true},
                        new Country {Id = 151, CountryName = "Montserrat", CountryCode = "MS", IsActive = true},
                        new Country {Id = 152, CountryName = "Morocco", CountryCode = "MA", IsActive = true},
                        new Country {Id = 153, CountryName = "Mozambique", CountryCode = "MZ", IsActive = true},
                        new Country {Id = 154, CountryName = "Myanmar", CountryCode = "MM", IsActive = true},
                        new Country {Id = 155, CountryName = "Namibia", CountryCode = "NA", IsActive = true},
                        new Country {Id = 156, CountryName = "Nauru", CountryCode = "NR", IsActive = true},
                        new Country {Id = 157, CountryName = "Nepal", CountryCode = "NP", IsActive = true},
                        new Country {Id = 159, CountryName = "Netherlands", CountryCode = "NL", IsActive = true},
                        new Country
                        {
                            Id = 160, CountryName = "Netherlands Antilles", CountryCode = "AN", IsActive = true
                        },
                        new Country {Id = 161, CountryName = "New Caledonia", CountryCode = "NC", IsActive = true},
                        new Country {Id = 162, CountryName = "New Zealand", CountryCode = "NZ", IsActive = true},
                        new Country {Id = 163, CountryName = "Nicaragua", CountryCode = "NI", IsActive = true},
                        new Country {Id = 164, CountryName = "Niger", CountryCode = "NE", IsActive = true},
                        new Country {Id = 165, CountryName = "Nigeria", CountryCode = "NG", IsActive = true},
                        new Country {Id = 166, CountryName = "Niue", CountryCode = "NU", IsActive = true},
                        new Country {Id = 167, CountryName = "Norfolk Island", CountryCode = "NF", IsActive = true},
                        new Country
                        {
                            Id = 168, CountryName = "Northern Mariana Islands", CountryCode = "MP", IsActive = true
                        },
                        new Country {Id = 169, CountryName = "Norway", CountryCode = "NO", IsActive = true},
                        new Country {Id = 170, CountryName = "Oman", CountryCode = "OM", IsActive = true},
                        new Country {Id = 171, CountryName = "Pakistan", CountryCode = "PK", IsActive = true},
                        new Country {Id = 172, CountryName = "Palau", CountryCode = "PW", IsActive = true},
                        new Country
                        {
                            Id = 173, CountryName = "Palestinian Territory, Occupied", CountryCode = "PS",
                            IsActive = true
                        },
                        new Country {Id = 174, CountryName = "Panama", CountryCode = "PA", IsActive = true},
                        new Country {Id = 175, CountryName = "Papua New Guinea", CountryCode = "PG", IsActive = true},
                        new Country {Id = 176, CountryName = "Paraguay", CountryCode = "PY", IsActive = true},
                        new Country {Id = 177, CountryName = "Peru", CountryCode = "PE", IsActive = true},
                        new Country {Id = 178, CountryName = "Philippines", CountryCode = "PH", IsActive = true},
                        new Country {Id = 179, CountryName = "Pitcairn", CountryCode = "PN", IsActive = true},
                        new Country {Id = 180, CountryName = "Poland", CountryCode = "PL", IsActive = true},
                        new Country {Id = 181, CountryName = "Portugal", CountryCode = "PT", IsActive = true},
                        new Country {Id = 182, CountryName = "Puerto Rico", CountryCode = "PR", IsActive = true},
                        new Country {Id = 183, CountryName = "Qatar", CountryCode = "QA", IsActive = true},
                        new Country {Id = 184, CountryName = "Reunion", CountryCode = "RE", IsActive = true},
                        new Country {Id = 185, CountryName = "Romania", CountryCode = "RO", IsActive = true},
                        new Country {Id = 186, CountryName = "Russian Federation", CountryCode = "RU", IsActive = true},
                        new Country {Id = 187, CountryName = "RWANDA", CountryCode = "RW", IsActive = true},
                        new Country {Id = 188, CountryName = "Saint Helena", CountryCode = "SH", IsActive = true},
                        new Country
                        {
                            Id = 189, CountryName = "Saint Kitts and Nevis", CountryCode = "KN", IsActive = true
                        },
                        new Country {Id = 190, CountryName = "Saint Lucia", CountryCode = "LC", IsActive = true},
                        new Country
                        {
                            Id = 191, CountryName = "Saint Pierre and Miquelon", CountryCode = "PM", IsActive = true
                        },
                        new Country
                        {
                            Id = 192, CountryName = "Saint Vincent and the Grenadines", CountryCode = "VC",
                            IsActive = true
                        },
                        new Country {Id = 193, CountryName = "Samoa", CountryCode = "WS", IsActive = true},
                        new Country {Id = 194, CountryName = "San Marino", CountryCode = "SM", IsActive = true},
                        new Country
                        {
                            Id = 195, CountryName = "Sao Tome and Principe", CountryCode = "ST", IsActive = true
                        },
                        new Country {Id = 196, CountryName = "Saudi Arabia", CountryCode = "SA", IsActive = true},
                        new Country {Id = 197, CountryName = "Senegal", CountryCode = "SN", IsActive = true},
                        new Country
                        {
                            Id = 198, CountryName = "Serbia and Montenegro", CountryCode = "CS", IsActive = true
                        },
                        new Country {Id = 199, CountryName = "Seychelles", CountryCode = "SC", IsActive = true},
                        new Country {Id = 200, CountryName = "Sierra Leone", CountryCode = "SL", IsActive = true},
                        new Country {Id = 201, CountryName = "Singapore", CountryCode = "SG", IsActive = true},
                        new Country {Id = 202, CountryName = "Slovakia", CountryCode = "SK", IsActive = true},
                        new Country {Id = 203, CountryName = "Slovenia", CountryCode = "SI", IsActive = true},
                        new Country {Id = 204, CountryName = "Solomon Islands", CountryCode = "SB", IsActive = true},
                        new Country {Id = 205, CountryName = "Somalia", CountryCode = "SO", IsActive = true},
                        new Country {Id = 206, CountryName = "South Africa", CountryCode = "ZA", IsActive = true},
                        new Country
                        {
                            Id = 207, CountryName = "South Georgia and the South Sandwich Islands", CountryCode = "GS",
                            IsActive = true
                        },
                        new Country {Id = 208, CountryName = "Spain", CountryCode = "ES", IsActive = true},
                        new Country {Id = 209, CountryName = "Sri Lanka", CountryCode = "LK", IsActive = true},
                        new Country {Id = 210, CountryName = "Sudan", CountryCode = "SD", IsActive = true},
                        new Country {Id = 211, CountryName = "Suriname", CountryCode = "SR", IsActive = true},
                        new Country
                        {
                            Id = 212, CountryName = "Svalbard and Jan Mayen", CountryCode = "SJ", IsActive = true
                        },
                        new Country {Id = 213, CountryName = "Swaziland", CountryCode = "SZ", IsActive = true},
                        new Country {Id = 214, CountryName = "Sweden", CountryCode = "SE", IsActive = true},
                        new Country {Id = 215, CountryName = "Switzerland", CountryCode = "CH", IsActive = true},
                        new Country
                        {
                            Id = 216, CountryName = "Syrian Arab Republic", CountryCode = "SY", IsActive = true
                        },
                        new Country
                        {
                            Id = 217, CountryName = "Taiwan, Province of China", CountryCode = "TW", IsActive = true
                        },
                        new Country {Id = 218, CountryName = "Tajikistan", CountryCode = "TJ", IsActive = true},
                        new Country
                        {
                            Id = 219, CountryName = "Tanzania, United Republic of", CountryCode = "TZ", IsActive = true
                        },
                        new Country {Id = 220, CountryName = "Thailand", CountryCode = "TH", IsActive = true},
                        new Country {Id = 221, CountryName = "Timor-Leste", CountryCode = "TL", IsActive = true},
                        new Country {Id = 222, CountryName = "Togo", CountryCode = "TG", IsActive = true},
                        new Country {Id = 223, CountryName = "Tokelau", CountryCode = "TK", IsActive = true},
                        new Country {Id = 224, CountryName = "Tonga", CountryCode = "TO", IsActive = true},
                        new Country
                        {
                            Id = 225, CountryName = "Trinidad and Tobago", CountryCode = "TT", IsActive = true
                        },
                        new Country {Id = 226, CountryName = "Tunisia", CountryCode = "TN", IsActive = true},
                        new Country {Id = 227, CountryName = "Turkey", CountryCode = "TR", IsActive = true},
                        new Country {Id = 228, CountryName = "Turkmenistan", CountryCode = "TM", IsActive = true},
                        new Country
                        {
                            Id = 229, CountryName = "Turks and Caicos Islands", CountryCode = "TC", IsActive = true
                        },
                        new Country {Id = 230, CountryName = "Tuvalu", CountryCode = "TV", IsActive = true},
                        new Country {Id = 231, CountryName = "Uganda", CountryCode = "UG", IsActive = true},
                        new Country {Id = 232, CountryName = "Ukraine", CountryCode = "UA", IsActive = true},
                        new Country
                        {
                            Id = 233, CountryName = "United Arab Emirates", CountryCode = "AE", IsActive = true
                        },
                        new Country {Id = 234, CountryName = "United Kingdom", CountryCode = "GB", IsActive = true},
                        new Country {Id = 235, CountryName = "United States", CountryCode = "US", IsActive = true},
                        new Country
                        {
                            Id = 236, CountryName = "United States Minor Outlying Islands", CountryCode = "UM",
                            IsActive = true
                        },
                        new Country {Id = 237, CountryName = "Uruguay", CountryCode = "UY", IsActive = true},
                        new Country {Id = 238, CountryName = "Uzbekistan", CountryCode = "UZ", IsActive = true},
                        new Country {Id = 239, CountryName = "Vanuatu", CountryCode = "VU", IsActive = true},
                        new Country {Id = 240, CountryName = "Venezuela", CountryCode = "VE", IsActive = true},
                        new Country {Id = 241, CountryName = "Viet Nam", CountryCode = "VN", IsActive = true},
                        new Country
                        {
                            Id = 242, CountryName = "Virgin Islands, British", CountryCode = "VG", IsActive = true
                        },
                        new Country
                        {
                            Id = 243, CountryName = "Virgin Islands, U.S.", CountryCode = "VI", IsActive = true
                        },
                        new Country {Id = 244, CountryName = "Wallis and Futuna", CountryCode = "WF", IsActive = true},
                        new Country {Id = 245, CountryName = "Western Sahara", CountryCode = "EH", IsActive = true},
                        new Country {Id = 246, CountryName = "Yemen", CountryCode = "YE", IsActive = true},
                        new Country {Id = 247, CountryName = "Zambia", CountryCode = "ZM", IsActive = true},
                        new Country {Id = 248, CountryName = "Zimbabwe", CountryCode = "ZW"}
                    };

                    countries.ForEach(c => { context.Countries.AddOrUpdate(ref c, x => new {x.Id}); });
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
            }
        }

        #endregion

        #region Provider

        public void SeedProvider(ApplicationContext context)
        {
            try
            {
                if (!context.Providers.Any())
                {
                    var provider = new Provider
                    {
                        Name = "My Company",
                        PhoneNumber = "44556677",
                        RegistrationNumber = "100001",
                        PrimaryContactFirstName = "Super",
                        PrimaryContactLastName = "Admin"
                    };

                    context.Providers.Add(provider);

                    context.SaveChanges();

                    var provideruser = new ProviderUser
                    {
                        ProviderId = provider.Id,
                        UserId = new Guid(ApplicationConstants.SuperAdminUserGuid)
                    };

                    context.ProviderUsers.Add(provideruser);


                    context.SaveChanges();

                    if (!context.AppointmentType.Any(x => x.ProviderId == provider.Id))
                    {
                        foreach (DictionaryEntry entry in DefaultData.AppointmentTypes)
                        {
                            var name = entry.Key.ToString();
                            var isBillable = (bool) entry.Value;
                            var type = new AppointmentType
                            {
                                CreatedDate = GeneralService.CurrentDate,
                                CreatedById = provider.CreatedById,
                                Provider = provider,
                                Name = name,
                                IsBillable = isBillable
                            };
                            context.AppointmentType.Add(type);
                        }

                        context.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }

        #endregion

        #region datakeys

        private void SetDataKeysForExistingEntities(ApplicationContext context)
        {
            //TODO: used only to add datakeys to data created before this mechanism was implemented - can be removed later on.
            context.ProviderUsers.Where(x => x.TenantDataKey == null).ToList()
                .ForEach(x => context.ProviderUsers.Update(x));
            context.Careplans.Where(x => x.PatientDataKey == null).ToList().ForEach(x => context.Careplans.Update(x));
            context.CareplanFamilyGoal.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.CareplanFamilyGoal.Update(x));
            context.CarePlanNote.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.CarePlanNote.Update(x));
            context.CareplanShortTermGoal.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.CareplanShortTermGoal.Update(x));
            context.FundedSupports.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.FundedSupports.Update(x));
            context.Appointments.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.Appointments.Update(x));
            context.AppointmentNotes.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.AppointmentNotes.Update(x));
            context.AppointmentFeedBacks.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.AppointmentFeedBacks.Update(x));
            context.BillableItem.Where(x => x.TenantDataKey == null).ToList()
                .ForEach(x => context.BillableItem.Update(x));
            context.ClinicalImpression.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.ClinicalImpression.Update(x));
            context.Observation.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.Observation.Update(x));
            context.PatientNotes.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.PatientNotes.Update(x));
            context.PatientRecord.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.PatientRecord.Update(x));
            context.TimeEntry.Where(x => x.TenantDataKey == null).ToList().ForEach(x => context.TimeEntry.Update(x));
            context.Medications.Where(x => x.PatientDataKey == null).ToList()
                .ForEach(x => context.Medications.Update(x));


            context.SaveChanges();
        }

        #endregion
    }
}