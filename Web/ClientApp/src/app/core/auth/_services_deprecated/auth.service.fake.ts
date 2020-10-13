// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap, tap } from 'rxjs/operators';
// Lodash
import { filter, some, find, each } from 'lodash';
// Environment
import { environment } from '../../../../environments/environment';
// CRUD
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../../_base/crud';
// Models
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { Participant } from '../_models/participant.model';
import { Appointment } from '../_models/appointment.model';
import { BillableItem } from '../_models/billableItem.model';
import { TherapyService } from '../_models/therapyService.model';
import { Time } from '../_models/time.model';
import { Task } from '../_models/task.model';
import { Medication } from '../_models/medication.model';
import { Allergy } from '../_models/allergy.model';
import { Budget } from '../_models/budget.model';
import { Careplan } from '../_models/careplan.model';
import { Note } from '../_models/note.model';
import { Notification } from '../_models/notification.model';
import { Setting } from '../_models/settings.model';

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions'; 
const API_ROLES_URL = 'api/roles';
const API_PATIENTS_URL = 'api/participants';
const API_APPOINTMENT_URL = 'api/appointments';
const API_APPOINTMENT_ARCHIVED_URL = 'api/appointments/archived';
const API_ASSESSMENT_ADD_URL = 'api/appointments/assessment/add';

const API_INVOICES_URL = 'api/billableItems';
const API_THERAPYSERVICES_URL = 'api/therapyServices';
const API_TIMES_URL = 'api/times';
const API_BILLABLEITEMS_URL = 'api/billableItems';
const API_TASKS_URL = 'api/tasks';
const API_MEDICATIONS_URL = 'api/medications';
const API_ALLERGY_URL = 'api/allergies';
const API_BUDGET_URL = 'api/budget';
const API_CAREPLANS_URL = 'api/careplans';
const API_NOTE_URL = 'api/notes';
const API_NOTIFICATION_URL = 'api/notification';
const API_SETTING_URL = 'api/setting';




@Injectable()
export class AuthService {
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	// Authentication/Authorization
	login(email: string, password: string): Observable<User> {
		if (!email || !password) {
			return of(null);
		}

		return this.getAllUsers().pipe(
			map((result: User[]) => {
				if (result.length <= 0) {
					return null;
				}

				const user = find(result, function (item: User) {
					return (item.email.toLowerCase() === email.toLowerCase() && item.password === password);
				});

				if (!user) {
					return null;
				}

				user.password = undefined;
				return user;
			})
		);

	}

