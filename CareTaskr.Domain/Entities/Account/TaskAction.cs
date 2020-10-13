using System;

namespace CareTaskr.Domain.Entities.Account
{
    public class TaskAction
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string ActionName { get; set; }
        public int? PageId { get; set; }
        public virtual Page Page { get; set; }
        public int ModuleId { get; set; }
        public virtual Module Module { get; set; }
        public bool IsDisabled { get; set; }
    }

    public class RoleTaskAction
    {
        public int TaskActionId { get; set; }
        public Guid RoleId { get; set; }
        public virtual TaskAction TaskAction { get; set; }
        public virtual Role Role { get; set; }
    }
}
