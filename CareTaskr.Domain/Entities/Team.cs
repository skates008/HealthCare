using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{

    public class Team : BaseEntity<int>, ITenantData
    {
        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }

        public string Name { get; set; }

        public virtual ICollection<TeamUser> Users { get; set; } = new List<TeamUser>();
        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Provider.GetDataKey();
        }
    }


    public class TeamUser : ITenantData
    {
        public int TeamId { get; set; }
        public virtual Team Team{ get; set; }


        public Guid UserId { get; set; }
        public virtual User User { get; set; }

        public bool IsActive { get; set; } = true;


        public string TenantDataKey { get; set; }

        public void SetTenantDataKey()
        {
            TenantDataKey = Team.Provider.GetDataKey();
        }
    }

}
