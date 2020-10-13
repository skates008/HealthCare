using System;
using Caretaskr.Common.Configuration;
using Caretaskr.Common.ViewModel;
using CareTaskr.Domain.Enum;
using CareTaskr.Service.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace Caretaskr.Data.Seed
{
    public static class SeedData
    {
        public static async void Seed(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            try
            {
                //Register new user
                var accountService = serviceProvider.GetService<IAccountService>();
                var result = accountService.RegisterUser(new UserRegisterRequestViewModel
                {
                    //FullName = "TEST USER",
                    Email = "testuser1@mail.com",
                    //DateOfBirth = new DateTime(1980, 6, 6, 12, 0, 0),
                    //PhoneNumber = "19187654321",
                    //CompanyName = "test company",
                    //Address = "Test Address",
                    Password = "test@Password123"
                });
                ;
                result.Wait();

                //"currently logged in user"
                var userId = ((ResponseViewModel<RegisterResponseViewModel>) result.Result).Data.UserId;


                var patientService = serviceProvider.GetService<IPatientService>();
                var resCreatePatient = await patientService.CreatePatient(userId, new PatientRegisterRequestViewModel
                {
                    NDISNumber = "123323445",
                    FirstName = "Patient",
                    LastName = "One",
                    PreferredName = "Patient One",
                    Gender = Gender.Male,
                    DateOfBirth = new DateTime(1981, 6, 6),
                    Country = "UK",
                    Ethnicity = Ethnicity.Neither
                });

                result.Wait();
                var patientId = ((ResponseViewModel<PatientDetailsResponseViewModel>) resCreatePatient).Data.Id;

                patientService.CreateAllergies(userId, new CreateAllergiesRequestViewModel
                {
                    Allergen = "allergen 1",
                    Category = Category.Food,
                    ClinicalStatus = ClinicalStatus.Active,
                    Critical = Critical.High,
                    LastOccurenceDate = GeneralService.CurrentDate
                    //PatientId = patientId
                });
                patientService.CreateAllergies(userId, new CreateAllergiesRequestViewModel
                {
                    Allergen = "allergen 2",
                    Category = Category.Food,
                    ClinicalStatus = ClinicalStatus.Active,
                    Critical = Critical.Low,
                    LastOccurenceDate = GeneralService.CurrentDate
                    // PatientId = patientId
                });
                /*
                patientService.CreateAssessment(userId, new CreateClinicalImpressionRequestViewModel()
                {
                    Date = GeneralService.CurrentDate,
                    Description = "Description 1",
                    PatientId = patientId,
                    //PractitionerId = null, 
                    Assessment = "Summary 1"
                });

                patientService.CreateAssessment(userId, new CreateClinicalImpressionRequestViewModel()
                {
                    Date = GeneralService.CurrentDate,
                    Description = "Description 2",
                    PatientId = patientId,
                    //PractitionerId = null, 
                    Assessment = "Summary 2"
                });
                */
                patientService.CreateMedication(userId, new CreateMedicationRequestViewModel
                {
                    Amount = 100,
                    ExpirationDate = new DateTime(2021, 1, 1),
                    FormOfMedicine = FormOfMedicine.Capsule,
                    Frequency = Frequency.Daily,
                    Manufacturer = "Manufacturer",
                    Medicine = "Medicine"
                    //PatientId = patientId
                });
                patientService.CreateMedication(userId, new CreateMedicationRequestViewModel
                {
                    Amount = 100,
                    ExpirationDate = new DateTime(2021, 1, 1),
                    FormOfMedicine = FormOfMedicine.Liquid,
                    Frequency = Frequency.Weekly,
                    Manufacturer = "Manufacturer 2",
                    Medicine = "Medicine 2"
                    //PatientId = patientId
                });
            }
            catch
            {
            }
        }
    }
}