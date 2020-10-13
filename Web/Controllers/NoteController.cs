using System;
using System.Collections.Generic;
using System.Linq;
using CareTaskr.Authorization;
using Caretaskr.Common.Exceptions;
using Caretaskr.Common.Validators;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NoteController : ParentController
    {
        private readonly INoteService _noteService;

        public NoteController(INoteService noteService)
        {
            _noteService = noteService;
        }

        #region Note

        /// <summary>
        ///     Create a new Note
        /// </summary>
        [Route("")]
        [HttpPost]
        [Authorize(Policy = UserAction.Note.Create)]
        public IActionResult CreateNote([FromForm] Guid patientId,
            [FromForm] Guid careplanId,
            [FromForm] Guid appointmentId,
            [FromForm] NoteType type,
            [FromForm] string title,
            [FromForm] string text,
            [FromForm] List<string> fileTitles,
            [FromForm] IFormFile[] files)
        {
            var model = new NoteViewModel
            {
                PatientId = patientId,
                AppointmentId = appointmentId,
                CareplanId = careplanId,
                Type = type,
                Title = title,
                Text = text,
                FileTitles = fileTitles
            };
            model.FilesToUpload = GetFiles(files, model.FileTitles);

            var result = new NoteValidator().Validate(model);
            if (result.Errors.Any()) throw new ValidationException(result.Errors.ToList());


            return Ok(_noteService.CreateNote(CurrentUserId(), model));
        }

        /// <summary>
        ///     Update an exsting Note
        /// </summary>
        [Route("{noteId}")]
        [HttpPut]
        [Authorize(Policy = UserAction.Note.Update)]
        public IActionResult UpdateNote(Guid noteId,
            [FromForm] Guid patientId,
            [FromForm] Guid careplanId,
            [FromForm] Guid appointmentId,
            [FromForm] NoteType type,
            [FromForm] string title,
            [FromForm] string text,
            [FromForm] List<string> fileTitles,
            [FromForm] IFormFile[] files)
        {
            var model = new NoteViewModel
            {
                Id = noteId,
                PatientId = patientId,
                AppointmentId = appointmentId,
                CareplanId = careplanId,
                Type = type,
                Title = title,
                Text = text,
                FileTitles = fileTitles
            };
            model.FilesToUpload = GetFiles(files, model.FileTitles);

            var result = new NoteValidator().Validate(model);
            if (result.Errors.Any()) throw new ValidationException(result.Errors.ToList());

            return Ok(_noteService.UpdateNote(CurrentUserId(), noteId, model));
        }

        /// <summary>
        ///     Get Note details (including users)
        /// </summary>
        [Route("{noteId}")]
        [HttpGet]
        [Authorize(Policy = UserAction.Note.Read)]
        public IActionResult GetNote(Guid noteId)
        {
            return Ok(_noteService.GetNote(CurrentUserId(), noteId));
        }

        /// <summary>
        ///     Get a List of all Notes
        /// </summary>
        [Route("list")]
        [HttpPost]
        [Authorize(Policy = UserAction.Note.Read)]
        public IActionResult GetNotes(DataRequestModel dataRequest)
        {
            return Ok(_noteService.ListNotes(CurrentUserId(), dataRequest));
        }


        /// <summary>
        ///     Delete a Note
        /// </summary>
        [Route("{noteId}")]
        [HttpDelete]
        [Authorize(Policy = UserAction.Note.Delete)]
        public IActionResult DeleteNote(Guid noteId)
        {
            return Ok(_noteService.DeleteNote(CurrentUserId(), noteId));
        }

        #endregion
    }
}