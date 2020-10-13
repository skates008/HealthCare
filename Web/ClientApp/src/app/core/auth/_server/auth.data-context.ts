import { UsersTable } from './users.table';
import { PermissionsTable } from './permissions.table';
import { RolesTable } from './roles.table';
import { ParticipantsTable } from './participant.table';
import { AppointmentsTable } from './appointments.table';
import { ArchivedAppointmentsTable } from './archived_appointments.table';
import { BillableItemsTable } from './billableItem.table';
import { TherapyServicesTable } from './therapyService.table';
import { TimesTable } from './time.table';
import { TasksTable } from './task.table';
import { InvoicesTable } from './invoice.table';
import { MedicationsTable } from './medications.table';
import { AllergiesTable } from './allergies.table';
import { BudgetTable } from './budget.table';
import { CareplansTable } from './careplan.table';
import { NotesTable } from './notes.table';
import { NotificationTable } from './notifications.table';
import { SettingsTable } from './settings.table';

// Wrapper class
export class AuthDataContext {
	public static users: any = UsersTable.users;
	public static roles: any = RolesTable.roles;
	public static permissions = PermissionsTable.permissions;
	public static participants: any = ParticipantsTable.participants;
	public static appointments: any = AppointmentsTable.appointments;
	public static archivedappointments: any = ArchivedAppointmentsTable.archived_appointments;
	public static billableItems: any = BillableItemsTable.billableItems;
	public static therapyServices: any = TherapyServicesTable.therapyServices;
	public static times: any = TimesTable.times;
	public static tasks: any = TasksTable.tasks;
	public static invoices: any = InvoicesTable.invoices;
	public static medications: any = MedicationsTable.medications;
	public static allergies: any = AllergiesTable.allergies;
	public static budget: any = BudgetTable.budget;
	public static careplans: any = CareplansTable.careplans;
	public static notes: any = NotesTable.notes;
	public static notifications: any = NotificationTable.notification;
	public static settings: any = SettingsTable.settings;

}
