using System;
using System.Collections.Generic;
using System.Text;

namespace Caretaskr.Data.DataAuthorization
{
    public interface IPatientData
    {
        public string PatientDataKey { get; set; }
        public void SetPatientDataKey();

    }
}
