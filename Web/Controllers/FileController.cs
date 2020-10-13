using System;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Caretaskr.Common.ViewModel;
using CareTaskr.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace CareTaskr.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ParentController
    {
        private const int CONVERTTOKB = 1024;
        private const string ImagePath = "Image";
        private const int CONVERTTOMB = 1024;
        private const int INTDECIMALS = 2;
        private const int maxfilesize = 3;
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobStorageConfig _blobStorageConfiguration;
        private readonly IFileService _uploadService;
        private decimal decimalFileSize = 0;
        private decimal presentFileSize = 0;
        private decimal totalFileSizeCount = 0;

        public FileController(IFileService uploadService, IOptions<BlobStorageConfig> blobStorageConfiguration,
            BlobServiceClient blobServiceClient)
        {
            _uploadService = uploadService;
            _blobStorageConfiguration = blobStorageConfiguration.Value;
            _blobServiceClient = blobServiceClient;
        }


        [HttpGet("{fileId}")]
        public async Task<IActionResult> GetFileAsync(Guid fileId)
        {
            var fileUpload = await _uploadService.GetFileAsync(CurrentUserId(), fileId);

            return File(fileUpload.Stream, fileUpload.MimeType, fileUpload.OriginalFilename);
        }

        [HttpDelete("{fileId}")]
        public async Task<IActionResult> DeleteFile(Guid fileId)
        {
            return Ok(_uploadService.DeleteFile(CurrentUserId(), fileId));
        }
    }
}