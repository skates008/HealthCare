using System;
using System.Collections.Generic;
using System.Text;

namespace CareTaskr.Domain.Entities.Account
{
    public class Module
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string DisplayName { get; set; }
    }
}
