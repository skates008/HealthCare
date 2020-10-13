// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { currentUser } from '../../../../core/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-header-mobile',
	templateUrl: './header-mobile.component.html',
	styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
	// Public properties
	headerLogo: string;
	asideDisplay: boolean;
	currentRouteUrl: any = '';
	loggedInUser: any;
	item;

	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-header__topbar--mobile-on',
		togglerState: 'kt-header-mobile__toolbar-topbar-toggler--active'
	};

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(
		private layoutConfigService: LayoutConfigService,
		private store: Store<AppState>,
		private router: Router, ) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.headerLogo = this.layoutConfigService.getLogo();
		this.asideDisplay = this.layoutConfigService.getConfig('aside.self.display');
	}


	goToHome() {
		this.store.pipe(
			select(currentUser)
		).subscribe((response) => {
			this.loggedInUser = response;
		
			switch (response.role) {
				case 'Owner':
				case 'Manager':
						this.router.navigate(['../' + 'provider-dashboard']);
					break;
					
				case 'User':
						this.router.navigate(['../' + 'therapist-dashboard']);
					break;

				case 'Client':
						this.router.navigateByUrl('../' + 'dashboard');
					break;
				default:
					this.router.navigateByUrl('error/403');
					break;
			}

			// if (this.loggedInUser.username === 'admin') {
			// 	this.router.navigate(['/' + 'therapist-dashboard']);
			// 	this.item.page = '/therapist-dashboard';
			// }
			// else {
			// 	this.router.navigate(['/' + 'dashboard']);
			// 	this.item.page = '/dashboard';
			// }
		});
	}

}