	register(user: User): Observable<any> {
		//user.roles = [2]; // Manager
		user.accessToken = 'access-token-' + Math.random();
		user.refreshToken = 'access-token-' + Math.random();
		user.pic = './assets/media/users/default.jpg';

		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
			.pipe(
				map((res: User) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}

	requestPassword(email: string): Observable<any> {
		return this.http.get(API_USERS_URL).pipe(
			map((users: User[]) => {
				if (users.length <= 0) {
					return null;
				}

				const user = find(users, function (item: User) {
					return (item.email.toLowerCase() === email.toLowerCase());
				});

				if (!user) {
					return null;
				}

				user.password = undefined;
				return user;
			}),
			catchError(this.handleError('forgot-password', []))
		);
	}

	getUserByToken(): Observable<User> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		if (!userToken) {
			return of(null);
		}

		return this.getAllUsers().pipe(
			map((result: User[]) => {
				if (result.length <= 0) {
					return null;
				}

				const user = find(result, function (item: User) {
					return (item.accessToken === userToken.toString());
				});

				if (!user) {
					return null;
				}

				user.password = undefined;
				return user;
			})
		);
	}

	// Users

	// CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
		const httpHeaders = new HttpHeaders();
		// Note: Add headers if needed (tokens/bearer)
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders });
	}

	// READ
	getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(API_USERS_URL);
	}

	getUserById(userId: number): Observable<User> {
		if (!userId) {
			return of(null);
		}

		return this.http.get<User>(API_USERS_URL + `/${userId}`);
	}

	// DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_USERS_URL, _user, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		return this.getAllUsers().pipe(
			mergeMap((response: User[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);
			})
		);
	}

	// Permissions
	getAllPermissions(): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL);
	}

	getRolePermissions(roleId: number): Observable<Permission[]> {
		const allRolesRequest = this.http.get<Permission[]>(API_PERMISSION_URL);
		const roleRequest = roleId ? this.getRoleById(roleId) : of(null);
		return forkJoin(allRolesRequest, roleRequest).pipe(
			map(res => {
				const _allPermissions: Permission[] = res[0];
				const _role: Role = res[1];
				if (!_allPermissions || _allPermissions.length === 0) {
					return [];
				}

				const _rolePermission = _role ? _role.permissions : [];
				const result: Permission[] = this.getRolePermissionsTree(_allPermissions, _rolePermission);
				return result;
			})
		);
	}

	private getRolePermissionsTree(_allPermission: Permission[] = [], _rolePermissionIds: number[] = []): Permission[] {
		const result: Permission[] = [];
		const _root: Permission[] = filter(_allPermission, (item: Permission) => !item.parentId);
		each(_root, (_rootItem: Permission) => {
			_rootItem._children = [];
			_rootItem._children = this.collectChildrenPermission(_allPermission, _rootItem.id, _rolePermissionIds);
			_rootItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _rootItem.id));
			result.push(_rootItem);
		});
		return result;
	}

	private collectChildrenPermission(_allPermission: Permission[] = [],
		_parentId: number, _rolePermissionIds: number[] = []): Permission[] {
		const result: Permission[] = [];
		const _children: Permission[] = filter(_allPermission, (item: Permission) => item.parentId === _parentId);
		if (_children.length === 0) {
			return result;
		}

		each(_children, (_childItem: Permission) => {
			_childItem._children = [];
			_childItem._children = this.collectChildrenPermission(_allPermission, _childItem.id, _rolePermissionIds);
			_childItem.isSelected = (some(_rolePermissionIds, (id: number) => id === _childItem.id));
			result.push(_childItem);
		});
		return result;
	}

	// Roles
	getAllRoles(): Observable<Role[]> {
		return this.http.get<Role[]>(API_ROLES_URL);
	}

	getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
	}

	// CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<Role> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<Role>(url);
	}

	findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		return this.http.get<Role[]>(API_ROLES_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	// Check Role Before deletion
	isRoleAssignedToUsers(roleId: number): Observable<boolean> {
		return this.getAllUsers().pipe(
			map((users: User[]) => {
				if (some(users, (user: User) => some(user.roles, (_roleId: number) => _roleId === roleId))) {
					return true;
				}

				return false;
			})
		);
	}

	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}

	createParticipant(participant: Participant): Observable<Participant> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Participant>(API_PATIENTS_URL, participant, { headers: httpHeaders });
	}

	getAllParticipants(): Observable<Participant[]> {
		return this.http.get<Participant[]>(API_PATIENTS_URL);
	}

	getParticipantById(participantId: number) {
		if (!participantId) {
			return of(null);
		}

		return this.http.get<Participant>(API_PATIENTS_URL + `/${participantId}`);
	}

	deleteParticipant(participantId: number) {
		const url = `${API_PATIENTS_URL}/${participantId}`;
		return this.http.delete(url);
	}

	updateParticipant(_participant: Participant): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_PATIENTS_URL, _participant, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findParticipants(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllParticipants().pipe(
			mergeMap((response: Participant[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);
			})
		);
	}

	// BillableItem


	createBillableItem(BillableItem: BillableItem): Observable<BillableItem> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<BillableItem>(API_INVOICES_URL, BillableItem, { headers: httpHeaders });
	}

	getAllBillableItems(): Observable<BillableItem[]> {
		return this.http.get<BillableItem[]>(API_INVOICES_URL);
	}

	getBillableItemById(BillableItemId: number) {
		if (!BillableItemId) {
			return of(null);
		}

		return this.http.get<BillableItem>(API_INVOICES_URL + `/${BillableItemId}`);
	}

	deleteBillableItem(BillableItemId: number) {
		const url = `${API_INVOICES_URL}/${BillableItemId}`;
		return this.http.delete(url);
	}

	updateBillableItem(_BillableItem: BillableItem): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_INVOICES_URL, _BillableItem, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findBillableItems(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllBillableItems().pipe(
			mergeMap((response: BillableItem[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);

			})
		);
	}

	// Therapy Service Summary

	createTherapyService(TherapyService: TherapyService): Observable<TherapyService> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<TherapyService>(API_THERAPYSERVICES_URL, TherapyService, { headers: httpHeaders });
	}

	getAllTherapyServices(): Observable<TherapyService[]> {
		return this.http.get<TherapyService[]>(API_THERAPYSERVICES_URL);
	}

	getTherapyServiceById(TherapyServiceId: number) {
		if (!TherapyServiceId) {
			return of(null);
		}

		return this.http.get<TherapyService>(API_THERAPYSERVICES_URL + `/${TherapyServiceId}`);
	}

	deleteTherapyService(TherapyServiceId: number) {
		const url = `${API_THERAPYSERVICES_URL}/${TherapyServiceId}`;
		return this.http.delete(url);
	}

	updateTherapyService(_TherapyService: TherapyService): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_THERAPYSERVICES_URL, _TherapyService, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findTherapyServices(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllTherapyServices().pipe(
			mergeMap((response: TherapyService[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);

			})
		);
	}


	// Time Entry

	createTime(Time: Time): Observable<Time> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Time>(API_TIMES_URL, Time, { headers: httpHeaders });
	}

	getAllTimes(): Observable<Time[]> {
		return this.http.get<Time[]>(API_TIMES_URL);
	}

	getTimeById(TimeId: number) {
		if (!TimeId) {
			return of(null);
		}

		return this.http.get<Time>(API_TIMES_URL + `/${TimeId}`);
	}

	deleteTime(TimeId: number) {
		const url = `${API_TIMES_URL}/${TimeId}`;
		return this.http.delete(url);
	}

	updateTime(_Time: Time): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_TIMES_URL, _Time, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findTimes(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllTimes().pipe(
			mergeMap((response: Time[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);

			})
		);
	}

	// tasks


	createTask(Task: Task): Observable<Task> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Task>(API_TASKS_URL, Task, { headers: httpHeaders });
	}

	getAllTasks(): Observable<Task[]> {
		return this.http.get<Task[]>(API_TASKS_URL);
	}

	getTaskById(TaskId: number) {
		if (!TaskId) {
			return of(null);
		}

		return this.http.get<Task>(API_TASKS_URL + `/${TaskId}`);
	}

	deleteTask(TaskId: number) {
		const url = `${API_TASKS_URL}/${TaskId}`;
		return this.http.delete(url);
	}

	updateTask(_Task: Task): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_TASKS_URL, _Task, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findTasks(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllTasks().pipe(
			mergeMap((response: Task[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);

			})
		);
	}

	createAppointment(appointment: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Appointment>(API_APPOINTMENT_URL, appointment, { headers: httpHeaders });
	}

	findAppointments(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.get<Appointment[]>(API_APPOINTMENT_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the appointment on the server
	updateAppointment(appointment: Appointment): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_APPOINTMENT_URL, appointment, { headers: httpHeaders });
	}
	// DELETE => delete the appointment from the server
	deleteAppointment(appointmentId: number): Observable<Appointment> {
		const url = `${API_APPOINTMENT_URL}/${appointmentId}`;
		return this.http.delete<Appointment>(url);
	}

	// archived appointments
	archiveAppointment(archivedappointments: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Appointment>(API_APPOINTMENT_ARCHIVED_URL, archivedappointments, { headers: httpHeaders });
	}

	// add assessment in appointments
	addAssessment(assessment: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put<Appointment>(API_APPOINTMENT_URL, assessment, { headers: httpHeaders });
	}

	// add assessment in appointments
	addObservation(observation: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put<Appointment>(API_APPOINTMENT_URL, observation, { headers: httpHeaders });
	}

	findMedications(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_MEDICATIONS_URL}`;
		return this.http.get<Medication[]>(url).pipe(
			mergeMap(res => {
				res = res.filter(item => item.participant_id == participant_id);
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	createMedication(medication: Medication): Observable<Medication> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Medication>(API_MEDICATIONS_URL, medication, { headers: httpHeaders });
	}

	deleteMedication(medicationId: number): Observable<Medication> {
		const url = `${API_MEDICATIONS_URL}/${medicationId}`;
		return this.http.delete<Medication>(url);
	}

	findAllergies(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_ALLERGY_URL}`;
		return this.http.get<Allergy[]>(url).pipe(
			mergeMap(res => {
				res = res.filter(item => item.participant_id == participant_id);
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);

			})
		);
	}

	deleteAllergy(allergyId: number): Observable<Allergy> {
		const url = `${API_ALLERGY_URL}/${allergyId}`;
		return this.http.delete<Allergy>(url);
	}
	createAllergy(allergy: Allergy): Observable<Allergy> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Allergy>(API_ALLERGY_URL, allergy, { headers: httpHeaders });
	}

	findBudget(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_BUDGET_URL}`;
		return this.http.get<Budget[]>(url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	// Care Plan 

	createCareplan(Careplan: Careplan): Observable<Careplan> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Careplan>(API_CAREPLANS_URL, Careplan, { headers: httpHeaders });
	}

	getAllCareplans(): Observable<Careplan[]> {
		return this.http.get<Careplan[]>(API_CAREPLANS_URL);
	}

	getCareplanById(CareplanId: number) {
		if (!CareplanId) {
			return of(null);
		}

		return this.http.get<Careplan>(API_CAREPLANS_URL + `/${CareplanId}`);
	}

	deleteCareplan(CareplanId: number) {
		const url = `${API_CAREPLANS_URL}/${CareplanId}`;
		return this.http.delete(url);
	}

	updateCareplan(_Careplan: Careplan): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_CAREPLANS_URL, _Careplan, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findCareplans(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllCareplans().pipe(
			mergeMap((response: Careplan[]) => {
				const result = this.httpUtils.baseFilter(response, queryParams, []);
				return of(result);

			})
		);
	}

	createBudget(budget: Budget): Observable<Budget> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Budget>(API_BUDGET_URL, budget, { headers: httpHeaders });
	}

	deleteBudget(budgetId: number): Observable<Budget> {
		const url = `${API_BUDGET_URL}/${budgetId}`;
		return this.http.delete<Budget>(url);
	}


	updateBudget(budget: any): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_BUDGET_URL, budget, { headers: httpHeader });
	}

	updatedBudgetAmount(budget: any): Observable<any> {
		const tasks$ = [];
		each(budget, element => {
			const _budget = Object.assign({}, element);
			tasks$.push(this.updateBudget(_budget));
		});
		return forkJoin(tasks$);
	}

	findNote(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_NOTE_URL}`;
		return this.http.get<Note[]>(url).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}

	createNote(note: Note): Observable<Note> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Note>(API_NOTE_URL, note, { headers: httpHeaders });
	}


	findNotificationByParticipant(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_NOTIFICATION_URL}`;
		return this.http.get<Notification[]>(url).pipe(
			mergeMap(res => {
				res = res.filter(item => item.participant_id == participant_id);
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}


	findNotifications(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.get<Notification[]>(API_NOTIFICATION_URL).pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);
			})
		);
	}


	createNotification(notification: Notification): Observable<Notification> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Notification>(API_NOTIFICATION_URL, notification, { headers: httpHeaders });
	}

	findSettings(queryParams: QueryParamsModel, user_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_SETTING_URL}`;
		return this.http.get<Setting[]>(url).pipe(
			mergeMap(res => {
				res = res.filter(item => item.userId == user_id);
				const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(result);

			})
		);
	}

	updateSetting(_setting: Setting): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_SETTING_URL, _setting, { headers: httpHeaders }).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

}
