// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { Allergy } from '../_models/allergy.model';
import { Budget } from '../_models/budget.model';
import { Careplan } from '../_models/careplan.model';
import { Note } from '../_models/note.model';
import { Setting } from '../_models/settings.model';
import { Task } from '../_models/task.model';
import { Team } from '../_models/team.model';
import { Invoice } from '../_models/invoice.model';
import { Medication } from '../_models/medication.model';
import { Notification } from '../_models/notification.model';
import { Practitioner } from '../_models/practitioner.model';
import { BillableItem } from '../_models/billableItem.model';
import { TherapyService } from '../_models/therapyService.model';
import { Time } from '../_models/time.model';
import { Profile } from '../_models/profile.model';
import { Password } from '../_models/password.model';
import { Company } from '../_models/company.model';
import { ProviderBasic } from '../_models/providerBasic.model';
import { UserNote } from '../_models/userNote.model';
import { Assessment } from '../_models/assessment.model';
import { Agreement } from '../_models/agreement.model';
import { Files } from '../_models/file.model';

const API_ACCOUNT_REGISTER_URL = 'api/account/register'
const API_ACCOUNT_LOGIN = 'api/account/login'
const API_USERS_URL = 'api/account/login';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';
const API_PATIENTS_URL = 'api/patient/list';
const API_COMPANYS_URL = 'api/provider/list';
const API_CREATE_PATIENT = 'api/patient';
const API_LIST_APPOINTMENT = 'api/appointment/list';
const API_APPOINTMENT_URL = 'api/appointments';
const API_CREATE_APPOINMENT = 'api/appointment';
const API_LIST_MEDICATION = 'api/patient/medication/list'
const API_LIST_ALLERGIES = 'api/patient/allergy/list'
const API_LIST_PRACTITIONER = 'api/list/practitioner';
const API_CREATE_MEDICATION = 'api/patient/medication';
const API_CREATE_ALLERGIES = 'api/patient/allergy';
const API_LIST_BUDGET = 'api/patient/budgets';
const API_CREATE_CAREPLAN = 'api/careplans';
const API_LIST_TASK = 'api/mytask/list';
const API_LIST_TEAM = 'api/team/list';
const API_TASK_URL = 'api/mytask';
const API_LIST_INVOICE = 'api/myinvoice/list';
const API_INVOICE_URL = 'api/myinvoice';

const API_APPOINTMENT_ARCHIVED_URL = 'api/appointments/archived';
const API_ASSESSMENT_ADD_URL = 'api/appointments/assessment/add';

const API_THERAPYSERVICES_URL = 'api/therapyServices';
const API_TIMES_URL = 'api/times';
const API_BILLABLEITEMS_URL = 'api/billableItem';
const API_TASKS_URL = 'api/tasks';
const API_TEAMS_URL = 'api/team';
const API_INVOICES_URL = 'api/invoices';
const API_MEDICATIONS_URL = 'api/patient/medication';
const API_ALLERGY_URL = 'api/patient/allergy';
const API_BUDGET_URL = 'api/patient/budget';
const API_CAREPLANS_URL = 'api/careplans';
const API_NOTE_URL = 'api/notes';
const API_NOTIFICATION_URL = 'api/notification';
const API_SETTING_URL = 'api/setting';
const API_LIST_CAREPLAN = 'api/patient/careplan/list';
const API_UPCOMING_APPOINTMENT = 'api/appointment/list/upcoming';

// Invoice APIs
const APIS_INVOICE_URL = 'api/invoice';

const BaseUrl = environment.BaseURL;

