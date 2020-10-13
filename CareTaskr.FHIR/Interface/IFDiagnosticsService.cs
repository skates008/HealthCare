using System;
using System.Collections.Generic;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IFDiagnosticsService : IFService
    {
        #region Observation

        FResult<Guid, Observation> CreateObservation(Observation observation);
        FResult<Guid, Observation> GetObservationLst(List<Guid> observationIdLst);

        #endregion
    }
}