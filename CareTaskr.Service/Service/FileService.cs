using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.Helpers;
using Caretaskr.Common.ViewModel;
using Caretaskr.Common.ViewModel.General;
using CareTaskr.Domain.Entities;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Infrastructure;
using CareTaskr.Service.Interface;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Extensions.Options;

namespace CareTaskr.Service.Service
{
    public class FileService : ParentService, IFileService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobStorageConfig _blobStorageConfiguration;
        private readonly IGenericUnitOfWork _genericUnitOfWork;
        private readonly IMapper _mapper;

        public FileService(IGenericUnitOfWork genericUnitOfWork,
            IOptions<BlobStorageConfig> blobStorageConfiguration,
            BlobServiceClient blobServiceClient,
            IMapper mapper
        ) : base(genericUnitOfWork)
        {
            _genericUnitOfWork = genericUnitOfWork;
            _blobStorageConfiguration = blobStorageConfiguration.Value;
            _blobServiceClient = blobServiceClient;
            _mapper = mapper;
        }

        public PatientRecordFile Upload(Guid currentUserId, PatientRecord patientRecord,
            FileUploadRequestViewModel fileToUpload, PatientRecordFileType type)
        {
            return Upload(currentUserId, patientRecord, new List<FileUploadRequestViewModel> {fileToUpload}, type)
                .FirstOrDefault();
        }


        public List<PatientRecordFile> Upload(Guid currentUserId, PatientRecord patientRecord,
            List<FileUploadRequestViewModel> filesToUpload, PatientRecordFileType type)
        {
            var prFiles = new List<PatientRecordFile>();

            if (filesToUpload != null && filesToUpload.Any())
                foreach (var fileToUpload in filesToUpload)
                    if (fileToUpload != null)
                    {
                        var filename = $"{Guid.NewGuid()}-{fileToUpload.Filename}".ToLower().Replace(" ", string.Empty);
                        if (UploadBlob(filename, fileToUpload.MimeType, fileToUpload.File.OpenReadStream()))
                        {
                            var fileUpload = new FileUpload
                            {
                                CreatedById = currentUserId,
                                CreatedDate = GeneralService.CurrentDate,
                                Filename = filename,
                                OriginalFilename = fileToUpload.Filename,
                                Title = fileToUpload.Title,
                                MimeType = fileToUpload.MimeType,
                                Size = fileToUpload.File.Length
                            };
                            prFiles.Add(new PatientRecordFile
                            {
                                PatientRecord = patientRecord,
                                FileUpload = fileUpload,
                                Type = type
                            });
                        }
                    }

            return prFiles;
        }




