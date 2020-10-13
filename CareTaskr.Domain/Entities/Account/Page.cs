using System;

namespace CareTaskr.Domain.Entities.Account
{
    public class Page
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Path { get; set; }
        public string Icon { get; set; }
        public int DisplayOrder { get; set; }
        public int? ParentPageId { get; set; }
        public bool ShowInView { get; set; }
    }

    public class UserPage
    {
        public int PageId { get; set; }
        public Guid RoleId { get; set; }
        public virtual Page Page { get; set; }
        public virtual Role Role { get; set; }
    }
}
