using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.AspNetCore;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using ValidationException = Caretaskr.Common.Exceptions.ValidationException;

namespace CareTaskr.Service.Infrastructure
{
    public class CustomInterceptor : IValidatorInterceptor
    {
        public List<string> Failures { get; }


        public ValidationContext BeforeMvcValidation(ControllerContext controllerContext,
            ValidationContext validationContext)
        {
            return validationContext;
        }

        public ValidationResult AfterMvcValidation(ControllerContext controllerContext,
            ValidationContext validationContext, ValidationResult result)
        {
            var projection = result.Errors.ToList();
            if (projection.Count > 0)
                throw new ValidationException(projection);
            return new ValidationResult(projection);
        }
    }
}