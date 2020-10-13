using System;
using CareTaskr.Authorization;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ParentController
    {
        private readonly IProviderService _providerService;

        public SettingsController(IProviderService providerService)
        {
            _providerService = providerService;
        }

        #region Appointment Type

        /// <summary>
        ///     Create a new AppointmentType
        /// </summary>
        [Route("appointmentType")]
        [HttpPost]
        [Authorize(Policy = UserAction.ProviderSettings.Create)]
        public IActionResult CreateAppointmentType(AppointmentTypeViewModel model)
        {
            return Ok(_providerService.CreateAppointmentType(CurrentUserId(), model));
        }

        /// <summary>
        ///     Update an exsting AppointmentType
        /// </summary>
        [Route("appointmentType/{appointmentTypeId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.ProviderSettings.Update)]
        public IActionResult UpdateAppointmentType(Guid appointmentTypeId, AppointmentTypeViewModel model)
        {
            model.Id = appointmentTypeId;
            return Ok(_providerService.UpdateAppointmentType(CurrentUserId(), appointmentTypeId, model));
        }

        /// <summary>
        ///     Get AppointmentType details (including users)
        /// </summary>
        [Route("appointmentType/{appointmentTypeId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.ProviderSettings.Read)]
        public IActionResult GetAppointmentType(Guid appointmentTypeId)
        {
            return Ok(_providerService.GetAppointmentType(CurrentUserId(), appointmentTypeId));
        }

        /// <summary>
        ///     Get a List of all AppointmentTypes
        /// </summary>
        [Route("appointmentType/list")]
        [HttpPost]
        [Authorize(Policy = UserAction.ProviderSettings.Read)]
        public IActionResult GetAppointmentTypes(DataRequestModel dataRequest)
        {
            return Ok(_providerService.ListAppointmentTypes(CurrentUserId(), dataRequest));
        }


        /// <summary>
        ///     Delete a AppointmentType
        /// </summary>
        [Route("appointmentType/{appointmentTypeId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.ProviderSettings.Delete)]
        public IActionResult DeleteAppointmentType(Guid appointmentTypeId)
        {
            return Ok(_providerService.DeleteAppointmentType(CurrentUserId(), appointmentTypeId));
        }

     

        #endregion
    }
}