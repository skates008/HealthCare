using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CareTaskr.Domain.Entities.Account
{
    public class Role : IdentityRole<Guid>
    {
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool SystemDefined { get; set; }
        public int? Hierarchy { get; set; }
        public virtual ICollection<RoleTaskAction> RoleTaskActions { get; set; }
        public virtual ICollection<UserPage> UserPages { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }

    public class UserRole : IdentityUserRole<Guid>
    {
        public virtual User User { get; set; }
        public virtual Role Role { get; set; }
    }
}
