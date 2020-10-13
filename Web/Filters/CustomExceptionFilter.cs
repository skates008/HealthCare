using System;
using System.Collections.Generic;
using System.Net;
using Caretaskr.Common.Exceptions;
using Caretaskr.Common.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CareTaskr.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CustomExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is ValidationException)
            {
                context.HttpContext.Response.ContentType = "application/json";
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Result =
                new JsonResult(new ResponseViewModel<string>()
                {
                    Success = false,
                    ErrorMessages = ((ValidationException)context.Exception).Failures

                });

                return;
            }

            if (context.Exception is DBException)
            {
                context.HttpContext.Response.ContentType = "application/json";
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Result =
                new JsonResult(new ResponseViewModel<string>()
                {
                    Success = false,
                    ErrorMessages = new List<string>() { "Something Went Wrong Please try again Later" }

                });

                return;
            }


            var code = HttpStatusCode.InternalServerError;
  
            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.StatusCode = (int)code;
            context.Result = new JsonResult(new ResponseViewModel<string>()
            {
                Success = false,
                ErrorMessages = new List<string>() { context.Exception.Message }

            });
        }
    }
}
