using System;
using System.IO;
using System.Threading.Tasks;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Extensions;
using Caretaskr.Common.ViewModel;
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
    public class UploadController : ParentController
    {
        private const int CONVERTTOKB = 1024;
        private const string ImagePath = "Image";
        private const int CONVERTTOMB = 1024;
        private const int INTDECIMALS = 2;
        private const int maxfilesize = 3;
        private readonly IFileService _uploadService;
        private decimal decimalFileSize;
        private decimal presentFileSize;
        private readonly decimal totalFileSizeCount = 0;

        public UploadController(IFileService uploadService)
        {
            _uploadService = uploadService;
        }


        [HttpPost("profile")]
        public async Task<IActionResult> UploadProfile(IFormFile file)
        {
            ValidateFile(file);

            var uploadDataModel = Extensions.SaveFile(file, ImagePath);

            var uploadDocument = new UserUploadDocumentViewModel
            {
                FileName = uploadDataModel.Name,
                MimeType = uploadDataModel.Extension,
                Path = uploadDataModel.Path,
                ThumbnailPath = uploadDataModel.ThumbnailPath,
                ThumbnailImageName = uploadDataModel.ThumbnailImageName,
                DocumentType = UserDocumentType.UserProfile
            };

            return Ok(await _uploadService.UploadUserDocument(CurrentUserId(), uploadDocument));
        }


        [HttpPost("businessprofile")]
        public async Task<IActionResult> UploadBusinessProfileFile(IFormFile file)
        {
            ValidateFile(file);

            var uploadDataModel = Extensions.SaveFile(file, ImagePath);

            var uploadDocument = new ProviderUploadDocumentViewModel
            {
                FileName = uploadDataModel.Name,
                MimeType = uploadDataModel.Extension,
                Path = uploadDataModel.Path,
                ThumbnailPath = uploadDataModel.ThumbnailPath,
                ThumbnailImageName = uploadDataModel.ThumbnailImageName,
                DocumentType = ProviderDocumentType.BusinessProfile
            };


            return Ok(await _uploadService.UploadProviderDocument(CurrentUserId(), uploadDocument));
        }


        private void ValidateFile(IFormFile file)
        {
            if (file == null)
                throw new ArgumentException("Please upload a File");

            var ext = Path.GetExtension(file.FileName);
            var contenttype = string.Empty;
            decimalFileSize = file.Length;
            decimalFileSize = decimalFileSize / CONVERTTOKB / CONVERTTOMB;
            decimalFileSize = Math.Round(Convert.ToDecimal(decimalFileSize), INTDECIMALS);
            presentFileSize = totalFileSizeCount + decimalFileSize;

            contenttype = GeneralService.GetExtension(ext, contenttype);

            if (contenttype == string.Empty)
                throw new ArgumentException("Please select .jpg or .png file format to upload.");

            if (Convert.ToInt32(maxfilesize) <= presentFileSize)
                throw new ArgumentException("Please Select Max 3MB File Size to Upload.");
        }
    }
}