using System;
using System.Collections.Generic;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IFMedicationService : IFService
    {
        #region Medication

        FResult<Guid, Medication> CreateMedication(Medication medication);
        FResult<Guid, Medication> GetMedicationLst(List<Guid> medicationIdLst);
        FResult<Guid, Medication> DeleteMedication(Guid medicationId);

        #endregion
    }
}