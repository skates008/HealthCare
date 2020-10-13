using CareTaskr.Domain.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace Caretaskr.Data.DataAuthorization
{

    public class PatientData<T> :  BaseEntity<T>, IPatientData
    {
        //This holds the UserId of the person who created it
        public string PatientDataKey { get; set; }

        public void SetPatientDataKey()
        {
            throw new NotImplementedException();
        }
    }
}
