using System;
using System.Collections.Generic;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IFPatientService //: IFhirService
    {
        void EnrichPatient(ref Patient patient);
        void EnrichPatient(ref List<Patient> result);

        FResult<Guid, Patient> CreatePatient(Patient patient);
        FResult<Guid, Patient> UpdatePatient(Patient patient);
        FResult<Guid, Patient> DeletePatient(Guid id);

        //FResult<Guid, Patient> GetPatientLst(List<Guid> patientIdLst);
    }
}