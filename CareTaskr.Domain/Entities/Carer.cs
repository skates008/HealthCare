using CareTaskr.Domain.Base;
using CareTaskr.Domain.Entities.Account;
using System;
using System.Collections.Generic;

namespace CareTaskr.Domain.Entities
{

    public class Carer : BaseEntity<Guid>
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Contact { get; set; }
        public int Order { get; set; }
        public Guid UserId { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<CarerPatient> CarerPatients { get; set; }

    }

    public class CarerPatient : BaseEntity<int>
    {
        public Guid CarerId { get; set; }
        public virtual Carer Carer { get; set; }

        public Guid PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        public string Relation { get; set; }



    }



}
