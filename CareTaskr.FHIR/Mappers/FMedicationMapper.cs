using System;
using System.Collections.Generic;
using CareTaskr.Domain.Enum;
using CareTaskr.FHIR.Data;
using Hl7.Fhir.Model;

namespace CareTaskr.FHIR.Mappers
{
    internal class FMedicationMapper : FhirMapper
    {
        public FMedicationMapper(FhirRepository fhirRepository) : base(fhirRepository)
        {
        }

        public Medication ToMedicationResource(Domain.Entities.Medication medication)
        {
            //https://www.hl7.org/fhir/medication.html#
            //TODO: public Frequency Frequency { get; set; }


            var fMedication = new Medication
            {
                Code = new CodeableConcept("", "", medication.Medicine),
                Form = new CodeableConcept("", "",
                    ((FormOfMedicine) Enum.Parse(typeof(FormOfMedicine), medication.FormOfMedicine.ToString(), true))
                    .ToString())
            };

            fMedication.Status = medication.IsActive
                ? Medication.MedicationStatusCodes.Active
                : Medication.MedicationStatusCodes.Inactive;

            fMedication.Identifier.Add(new Identifier {Value = medication.Id.ToString()});

            fMedication.Amount = new Ratio
            {
                Numerator = new Quantity(medication.Amount, "")
            };

            fMedication.Batch = new Medication.BatchComponent
            {
                ExpirationDate = ToDateStr(medication.ExpirationDate)
            };

            fMedication.Contained = new List<Resource>
            {
                new Organization
                {
                    Id = "manufacturer",
                    Name = medication.Manufacturer
                },
                new Patient
                {
                    Identifier = new List<Identifier> {new Identifier {Value = medication.PatientId.ToString()}}
                }
            };

            fMedication.Manufacturer = new ResourceReference("#manufacturer", medication.Manufacturer);

            return fMedication;
        }


        public Domain.Entities.Medication ToMedicationEntity(Medication fMedication)
        {
            //TODO: public Frequency Frequency { get; set; }

            var medication = new Domain.Entities.Medication();
            medication.Medicine = fMedication.Code.Text;
            medication.FormOfMedicine =
                (FormOfMedicine) Enum.Parse(typeof(FormOfMedicine), fMedication.Form.Text, true);
            medication.Amount = (int) fMedication.Amount.Numerator.Value;
            medication.ExpirationDate = FromDateStr(fMedication.Batch.ExpirationDate);
            medication.Manufacturer = fMedication.Manufacturer.Display;


            return medication;
        }
    }
}