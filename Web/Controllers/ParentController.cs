using System;
using System.Collections.Generic;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CareTaskr.Controllers
{
    public class ParentController : ControllerBase
    {
        protected Guid CurrentUserId()
        {
            return CustomHttpContext.GetUserLoginInfo().UserId;
        }

        public List<FileUploadRequestViewModel> GetFiles(IFormFile[] files, List<string> titles = null)
        {
            var result = new List<FileUploadRequestViewModel>();
            var index = 0;
            foreach (var file in files)
            {
                var model = new FileUploadRequestViewModel
                {
                    File = file,
                    Filename = file.FileName,
                    MimeType = file.ContentType,
                    Title = titles != null && titles.Count > index ? titles[index] : null
                };
                index++;
                result.Add(model);
            }

            return result;
        }
    }
}