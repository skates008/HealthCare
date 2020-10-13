// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// NGRX
import { select, Store } from '@ngrx/store';
// Module reducers and selectors
import { AppState } from '../../../core/reducers/';
import { currentUser } from '../_selectors/auth.selectors';
import { AuthService } from '../../../core/_services';

@Injectable()
export class ModuleGuard implements CanActivate {
	loggedInUser;
	value: boolean = false;
	isRegistrationComplete: boolean;

	constructor(private store: Store<AppState>, private auth: AuthService, private router: Router) {
		// this.loadisRegisterComplete();
		}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		const moduleName = route.data.moduleName as string;
		// if (!moduleName) {
		//     return of(false);
		// }

		const res = await this.loadisRegisterComplete();
		const obj: any = res;
		this.isRegistrationComplete = obj.data;

		this.store.pipe(select(currentUser)).subscribe((response) => {
				this.loggedInUser = response;
				if (this.isRegistrationComplete) {
					return this.value = true;
				} else {
					this.goToWelcome(this.loggedInUser);
					return this.value = false;
				}
			});

		return this.value;
	}

	loadisRegisterComplete() {
		return this.auth.getIsRegistered().toPromise();
	}

	goToWelcome(value) {
			switch (value.role) {
				case 'Owner':
				case 'Manager':
						this.router.navigate(['../' + 'welcomeProvider']);
					 break;

					case 'User':
						this.router.navigate(['../' + 'welcomeTherapist']);
					 break;

				case 'Client':
						this.router.navigateByUrl('../' + 'welcome');
					 break;
				default:
					this.router.navigateByUrl('error/403');
					break;
			}
	}
}
