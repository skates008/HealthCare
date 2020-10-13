using System;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ParentController
    {
        private readonly IListService _listService;

        public ListController(IListService listService)
        {
            _listService = listService;
        }


        [Route("gender")]
        [HttpGet]
        public IActionResult ListGender()
        {
            return Ok(_listService.ListGender());
        }

        [Route("ethinicity")]
        [HttpGet]
        public IActionResult ListEthinicity()
        {
            return Ok(_listService.ListEthinicity());
        }

        [Route("appointmentType")]
        [HttpGet]
        public IActionResult ListTypeOfAppointments()
        {
            return Ok(_listService.ListTypeOfAppointments());
        }

        [Route("countries")]
        [HttpGet]
        public IActionResult ListCountries()
        {
            return Ok(_listService.ListCountries());
        }

        [Route("participant")]
        [HttpGet]
        public IActionResult ListParticipant()
        {
            return Ok(_listService.ListParticipant(CurrentUserId()));
        }

        [Route("practitioner")]
        [HttpGet]
        public IActionResult ListPractioner()
        {
            return Ok(_listService.ListPractioner(CurrentUserId()));
        }

        [Route("practitioner/{teamId}")]
        [HttpGet]
        public IActionResult ListPractionerByTeam(Guid teamId)
        {
            return Ok(_listService.ListPractionerByTeam(CurrentUserId(), teamId));
        }

        [Route("budget/{patientId}")]
        [HttpGet]
        public IActionResult ListBudgetByPatientId(Guid patientId)
        {
            return Ok(_listService.ListBudgetByPatientId(patientId));
        }

        [Route("fundedcategories")]
        [HttpGet]
        public IActionResult ListFundCategory()
        {
            return Ok(_listService.ListFundCategory());
        }

        [Route("billableitems")]
        [HttpGet]
        public IActionResult ListBillableItems()
        {
            return Ok(_listService.ListBillableItems(CurrentUserId()));
        }

        //careplan list by patient
        [Route("careplan/{patientId}")]
        [HttpGet]
        public IActionResult ListCareplanByPatient(Guid patientId)
        {
            return Ok(_listService.ListCareplanByPatient(patientId));
        }

        [Route("userType")]
        [HttpGet]
        public IActionResult ListUserType()
        {
            return Ok(_listService.ListUserType(CurrentUserId()));
        }

        [Route("billingType")]
        [HttpGet]
        public IActionResult ListBillingType()
        {
            return Ok(_listService.ListBillingType(CurrentUserId()));
        }

        [Route("addresstype/{patientId}")]
        [HttpGet]
        public IActionResult ListAddressTypes(Guid patientId)
        {
            return Ok(_listService.ListAddressTypes(patientId));
        }
    }
}