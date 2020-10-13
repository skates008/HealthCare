using System;

namespace Caretaskr.Common.Dto
{
    public class LoginInfo
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string DisplayPicture { get; set; }
        public Guid UserId { get; set; }
        public string Role { get; set; }

        public bool IsRegistrationComplete { get; set; }
        //public Guid RoleId { get; set; }
        //public int? RoleHierarchy { get; set; }
    }

    public class CurrentUserInfo
    {
        public string IpAddress { get; set; }
        public LoginInfo LoginInfo { get; set; }
    }
}