        public string UploadFileToBlob(Guid currentUserId, string fileName, string mimeType, byte[] file)
        {
            try
            {
                string documentPath = null;

                var containerClient = _blobServiceClient.GetBlobContainerClient(_blobStorageConfiguration.Container);
                var blobClient = containerClient.GetBlobClient(fileName);


                using (Stream uploadFileStream = new MemoryStream(file))
                {
                    blobClient.Upload(uploadFileStream, new BlobHttpHeaders {ContentType = mimeType});
                    documentPath = GetContainerSasUri(fileName); //blobClient.Uri.AbsoluteUri;
                }

                return documentPath;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<ResponseViewModel> UploadProviderDocument(Guid currentUserId,
            ProviderUploadDocumentViewModel model)
        {
            var fileNameNew = GenerateFileName(model.FileName, currentUserId);
            var thumbNailImageName = GenerateFileName(model.ThumbnailImageName, currentUserId);

            var documentPath = await UploadFileToBlob(fileNameNew, model.MimeType, model.Path, model.ThumbnailPath,
                thumbNailImageName);


            var currentDate = GeneralService.CurrentDate;
            var provider = GetUserProvider(currentUserId);
            var userUploadRepo = _genericUnitOfWork.GetRepository<UserDocument, int>();
            var providerRepo = _genericUnitOfWork.GetRepository<ProviderDocument, int>();

            var providerUploadEntity = providerRepo.FirstOrDefault(x =>
                x.ProviderId == provider.Id && x.DocumentTypeId == model.DocumentType);
            if (providerUploadEntity != null)
            {
                providerUploadEntity.FileName = model.FileName;
                providerUploadEntity.ThumbnailImageName = thumbNailImageName;
                providerUploadEntity.ModifiedDate = currentDate;
                providerUploadEntity.ModifiedById = currentUserId;
                providerUploadEntity.DocumentPath = documentPath;
                providerRepo.Update(providerUploadEntity);
            }
            else
            {
                var providerDocument = new ProviderDocument
                {
                    ProviderId = provider.Id,
                    DocumentTypeId = model.DocumentType,
                    DocumentType = model.DocumentType.ToString(),
                    FileName = fileNameNew,
                    ThumbnailImageName = thumbNailImageName,
                    CreatedDate = currentDate,
                    CreatedById = currentUserId,
                    DocumentPath = documentPath
                };
                providerRepo.Add(providerDocument);
            }

            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> {Data = "", Success = true};
        }

        public async Task<ResponseViewModel> UploadUserDocument(Guid currentUserId, UserUploadDocumentViewModel model)
        {
            var provider = GetUserProvider(currentUserId);
            var fileNameNew = GenerateFileName(model.FileName, provider.PublicId);
            var thumbNailImageName = GenerateFileName(model.ThumbnailImageName, currentUserId);

            var documentPath = await UploadFileToBlob(fileNameNew, model.MimeType, model.Path, model.ThumbnailPath,
                thumbNailImageName);

            var currentDate = GeneralService.CurrentDate;
            var userUploadRepo = _genericUnitOfWork.GetRepository<UserDocument, int>();
            var providerRepo = _genericUnitOfWork.GetRepository<ProviderDocument, int>();

            var userUploadEntity =
                userUploadRepo.FirstOrDefault(x => x.UserId == currentUserId && x.DocumentTypeId == model.DocumentType);
            if (userUploadEntity != null)
            {
                userUploadEntity.FileName = fileNameNew;
                userUploadEntity.ThumbnailImageName = thumbNailImageName;
                userUploadEntity.ModifiedDate = currentDate;
                userUploadEntity.ModifiedById = currentUserId;
                userUploadEntity.DocumentPath = documentPath;

                userUploadRepo.Update(userUploadEntity);
            }
            else
            {
                var userDocument = new UserDocument
                {
                    UserId = currentUserId,
                    DocumentTypeId = model.DocumentType,
                    DocumentType = model.DocumentType.ToString(),
                    FileName = fileNameNew,
                    ThumbnailImageName = thumbNailImageName,
                    CreatedDate = currentDate,
                    CreatedById = currentUserId,
                    DocumentPath = documentPath
                };
                userUploadRepo.Add(userDocument);
            }


            _genericUnitOfWork.SaveChanges();
            return new ResponseViewModel<string> {Data = "", Success = true};
        }

        public string GetContainerSasUri(string blobName)
        {
            if (!string.IsNullOrEmpty(blobName))
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_blobStorageConfiguration.Container);
                var blobClient = containerClient.GetBlobClient(blobName);

                if (blobClient.Exists())
                {
                    //var dict = _blobStorageConfiguration.StorageConnection.Split(';')
                    //              .Select(x => x.Split('='))
                    //              .ToDictionary(x => x[0], x => x[1]);

                    //var key = dict.Where(x => x.Key == "AccountKey").Select(c => c.Value).FirstOrDefault();


                    var key = _blobStorageConfiguration.Key;
                    var blobSasBuilder = new BlobSasBuilder
                    {
                        StartsOn = DateTime.UtcNow.AddMinutes(-5),
                        ExpiresOn = DateTime.UtcNow.AddHours(24),
                        BlobContainerName = _blobStorageConfiguration.Container,
                        BlobName = blobName
                    };

                    //  Defines the type of permission.
                    blobSasBuilder.SetPermissions(BlobSasPermissions.Read);

                    var accountName = _blobServiceClient.AccountName;


                    //  Builds an instance of StorageSharedKeyCredential      
                    var storageSharedKeyCredential = new StorageSharedKeyCredential(accountName, key);

                    //  Builds the Sas URI.
                    var sasQueryParameters = blobSasBuilder.ToSasQueryParameters(storageSharedKeyCredential);

                    var fullUri = new UriBuilder
                    {
                        Scheme = "https",
                        Host = string.Format("{0}.blob.core.windows.net", accountName),
                        Path = string.Format("{0}/{1}", _blobStorageConfiguration.Container, blobName),
                        Query = sasQueryParameters.ToString()
                    };
                    return fullUri.Uri.ToString();
                }

                return string.Empty;
            }


            return string.Empty;
        }

