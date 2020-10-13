// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// RxJS
import { Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
// Lodash
import { filter, some, each } from 'lodash';
// Environment
import { environment } from '../../../environments/environment';
// CRUD
import { QueryParamsModel, QueryResultsModel, HttpUtilsService } from '../_base/crud';
// Models
import { Permission } from '../auth/_models/permission.model';
import { Role } from '../auth/_models/role.model';
import { User } from '../auth/_models/user.model';


const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

const BaseUrl = environment.BaseURL;


@Injectable()
export class RolesAndPermissionService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
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

	// READ
	getAllUsers(): Observable<User[]> {
		const url = `${BaseUrl}api/usermanagement/user/list`;
		const data = {};
		return this.http.post<User[]>(url, data);
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
}
