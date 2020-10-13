// Angular
import { Injectable } from '@angular/core';
// Angular in memory
import { InMemoryDbService } from 'angular-in-memory-web-api';
// RxJS
import { Observable } from 'rxjs';
// Auth
import { AuthDataContext } from '../../../../auth';
// Models
import { CarsDb } from './fake-db/cars';

@Injectable()
export class FakeApiService implements InMemoryDbService {
	/**
	 * Service Constructore
	 */
	constructor() { }

	/**
	 * Create Fake DB and API
	 */
	createDb(): {} | Observable<{}> {
		// tslint:disable-next-line:class-name
		const db = {
			// auth module
			users: AuthDataContext.users,
			roles: AuthDataContext.roles,
			permissions: AuthDataContext.permissions,
			// custom
			participants: AuthDataContext.participants,
			appointments: AuthDataContext.appointments,
			billableItems: AuthDataContext.billableItems,
			therapyServices: AuthDataContext.therapyServices,
			times: AuthDataContext.times,
			tasks: AuthDataContext.tasks,
			careplans: AuthDataContext.careplans,
			archivedappointments: AuthDataContext.archivedappointments,
			medications: AuthDataContext.medications,
			allergies: AuthDataContext.allergies,
			budget: AuthDataContext.budget,
			notes: AuthDataContext.notes,
			notification: AuthDataContext.notifications,
			setting: AuthDataContext.settings,

			// data-table
			cars: CarsDb.cars
		};
		return db;
	}
}