        public bool DeleteFile(Guid currentUserId, Guid fileId)
        {
            var fileUpload = GetEntity<FileUpload, int>(fileId);
            var patientRecordFile = _genericUnitOfWork.GetRepository<PatientRecordFile, int>().GetAll()
                .FirstOrDefault(x => x.FileUpload == fileUpload);

            if (patientRecordFile != null)
                DeleteEntity<PatientRecordFile, int>(currentUserId, patientRecordFile.PublicId);

            DeleteEntity<FileUpload, int>(currentUserId, fileId);


            return true;
        }

        public DataSourceResult ListFiles(Guid currentUserId, DataRequestModel dataRequest)
        {
            var queryable = _genericUnitOfWork.GetRepository<FileUpload, Guid>().GetAll().Where(x => x.PatientRecordFile.Type != PatientRecordFileType.Invoice).AsQueryable();

            if (dataRequest.Filter != null)
                if (dataRequest.Filter.ContainsKey(Constants.QueryFilters.PATIENT_RECORD_ID))
                {
                    var patientRecordPublicId = new Guid(dataRequest.Filter[Constants.QueryFilters.PATIENT_RECORD_ID]);
                    queryable = queryable.Where(
                        p => p.PatientRecordFile.PatientRecord.PublicId == patientRecordPublicId);
                }

            var result = queryable.ToDataSourceResult<FileUpload, FileUploadViewModel>(_mapper, dataRequest,
                new Sort {Field = "", Direction = SortOrder.ASCENDING});

            return result;
        }

        public async Task<FileUpload> GetFileAsync(Guid guid, Guid fileId)
        {
            var fileUpload = GetEntity<FileUpload, int>(fileId);


            var ms = new MemoryStream();
            if (CloudStorageAccount.TryParse(_blobStorageConfiguration.StorageConnection, out var storageAccount))
            {
                var BlobClient = storageAccount.CreateCloudBlobClient();
                var container = BlobClient.GetContainerReference(_blobStorageConfiguration.Container);

                if (await container.ExistsAsync())
                {
                    var file = container.GetBlobReference(fileUpload.Filename);

                    if (await file.ExistsAsync())
                    {
                        await file.DownloadToStreamAsync(ms);
                        var blobStream = file.OpenReadAsync().Result;
                        fileUpload.Stream = blobStream;
                    }
                }
            }

            return fileUpload;
        }

        public bool UploadBlob(string fileName, string mimeType, Stream stream)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_blobStorageConfiguration.Container);
                var blobClient = containerClient.GetBlobClient(fileName);
                var result = blobClient.Upload(stream, new BlobHttpHeaders {ContentType = mimeType});
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> UploadFileToBlob(string fileName, string mimeType, string path,
            string thumbnailPath = null, string thumbnailFilename = null)
        {
            try
            {
                string documentPath = null;

                var containerClient = _blobServiceClient.GetBlobContainerClient(_blobStorageConfiguration.Container);
                var blobClient = containerClient.GetBlobClient(fileName);

                await blobClient.UploadAsync(path, new BlobHttpHeaders {ContentType = mimeType});
                if (!string.IsNullOrEmpty(thumbnailPath))
                {
                    var blobClientThumbnail = containerClient.GetBlobClient(thumbnailFilename);
                    await blobClientThumbnail.UploadAsync(thumbnailPath, new BlobHttpHeaders {ContentType = mimeType});
                }

                documentPath = blobClient.Uri.AbsoluteUri;


                File.Delete(path); //Delete file from local after uploading
                File.Delete(thumbnailPath);
                return documentPath;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GenerateFileName(string fileName, Guid id)
        {
            var strFileName = id + "_" + fileName.Replace(" ", "");
            return strFileName;
        }
    }
}