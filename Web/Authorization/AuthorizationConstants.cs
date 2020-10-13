using CareTaskr.Domain.Enum;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CareTaskr.Authorization
{


    public class Roles
    {

        public const string Owner = "Owner";
        public const string Manager = "Manager";
        public const string User = "User";
        public const string Client = "Client";
        public const string PrimaryCustodian = "PrimaryCustodian";
        public const string ClientCustodian = "ClientCustodian";
    }

    public class UserAction
    {
        
        public static Hashtable Permissions = new Hashtable()
         {
             { Provider.Read, new string[]{ Roles.Owner, Roles.Manager} },
             { Provider.Update, new string[]{ Roles.Owner, Roles.Manager}} ,

             { Team.Create, new string[]{ Roles.Owner, Roles.Manager} },
             { Team.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { Team.Update, new string[]{ Roles.Owner, Roles.Manager} },
             { Team.Delete, new string[]{ Roles.Owner, Roles.Manager} },
             
             { Note.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User } },
             { Note.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { Note.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User } },
             { Note.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User } },


             { Appointment.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { Appointment.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Appointment.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Appointment.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { AppointmentObservation.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentObservation.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentObservation.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentObservation.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { AppointmentAssessment.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentAssessment.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentAssessment.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentAssessment.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { AppointmentTreatmentNote.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentTreatmentNote.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentTreatmentNote.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { AppointmentTreatmentNote.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { TimeEntry.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { TimeEntry.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { TimeEntry.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { TimeEntry.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { BillableItem.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { BillableItem.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { BillableItem.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { BillableItem.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { Invoice.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { Invoice.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian } },
             

             { MyTask.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { MyTask.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { MyTask.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { MyTask.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },

             { Statement.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
           
             { User.Create, new string[]{ Roles.Owner, Roles.Manager} },
             { User.Read, new string[]{ Roles.Owner, Roles.Manager} },
             { User.Update, new string[]{ Roles.Owner, Roles.Manager} },
             { User.Delete, new string[]{ Roles.Owner, Roles.Manager} },

             { Patient.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Patient.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Patient.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Patient.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },

             { Medication.Create, new string[]{ Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Medication.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Medication.Update, new string[]{Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Medication.Delete, new string[]{Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },

             { Allergy.Create, new string[]{ Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Allergy.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Allergy.Update, new string[]{ Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Allergy.Delete, new string[]{ Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },

             { PatientAssessment.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientAssessment.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { PatientAssessment.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientAssessment.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { PatientObservation.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientObservation.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientObservation.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientObservation.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { PatientTreatmentNote.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientTreatmentNote.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { PatientTreatmentNote.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { PatientTreatmentNote.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { Budget.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Budget.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Budget.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Budget.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },

             { Careplan.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User,} },
             { Careplan.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { Careplan.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { Careplan.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { CareplanObservation.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User,} },
             { CareplanObservation.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { CareplanObservation.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { CareplanObservation.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { CareplanAssessment.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User,} },
             { CareplanAssessment.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { CareplanAssessment.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { CareplanAssessment.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { CareplanTreatmentNote.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User,} },
             { CareplanTreatmentNote.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { CareplanTreatmentNote.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { CareplanTreatmentNote.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { CareplanReport.Create, new string[]{ Roles.Owner, Roles.Manager, Roles.User,} },
             { CareplanReport.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { CareplanReport.Update, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },
             { CareplanReport.Delete, new string[]{ Roles.Owner, Roles.Manager, Roles.User} },

             { ProviderSettings.Create, new string[]{ Roles.Owner, Roles.Manager} },
             { ProviderSettings.Read, new string[]{ Roles.Owner, Roles.Manager, Roles.User, Roles.Client, Roles.PrimaryCustodian, Roles.ClientCustodian} },
             { ProviderSettings.Update, new string[]{ Roles.Owner, Roles.Manager} },
             { ProviderSettings.Delete, new string[]{ Roles.Owner, Roles.Manager} },

        };


        public class Provider
        {

            public const string Create = "ProviderCreate";
            public const string Read = "ProviderRead";
            public const string Update = "ProviderUpdate";
            public const string Delete = "ProviderDelete";
        }
        public class Team
        {

            public const string Create = "TeamCreate";
            public const string Read = "TeamRead";
            public const string Update = "TeamUpdate";
            public const string Delete = "TeamDelete";
        }
        public class ProviderSettings
        {

            public const string Create = "ProviderSettingsCreate";
            public const string Read = "ProviderSettingsRead";
            public const string Update = "ProviderSettingsUpdate";
            public const string Delete = "ProviderSettingsDelete";
        }

        public class Note
        {

            public const string Create = "NoteCreate";
            public const string Read = "NoteRead";
            public const string Update = "NoteUpdate";
            public const string Delete = "NoteDelete";
        }

        public class User
        {
            public const string Create = "UserCreate";
            public const string Read = "UserRead";
            public const string Update = "UserUpdate";
            public const string Delete = "UserDelete";
        }
        public class Appointment
        {
            public const string Create = "AppointmentCreate";
            public const string Read = "AppointmentRead";
            public const string Update = "AppointmentUpdate";
            public const string Delete = "AppointmentDelete";
        }
        public class AppointmentObservation
        {
            public const string Create = "AppointmentObservationCreate";
            public const string Read = "AppointmentObservationRead";
            public const string Update = "AppointmentObservationUpdate";
            public const string Delete = "AppointmentObservationDelete";
        }
        public class AppointmentTreatmentNote
        {
            public const string Create = "AppointmentTreatmentNoteCreate";
            public const string Read = "AppointmentTreatmentNoteRead";
            public const string Update = "AppointmentTreatmentNoteUpdate";
            public const string Delete = "AppointmentTreatmentNoteDelete";
        }
        public class AppointmentAssessment
        {
            public const string Create = "AppointmentAssessmentCreate";
            public const string Read = "AppointmentAssessmentRead";
            public const string Update = "AppointmentAssessmentUpdate";
            public const string Delete = "AppointmentAssessmentDelete";
        }
        public class Patient
        {
            public const string Create = "PatientCreate";
            public const string Read = "PatientRead";
            public const string Update = "PatientUpdate";
            public const string Delete = "PatientDelete";
        }
        public class Careplan
        {
            public const string Create = "CareplanCreate";
            public const string Read = "CareplanRead";
            public const string Update = "CareplanUpdate";
            public const string Delete = "CareplanDelete";
        }

        public class CareplanObservation
        {
            public const string Create = "CareplanObservationCreate";
            public const string Read = "CareplanObservationRead";
            public const string Update = "CareplanObservationUpdate";
            public const string Delete = "CareplanObservationDelete";
        }

        public class CareplanTreatmentNote
        {
            public const string Create = "CareplanTreatmentNoteCreate";
            public const string Read = "CareplanTreatmentNoteRead";
            public const string Update = "CareplanTreatmentNoteUpdate";
            public const string Delete = "CareplanTreatmentNoteDelete";
        }

        public class CareplanAssessment
        {
            public const string Create = "CareplanAssessmentCreate";
            public const string Read = "CareplanAssessmentRead";
            public const string Update = "CareplanAssessmentUpdate";
            public const string Delete = "CareplanAssessmentDelete";
        }
        public class CareplanReport
        {
            public const string Create = "CareplanReportCreate";
            public const string Read = "CareplanReportRead";
            public const string Update = "CareplanReportUpdate";
            public const string Delete = "CareplanReportDelete";
        }

        public class TimeEntry
        {
            public const string Create = "TimeEntryCreate";
            public const string Read = "TimeEntryRead";
            public const string Update = "TimeEntryUpdate";
            public const string Delete = "TimeEntryDelete";
            public const string ManageTypes = "TimeEntryManageTypes";
        }

        public class BillableItem
        {
            public const string Create = "BillableItemCreate";
            public const string Read = "BillableItemRead";
            public const string Update = "BillableItemUpdate";
            public const string Delete = "BillableItemDelete";
        }
        public class Invoice
        {
            public const string Create = "InvoiceCreate";
            public const string Read = "InvoiceRead";
        }

        public class MyTask
        {
            public const string Create = "MyTaskCreate";
            public const string Read = "MyTaskRead";
            public const string Update = "MyTaskUpdate";
            public const string Delete = "MyTaskDelete";
        }

        public class Statement
        {
            public const string Create = "StatementCreate";
            public const string Read = "StatementRead";
            public const string Update = "StatementUpdate";
            public const string Delete = "StatementDelete";
        }

        public class Medication
        {
            public const string Create = "MedicationCreate";
            public const string Read = "MedicationRead";
            public const string Update = "MedicationUpdate";
            public const string Delete = "MedicationDelete";
        }

        public class Allergy
        {
            public const string Create = "AllergyCreate";
            public const string Read = "AllergyRead";
            public const string Update = "AllergyUpdate";
            public const string Delete = "AllergyDelete";
        }

        public class PatientTreatmentNote
        {
            public const string Create = "PatientTreatmentNoteCreate";
            public const string Read = "PatientTreatmentNoteRead";
            public const string Update = "PatientTreatmentNoteUpdate";
            public const string Delete = "PatientTreatmentNoteDelete";
        }
        public class PatientAssessment
        {
            public const string Create = "PatientAssessmentCreate";
            public const string Read = "PatientAssessmentRead";
            public const string Update = "PatientAssessmentUpdate";
            public const string Delete = "PatientAssessmentDelete";
        }

        public class PatientObservation
        {
            public const string Create = "PatientObservationCreate";
            public const string Read = "PatientObservationRead";
            public const string Update = "PatientObservationUpdate";
            public const string Delete = "PatientObservationDelete";
        }

        public class Budget
        {
            public const string Create = "BudgetCreate";
            public const string Read = "BudgetRead";
            public const string Update = "BudgetUpdate";
            public const string Delete = "BudgetDelete";
        }
    }
}
