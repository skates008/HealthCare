using System;
using System.Collections.Generic;
using CareTaskr.Domain.Entities;

namespace CareTaskr.Service.Interface
{
    public interface IFWorkflowService : IFService
    {
        #region Appointment

        FResult<int, Appointment> CreateAppointment(Appointment appointement);
        FResult<int, Appointment> GetAppointmentLst(List<Guid> appointmentPublicIdLst);

        #endregion
    }
}