@Injectable()
export class AuthService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
	}

	// Authentication/Authorization
	login(userName: string, password: string): Observable<any> {
		const data = {
			userName: userName,
			password: password
		}
		return this.http.post(BaseUrl + API_ACCOUNT_LOGIN, data);
	}

	register(user): Observable<any> {
		return this.http.post<User>(BaseUrl + API_ACCOUNT_REGISTER_URL, user);
	}

	getIsRegistered() {
		return this.http.get(BaseUrl + 'api/account/isRegistrationComplete');
	}

	requestPassword(data: string): Observable<any> {
		const value = { email: data };
		return this.http.post(BaseUrl + 'api/account/forgotpassword', value).pipe(
			mergeMap(res => {
				const result: any = res;
				return of(result);
			})
		);
	}

	resetPassword(data): Observable<any> {
		return this.http.post(BaseUrl + 'api/account/resetpassword', data).pipe(
			mergeMap(res => {
				const result: any = res;
				return of(result);
			})
		);
	}

	// getUserByToken(): Observable<User> {
	// 	const userData = localStorage.getItem("user_data");
	// 	if(userData){
	// 	const userToken = JSON.parse(userData).user_details.accessToken;
	// 	const _user = JSON.parse(userData).user_details.loginInfo;
	// 	return  _user;	
	// 	}

	// }


	// Users

	// CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
		const url = `${BaseUrl}api/usermanagement/user`;
		return this.http.post<User>(url, user);
	}

	// READ
	getAllUsers(): Observable<User[]> {
		const url = `${BaseUrl}api/usermanagement/user/list`;
		const data = {};
		return this.http.post<User[]>(url, data);
	}

	// 
	findUser(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/usermanagement/user/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getUserById(userId: string): Observable<User> {
		if (!userId) {
			return of(null);
		}
		const url = `${BaseUrl}api/usermanagement/user/${userId}`
		const data = {};
		return this.http.get<User>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${BaseUrl}api/usermanagement/user/${userId}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
		const url = `${BaseUrl}api/usermanagement/user/${_user.id}`;
		return this.http.put(url, _user).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.getAllUsers().pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// UserNote
	// CREATE =>  POST: add a new UserNote to the server
	createUserNote(data: any, id) {
		const url = `${BaseUrl}api/note`;
		return this.http.post<any>(url, data);
	}

	// READ
	getAllUserNote(): Observable<UserNote[]> {
		const url = `${BaseUrl}api/note`;
		const data = {};
		return this.http.post<UserNote[]>(url, data);
	}

	// Filter user notes
	findUserNote(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		// const url = `${BaseUrl}api/patient/${id}/note/list`;
		const url = `${BaseUrl}api/note/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				const value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getUserNoteById(userNoteId: string, id) {
		const url = `${BaseUrl}api/note/${userNoteId}`;
		return this.http.get<UserNote>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the userNote from the server
	deleteUserNote(userNote) {
		const url = `${BaseUrl}api/note/${userNote.id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the userNote on the server
	updateUserNote(userNote: UserNote, id, userNoteId): Observable<any> {
		const url = `${BaseUrl}api/note/${userNoteId}`;
		return this.http.put(url, userNote).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}


	// Assessment
	// CREATE =>  POST: add a new assessment to the server
	createAssessment(data: any, id) {
		const url = `${BaseUrl}api/patient/${id}/assessment`;
		return this.http.post<any>(url, data);
	}

	// READ
	getAllAssessment(): Observable<Assessment[]> {
		const url = `${BaseUrl}api/assessment`;
		const data = {};
		return this.http.post<Assessment[]>(url, data);
	}

	// Filter user notes
	findAssessment(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/patient/${id}/assessment/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				let value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getAssessmentById(assessmentId: string, id) {
		const url = `${BaseUrl}api/patient/${id}/assessment/${assessmentId}`;
		return this.http.get<Assessment>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the assessment from the server
	deleteAssessment(assessment) {
		const url = `${BaseUrl}api/patient/${assessment.patientId}/assessment/${assessment.id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the assessment on the server
	updateAssessment(assessment: Assessment, id, assessmentId): Observable<any> {
		const url = `${BaseUrl}api/patient/${id}/assessment/${assessmentId}`;
		return this.http.put(url, assessment).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}


	deleteFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.delete(url);
	}

	downloadFile(id) {
		const url = `${BaseUrl}api/file/${id}`;
		return this.http.get(url, { responseType: 'blob' as 'json' }).pipe(
			catchError(err => {
				return of(null);
			}));
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findAssessments(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.getAllAssessment().pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	// Agreement
	// CREATE =>  POST: add a new agreement to the server
	createAgreement(data: any, id) {
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement`;
		return this.http.post<any>(url, data);
	}

	// READ
	getAllAgreement(): Observable<Agreement[]> {
		const url = `${BaseUrl}api/serviceAgreement`;
		const data = {};
		return this.http.post<Agreement[]>(url, data);
	}

	// Filter user notes
	findAgreement(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				let value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getAgreementById(agreementId: string, id) {
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement/${agreementId}`;
		return this.http.get<Agreement>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// DELETE => delete the agreement from the server
	deleteAgreement(agreement) {
		const url = `${BaseUrl}api/patient/${agreement.patientId}/serviceAgreement/${agreement.id}`;
		return this.http.delete(url);
	}

	// UPDATE => PUT: update the agreement on the server
	updateAgreement(agreement: Agreement, id, agreementId): Observable<any> {
		const url = `${BaseUrl}api/patient/${id}/serviceAgreement/${agreementId}`;
		return this.http.put(url, agreement).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// File
	// CREATE =>  POST: add a new file to the server
	createFile(data: any, id) {
		const url = `${BaseUrl}api/patient/${id}/file`;
		return this.http.post<any>(url, data);
	}

	// Filter user notes
	findFile(queryParams: QueryParamsModel, id): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl}api/patient/${id}/file/list`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				let value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getFileById(agreementId: string, id) {
		const url = `${BaseUrl}api/patient/${id}/serviceFile/${agreementId}`;
		return this.http.get<File>(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// UPDATE => PUT: update the agreement on the server
	updateFile(agreement: Files, id, agreementId): Observable<any> {
		const url = `${BaseUrl}api/patient/${id}/file/${agreementId}`;
		return this.http.put(url, agreement).pipe(
			catchError(err => {
				return of(null);
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

	getRolesList(): Observable<any> {
		const url = `${BaseUrl}api/list/userType`;
		return this.http.get<Role[]>(url).pipe(
			mergeMap(res => {
				return of(res);
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

	// Particpants API

	createParticipant(participant: Participant): Observable<Participant> {
		return this.http.post<Participant>(BaseUrl + API_CREATE_PATIENT, participant).pipe(
			mergeMap(response => {
				return of(response);
			})
		);
	}

	findParticipant(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_PATIENTS_URL, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	findParticipants(queryParams: QueryParamsModel): Observable<any> {
		return this.getAllParticipants().pipe(
			mergeMap((response: any) => {
				const result = this.httpUtils.baseFilter(response.data, queryParams, []);
				return of(result);
			})
		);
	}

	getAllParticipants(): Observable<Participant[]> {
		const data = {};
		return this.http.post<Participant[]>(BaseUrl + API_PATIENTS_URL, data);
	}

	getParticipantById(participantId: string) {
		if (!participantId) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${participantId}/details`;

		return this.http.get<Participant>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	getParticipantEditList(participantId: string) {
		if (!participantId) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${participantId}`;

		return this.http.get<Participant>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getParticipantsProfile() {
		const url = `${BaseUrl}api/patient/myprofile`;
		return this.http.get<Participant>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateParticipant(_participant: Participant): Observable<any> {
		const url = `${BaseUrl}api/patient/${_participant.id}`;
		return this.http.put(url, _participant).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteParticipant(participantId) {
		const url = `${BaseUrl}api/patient/${participantId}`;
		return this.http.delete(url);
	}

	// registration Participant
	getInitRegistration(participant: any) {
		const url = `${BaseUrl}api/patient/initRegistration`;
		return this.http.post<Participant>(url, {})
			.pipe(
				mergeMap((response: any) => {
					return of(response);
				})
			);
	}

	postRegistartionData(registrationData: any) {
		const url = `${BaseUrl}api/patient/registrationComplete`;
		return this.http.post<Participant>(url, registrationData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);

	}


	// tasks
	createTask(Task: Task): Observable<Task> {
		const httpHeaders = new HttpHeaders();
		return this.http.post<Task>(BaseUrl + API_TASK_URL, Task).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getAllTasks(): Observable<Task[]> {
		const data = {}
		return this.http.post<Task[]>(BaseUrl + API_LIST_TASK, {});
	}

	findTask(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_LIST_TASK, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getTaskById(TaskId: number) {
		if (!TaskId) {
			return of(null);
		}

		return this.http.get<Task>(API_TASKS_URL + `/${TaskId}`);
	}

	deleteTask(taskId: number) {
		let httpParams = new HttpParams();
		let options = { params: httpParams };
		const url = `${BaseUrl}${API_TASK_URL}/${taskId}`;
		return this.http.delete(url, options);
	}

	updateTask(_Task: Task): Observable<any> {
		const url = `${BaseUrl}api/mytask/${_Task.id}`
		return this.http.put(url, _Task).pipe(
			mergeMap((response: Task[]) => {
				return of(response);
			})
		);
	}

	findTasks(queryParams: QueryParamsModel): Observable<any> {
		return this.getAllTasks().pipe(
			mergeMap((response: Task[]) => {
				return of(response);
			})
		);
	}

	// teams
	createTeam(Team: Team): Observable<Team> {
		const httpHeaders = new HttpHeaders();
		return this.http.post<Team>(BaseUrl + API_TEAMS_URL, Team).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findTeam(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_LIST_TEAM, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	getAllTeams(): Observable<Team[]> {
		const data = {}
		return this.http.get<Team[]>(BaseUrl + API_TEAMS_URL);
	}

	getTeamById(TeamId: number) {
		if (!TeamId) {
			return of(null);
		}

		return this.http.get<Team>(API_TEAMS_URL + `/${TeamId}`);
	}

	deleteTeam(teamId: number) {
		let httpParams = new HttpParams();
		let options = { params: httpParams };
		const url = `${BaseUrl}${API_TEAMS_URL}/${teamId}`;
		return this.http.delete(url, options);
	}

	updateTeam(_Team: Team): Observable<any> {
		const url = `${BaseUrl}${API_TEAMS_URL}/${_Team.id}`;
		return this.http.put(url, _Team).pipe(
			mergeMap((response: Team[]) => {
				return of(response);
			})
		);
	}



	// invoices
	createInvoice(Invoice: Invoice): Observable<Invoice> {
		const httpHeaders = new HttpHeaders();
		return this.http.post<Invoice>(BaseUrl + API_INVOICE_URL, Invoice).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getInvoiceById(InvoiceId: number) {
		if (!InvoiceId) {
			return of(null);
		}

		return this.http.get<Invoice>(API_INVOICES_URL + `/${InvoiceId}`);
	}

	deleteInvoice(invoiceId: number) {
		let httpParams = new HttpParams();
		let options = { params: httpParams };
		const url = `${BaseUrl}${API_INVOICE_URL}/${invoiceId}`;
		return this.http.delete(url, options);
	}

	updateInvoice(_Invoice: Invoice): Observable<any> {
		const url = `${BaseUrl}api/myinvoice/${_Invoice.id}`
		return this.http.put(url, _Invoice).pipe(
			mergeMap((response: Invoice[]) => {
				return of(response);
			})
		);
	}


	findInvoices(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const list_invoice = 'api/invoice/list';
		const url = `${BaseUrl + list_invoice}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	// sendInvoice(invoiceId): Observable<any> {
	// 	// end email to participant API call will be here.
	// 	const list_invoice = `api/invoice/${invoiceId}/email`;
	// 	const url = `${BaseUrl + list_invoice}`;
	// 	return this.http.post<any[]>(url, invoiceId).pipe(
	// 		mergeMap((response: any) => {
	// 			return of(response);
	// 		})
	// 	);
	// }



	createAppointment(appointment: Appointment): Observable<Appointment> {
		return this.http.post<Appointment>(BaseUrl + API_CREATE_APPOINMENT, appointment).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// UPDATE => PUT: update the appointment on the server
	updateAppointment(appointment: Appointment): Observable<any> {
		return this.http.put(BaseUrl + API_CREATE_APPOINMENT + '/' + appointment.id, appointment);
	}



	findAppointments(queryParams: QueryParamsModel, appointmentParams): Observable<any> {
		return this.http.post<Appointment[]>(BaseUrl + API_LIST_APPOINTMENT, appointmentParams)
			.pipe(
				mergeMap((response: Appointment[]) => {
					return of(response);
				})

			);
	}


	findUpcomingAppointments(): Observable<any> {
		const data = {};
		return this.http.post<Appointment[]>(BaseUrl + API_UPCOMING_APPOINTMENT, data)
			.pipe(
				mergeMap((response) => {
					return of(response);
				})

			);
	}



	// DELETE => delete the appointment from the server
	deleteAppointment(appointmentId: number): Observable<Appointment> {
		const url = `${API_APPOINTMENT_URL}/${appointmentId}`;
		return this.http.delete<Appointment>(url);
	}

	// Cancel => delete the appointment from the server
	cancelAppointment(id: any, cancelData: any): Observable<any> {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post<any>(url, cancelData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	apptAction(id: any, data: any): Observable<any> {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post<any>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getAppointmentById(id) {
		const url = `${BaseUrl}api/appointment/${id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(response);
			})
		);
	}



	// // finalize => delete the appointment from the server
	finalizeAppointment(id: any, finalizeData: any): Observable<any> {
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post(url, finalizeData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	// archived appointments //not used
	archiveAppointment(archivedappointments: Appointment): Observable<Appointment> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `${API_APPOINTMENT_URL}`;
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
		const url = API_LIST_MEDICATION;
		const data = {};
		return this.http.post<Medication[]>(BaseUrl + url, data).pipe(
			mergeMap(res => {
				return of(res);
				// const medicationItems = res["data"];
				// res = medicationItems.filter(item => item.id == participant_id);
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				// return of(result);
			})
		);
	}

	createMedication(medication: Medication): Observable<Medication> {
		// const httpHeaders = new HttpHeaders();
		// httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Medication>(BaseUrl + API_CREATE_MEDICATION, medication);
	}

	deleteMedication(medicationId: number): Observable<Medication> {
		let httpParams = new HttpParams();
		let options = { params: httpParams };
		const url = `${API_MEDICATIONS_URL}/${medicationId}`;
		return this.http.delete<Medication>(BaseUrl + url, options);
	}

	findAllergies(queryParams: QueryParamsModel, participant_id): Observable<any> {
		const url = API_LIST_ALLERGIES;
		const data = {}
		return this.http.post<Allergy[]>(BaseUrl + url, {}).pipe(
			mergeMap(res => {
				// res = res.filter(item => item.participant_id == participant_id);
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);

			})
		);
	}

	deleteAllergy(allergyId: number): Observable<Allergy> {
		let httpParams = new HttpParams();
		let options = { params: httpParams };
		const url = `${API_ALLERGY_URL}/${allergyId}`;
		return this.http.delete<Allergy>(BaseUrl + url, options);
	}
	createAllergy(allergy: Allergy): Observable<Allergy> {
		return this.http.post<Allergy>(BaseUrl + API_CREATE_ALLERGIES, allergy);
	}

	findBudget(queryParams: QueryParamsModel, participant_id): Observable<any> {
		// This code imitates server calls
		const url = `${API_LIST_BUDGET}`;
		return this.http.get<Budget[]>(BaseUrl + url).pipe(
			mergeMap(res => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);
			})
		);
	}

	findBudgetByPatient(participant_id): Observable<any> {
		const url = `${BaseUrl}api/list/budget/${participant_id}`;
		return this.http.get<Budget[]>(url).pipe(
			mergeMap(res => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);
			})
		);
	}

	// Care Plan 

	createCareplan(Careplan: Careplan): Observable<Careplan> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `api/patient/${Careplan.patientId}/careplan`;
		return this.http.post<Careplan>(BaseUrl + url, Careplan, { headers: httpHeaders });
	}


	getAllCareplans(): Observable<any> {
		const data = {
			"Take": 10,
			"Skip": 0
		}
		return this.http.post<Careplan[]>(BaseUrl + API_LIST_CAREPLAN, data);
	}

	findCareplan(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const url = `${BaseUrl + API_LIST_CAREPLAN}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	findCareplans(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = BaseUrl + API_LIST_CAREPLAN;
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	// findCareplans(queryParams: QueryParamsModel): Observable<any> {
	// 	return this.getAllCareplans().pipe(
	// 		mergeMap((response: Careplan[]) => {
	// 			const result = this.httpUtils.baseFilter(response, queryParams, []);
	// 			return of(response);
	// 		})
	// 	);
	// }

	deleteCareplan(Careplan: Careplan) {
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}`;
		return this.http.delete(url);
	}

	// findAllergies(queryParams: QueryParamsModel, participant_id): Observable<any> {


	getCareplanDetails(Careplan: any) {
		if (!Careplan) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplandetails/${Careplan.id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findEditPageCareplans(Careplan) {
		if (!Careplan) {
			return of(null);
		}
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findCareplansForTimeEntry(id) {
		const url = `${BaseUrl}api/list/careplan/${id}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateCareplan(Careplan: Careplan): Observable<any> {
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}`;
		return this.http.put(url, Careplan).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}



	createBudget(budget: Budget): Observable<any> {
		return this.http.post<Budget>(BaseUrl + API_BUDGET_URL, budget).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		)
	}

	deleteBudget(budgetId: number): Observable<Budget> {
		let httpParams = new HttpParams();
		let options = { params: httpParams };
		const url = BaseUrl + `${API_BUDGET_URL}/${budgetId}`;
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
		const url = `${BaseUrl}api/patient/${note.participant_id}/${note.type}`;
		let data = {};
		if (note.type == "observation") {
			data = {
				Observation: note.text
			}
		}
		else if (note.type == "assessment") {
			data = {
				Assessment: note.text
			}
		}
		else if (note.type == "treatmentNote") {
			data = {
				TreatmentNote: note.text
			}
		}
		return this.http.post<Note>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response.data);
			})
		);
	}


	createAppointmentNote(note: Note): Observable<Note> {
		const url = `${BaseUrl}api/appointment/${note.appointmentId}/${note.type}`;
		// const data = {
		// 	text: note.text
		// }
		let data = {};
		if (note.type == "observation") {
			data = {
				Observation: note.text
			}
		}
		else if (note.type == "assessment") {
			data = {
				Assessment: note.text
			}
		}
		else if (note.type == "treatmentNote") {
			data = {
				TreatmentNote: note.text
			}
		}
		return this.http.post<Note>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response.data);
			})
		);
	}


	createCareplanNote(note: Note): Observable<Note> {
		const url = `${BaseUrl}api/patient/${note.participant_id}/careplan/${note.careplanId}/${note.type}`;
		// const data = {
		// 	text: note.text
		// }
		let data = {};
		if (note.type == "observation") {
			data = {
				Observation: note.text
			}
		}
		else if (note.type == "assessment") {
			data = {
				Assessment: note.text
			}
		}
		else if (note.type == "treatmentNote") {
			data = {
				TreatmentNote: note.text
			}
		}
		return this.http.post<Note>(url, data).pipe(
			mergeMap((response: any) => {
				return of(response.data);
			})
		);
	}

	// findNotificationByParticipant(queryParams: QueryParamsModel, participant_id): Observable<any> {
	// 	// This code imitates server calls
	// 	const url = `${API_NOTIFICATION_URL}`;
	// 	return this.http.get<Notification[]>(url).pipe(
	// 		mergeMap(res => {
	// 			res = res.filter(item => item.participant_id == participant_id);
	// 			const result = this.httpUtils.baseFilter(res, queryParams, []);
	// 			return of(result);
	// 		})
	// 	);
	// }



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

	findPractitioner(queryParams: QueryParamsModel): Observable<Practitioner[]> {
		// const data ={};
		return this.http.get<Practitioner[]>(BaseUrl + API_LIST_PRACTITIONER);

	}

	findPractitionerWithTeam(teamId): Observable<any[]> {
		if (teamId) {
			return this.http.get<any[]>(BaseUrl + API_LIST_PRACTITIONER + '/' + teamId);
		}
	}

	listParticipant() {
		return this.http.get(BaseUrl + 'api/list/participant');
	}


	// BillableItem


	createBillableItem(BillableItem: BillableItem): Observable<any> {
		const url = `${BaseUrl}${API_BILLABLEITEMS_URL}`
		return this.http.post<BillableItem>(url, BillableItem).pipe(
			mergeMap((response) => {
				return of(response);
			})
		);
	}

	getAllBillableItems(): Observable<BillableItem[]> {
		const data = {};
		return this.http.post<BillableItem[]>(BaseUrl + 'api/billableItem/list', data);
	}

	getBillableItemById(BillableItemId: string): Observable<any> {
		if (!BillableItemId) {
			return of(null);
		}
		const url = `${BaseUrl}api/billableItem/${BillableItemId}`;
		return this.http.get<any>(url).pipe(
			mergeMap((response) => {
				return of(response);
			})
		);
	}

	deleteBillableItem(BillableItemId) {
		const url = `${BaseUrl}api/billableItem/${BillableItemId}`;
		return this.http.delete(url);
	}



	updateBillableItem(_BillableItem: BillableItem): Observable<any> {
		return this.http.put(BaseUrl + API_BILLABLEITEMS_URL + "/" + _BillableItem.id, _BillableItem).pipe(
			mergeMap((response) => {
				return of(response);
				// const result = this.httpUtils.baseFilter(response, queryParams, []);

			})
		);
	}

	// findBillableItems(queryParams: QueryParamsModel): Observable<any> {
	// 	return this.getAllBillableItems().pipe(
	// 		mergeMap((response) => {
	// 			return of(response);
	// 			// const result = this.httpUtils.baseFilter(response, queryParams, []);

	// 		})
	// 	);
	// }

	findBillableItems(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		const list_billable = 'api/billableItem/list';
		const url = `${BaseUrl + list_billable}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
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
	createTime(Time: Time): Observable<any> {
		const url = `${BaseUrl}api/careplan/${Time.careplanId}/timeEntry`;
		return this.http.post<any>(url, Time).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	// getAllTimes() {
	// 	const url = `${BaseUrl}api/timeEntry`;
	// 	return this.http.get(url);
	// }

	getTimeById(TimeId: number) {
		if (!TimeId) {
			return of(null);
		}

		return this.http.get<Time>(API_TIMES_URL + `/${TimeId}`);
	}

	findTime(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + 'api/timeEntry', queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	findTimes(): Observable<any> {
		const data = {};
		return this.http.post<any>(BaseUrl + 'api/timeEntry', {}).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findBillableItemsTimes(): Observable<any> {
		return this.http.get<any>(BaseUrl + 'api/list/billableitems').pipe(
			mergeMap((response: any) => {
				return of(response);

			})
		);
	}

	findTimesDetails(timeEntryID: string) {
		const url = `${BaseUrl}api/timeEntry/${timeEntryID}`;
		return this.http.get(url).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	findStatementsPage(): Observable<any> {
		const data = {};
		return this.http.post<any>(BaseUrl + 'api/timeentry/mystatement/list', data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findStatementsViewPage(statementId: string): Observable<any> {
		return this.http.get<any>(BaseUrl + 'api/timeentry/' + statementId + '/mystatement').pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	deleteTime(TimeId) {
		const url = `${BaseUrl}api/timeentry/${TimeId}`;
		return this.http.delete(url);
	}

	updateTime(_Time: Time): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `${BaseUrl}api/careplan/${_Time.careplanId}/timeEntry/${_Time.id}`;
		return this.http.put(url, _Time).pipe(
			catchError(err => {
				return of(null);
			})
		);
	}

	// {lo}}careplan/46FE1942-F47A-4827-AFEB-C645029E31B0/timeEntry/67d5b640-326e-4f56-99bc-c00145cbad69

	generateSummaryPlan(Careplan) {
		const url = `${BaseUrl}api/patient/${Careplan.patientId}/careplan/${Careplan.id}/summaryreport`
		this.http.get(url, { responseType: 'blob' }).subscribe((res) => {
			this.saveData(res, 'Therapy Service Summamary.pdf');
		}, err => {
		})
	}

	generateInvoice(patientId) {
		//  /patient/{patientId}/invoice?format=pdf
		const url = `${BaseUrl}api/patient/${patientId}/invoice?format=pdf`
		this.http.get(url, { responseType: 'blob' }).subscribe((res) => {
			this.saveData(res, 'Invoice for patient.pdf');
		}, err => {
		})
	}

	sendInvoice(invoiceId) {
		const url = `${BaseUrl}api/invoice/${invoiceId}/email`;
		// return this.http.get<any>(url).pipe(
		// 	mergeMap((response:any) => {
		// 		return of(response);
		// 	})
		// );
		return this.http.post<any>(url, invoiceId).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getInvoice(id) {
		const url = `${BaseUrl}api/invoice/${id}`
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	findBillingType(): Observable<any> {
		const url = `${BaseUrl}api/list/billingType`;
		return this.http.get<any[]>(url).pipe(
			mergeMap(res => {
				// const result = this.httpUtils.baseFilter(res, queryParams, []);
				return of(res);
			})
		);
	}

	saveData(data, filename) {
		var a = document.createElement("a");
		document.body.appendChild(a);
		var json = data,
			blob = new Blob([json], { type: "octet/stream" }),
			url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	registerProvider(registrationData) {
		const url = `${BaseUrl}api/provider/registrationComplete`;
		return this.http.post<any>(url, registrationData).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	addressAutoSuggest(searchString) {
		const httpHeaders = new HttpHeaders();
		// httpHeaders.set('Access-Control-Allow-Origin', 'http://localhost:4200/');
		// httpHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
		// httpHeaders.set("Access-Control-Allow-Headers", "Authorization");
		const url = `https://dev.virtualearth.net/REST/v1/Autosuggest?query=${searchString}&includeEntityTypes=Address&countryFilter=AU&key=AmQIY_diE2SJ9WbHyni90fNy9bIIAtEKwFImQQ7MHxSOm61_L5AheC3COw9FwgcN&jsonp=JSONP_CALLBACK`;
		return this.http.jsonp(url, 'JSONP_CALLBACK').pipe(
			map((res: any) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}


	confirmEmail(code): Observable<any> {
		const data = {
			code: code
		}
		const url = `${BaseUrl}api/account/confirmemail`;
		return this.http.post(url, data)
			.pipe(
				map((res) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}

	// Profile
	createProfile(Profile: Profile): Observable<Profile> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `api/patient`;
		return this.http.post<Profile>(BaseUrl + url, Profile, { headers: httpHeaders });
	}


	findProfile(queryParams: QueryParamsModel): Observable<any> {
		const url = `${BaseUrl + API_LIST_CAREPLAN}`;
		return this.http.post<any[]>(url, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	// Server should return filtered/sorted result
	// findProfiles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

	// 	const url = BaseUrl + API_LIST_CAREPLAN;
	// 	return this.http.get<any>(url, {
	// 		headers: httpHeaders,
	// 		params:  httpParams
	// 	});
	// }

	// findProfiles(queryParams: QueryParamsModel): Observable<any> {
	// 	return this.getAllProfiles().pipe(
	// 		mergeMap((response: Profile[]) => {
	// 			const result = this.httpUtils.baseFilter(response, queryParams, []);
	// 			return of(response);
	// 		})
	// 	);
	// }

	// deleteProfile(Profile: Profile) {
	// 	const url = `${BaseUrl}api/patient/${Profile.patientId}/profile/${Profile.id}`;
	// 	return this.http.delete(url);
	// }

	// findAllergies(queryParams: QueryParamsModel, participant_id): Observable<any> {


	getProfileDetails() {
		const url = `${BaseUrl}api/myprofile`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateProfile(Profile: any): Observable<any> {
		const url = `${BaseUrl}api/myprofile`;
		return this.http.post(url, Profile).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}


	updatePassword(Profile: Password): Observable<any> {
		const url = `${BaseUrl}api/account/changepassword`;
		return this.http.post(url, Profile)
	}

	// getProviderDetails()  {
	// 	const httpHeaders = new HttpHeaders();
	// 	httpHeaders.set('Content-Type', 'application/json');
	// 	const url = `${BaseUrl}api/provider`; 
	// 	return this.http.get<any>(url, { headers: httpHeaders })
	// 	.pipe(
	// 		mergeMap((response:any) => {
	// 			console.log('Response:', response);
	// 			return of(response);
	// 		})
	// 	);
	// }	

	listTeamUsers(): Observable<any> {
		const url = `${BaseUrl}api/team/list/users`;
		return this.http.get<any>(url, {}).pipe(
			map((res) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}

	loadTherapistAppointments(params): Observable<any> {
		const url = `${BaseUrl}api/appointment/list/gridview`;
		return this.http.post<any>(url, params).pipe(
			map((res) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}

	// Company API

	createCompany(company: Company): Observable<Company> {
		return this.http.post<Company>(BaseUrl + API_CREATE_PATIENT, company).pipe(
			mergeMap(response => {
				return of(response);
			})
		);
	}

	findCompany(queryParams: QueryParamsModel): Observable<any> {
		// This code imitates server calls
		return this.http.post<any[]>(BaseUrl + API_COMPANYS_URL, queryParams).pipe(
			mergeMap(res => {
				var value: any = res;
				const result = this.httpUtils.baseFilter(value.data, queryParams, []);
				return of(result);
			})
		);
	}

	findCompanys(queryParams: QueryParamsModel): Observable<any> {
		return this.getAllCompanys().pipe(
			mergeMap((response: any) => {
				const result = this.httpUtils.baseFilter(response.data, queryParams, []);
				return of(result);
			})
		);
	}

	getAllCompanys(): Observable<Company[]> {
		const data = {};
		return this.http.post<Company[]>(BaseUrl + API_COMPANYS_URL, data);
	}


	getCompanyEditList() {
		const url = `${BaseUrl}api/provider`;
		return this.http.get<Company>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getCompanysProfile() {
		const url = `${BaseUrl}api/patient/myprofile`;
		return this.http.get<Company>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	getCompanyEditForParticular(company: any): Observable<any> {
		if (!company) {
			return of(null);
		}
		const url = `${BaseUrl}api/provider`;
		return this.http.post<any>(url, company).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	updateCompany(_company: any): Observable<any> {
		const url = `${BaseUrl}api/provider/update`;
		return this.http.post(url, _company).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteCompany(companyId) {
		const url = `${BaseUrl}api/patient/${companyId}`;
		return this.http.delete(url);
	}


	eventsTimeline(param): Observable<any> {
		const url = `${BaseUrl}api/appointment/list/timelineview`;
		return this.http.post<any>(url, param).pipe(
			map((res) => {
				return res;
			}),
			catchError(err => {
				return null;
			})
		);
	}

	uploadProfileImage(image: any): Observable<any> {
		const url = `${BaseUrl}api/upload/profile`;
		return this.http.post<any>(url, image).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	uploadCompanyLogo(image: any): Observable<any> {
		const url = `${BaseUrl}api/upload/businessprofile`;
		return this.http.post<any>(url, image).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	listAppointmentType(): Observable<any> {
		return this.http.get(`${BaseUrl}api/list/appointmentType`);
	}

	getAppointmentDetails(id) {
		return this.http.get(`${BaseUrl}api/appointment/${id}/details`).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	createInvoiceFromAppointment(id) {
		const data = {
			appointmentId: id
		}
		return this.http.post(`${BaseUrl}api/invoice`, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	createInvoiceFromTimeentry(id) {
		const data = {
			timeentryId: id
		}
		return this.http.post(`${BaseUrl}api/invoice`, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteBillableItemOfTimeEntries(timeEntry, billableItem) {
		const url = `${BaseUrl}api/timeentry/${timeEntry.id}/billableItem/${billableItem.id}`;
		return this.http.delete(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	downloadUserFile(file: any): Observable<any> {
		const url = `${BaseUrl}api/download/userFile`;
		return this.http.get<any>(url).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);
	}

	deleteUserFile(file: any): Observable<any> {
		const url = `${BaseUrl}api/download/userFile`;
		return this.http.delete(url);
	}

	addInternalNote(id,data){
		const url = `${BaseUrl}api/appointment/${id}/action`;
		return this.http.post(url, data).pipe(
			mergeMap((response: any) => {
				return of(response);
			})
		);

	}

	getPatientAddressList(participantId){
		const url = `${BaseUrl}api/list/addresstype/${participantId}`;
		return this.http.get<any>(url);
	}

}
