using System.Collections.Generic;

namespace Caretaskr.Common.ViewModel
{
    public class UserPageViewModel
    {
        public int PageId { get; set; }
        public string PagePath { get; set; }
        public string Title { get; set; }
        public string PageIcon { get; set; }
        public int PageDisplayOrder { get; set; }
        public int? PageParentPageId { get; set; }
        public List<UserPageViewModel> ChildPages { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
        public List<UserPageViewModel> children { get; set; }
    }

    public class TaskActionViewModel
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string ActionName { get; set; }
        public int? ModuleId { get; set; }
        public bool IsChecked { get; set; }
    }
}