using Caretaskr.Data.DataAuthorization;
using CareTaskr.Domain.Enum;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace CareTaskr.Domain.Entities.Account
{
    public class User: IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string CompanyName { get; set; }

 

        //public string Address { get; set; }
        //public string State { get; set; }
        //public string StreetNumber { get; set; }
        //public string StreetName { get; set; }
        //public string Unit { get; set; }
        //public string City { get; set; }
        //public string PostCode { get; set; }
        public string Occupation { get; set; }
        //public double Latitude { get; set; }
        //public double Longitude { get; set; }
        public DateTime? LastLoginDateTime { get; set; }

        public UserType UserType { get; set; }
        public bool SystemDefined { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsRegistrationComplete { get; set; } = true;

        //Depending on user type it can belong to one or more Providers
        public virtual ICollection<ProviderUser> Providers { get; set; }

        public virtual ICollection<TeamUser> Teams { get; set; }

        public virtual ICollection<TimeEntryUser> TimeEntries { get; set; }

        public virtual ICollection<CareplanPractitioner> Careplans{ get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; }

        public virtual Carer Carer { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; }

        [NotMapped]
        public string TenantDataKey { get; set; } = String.Empty;
        [NotMapped]
        public string PatientDataKey { get; set; } = String.Empty;
        public Guid? CreatedById { get; set; }
        public virtual User CreatedBy { get; set; }
        public Guid? ModifiedById { get; set; }
        public virtual User ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? LastPasswordChangeDate { get; set; }
        public string Position { get; set; }


        public int? AddressId { get; set; }
        public virtual Address Address { get; set; } = new Address();

        public Provider DefaultProvider() {
            return Providers.FirstOrDefault().Provider;
        }

    }
}
