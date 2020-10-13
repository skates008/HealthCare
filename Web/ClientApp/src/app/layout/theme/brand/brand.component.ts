// Angular
import { AfterViewInit, Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { currentUser } from '../../../core/auth';

@Component({
	selector: 'kt-brand',
	templateUrl: './brand.component.html',
})
export class BrandComponent implements OnInit {
	// Public properties
	headerLogo: string;
	headerStickyLogo: string;
	loggedInUser: any;

	toggleOptions: ToggleOptions = {
		target: 'body',
		targetState: 'kt-aside--minimize',
		togglerState: 'kt-aside__brand-aside-toggler--active'
	};

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 * @param htmlClassService: HtmlClassService
	 */
	constructor(
		private layoutConfigService: LayoutConfigService, 
		private router: Router, 
		private store: Store<AppState>,
		public htmlClassService: HtmlClassService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.headerLogo = this.layoutConfigService.getLogo();
		this.headerStickyLogo = this.layoutConfigService.getStickyLogo();
	}

	goToHome() {
		this.store.pipe(
			select(currentUser)
		).subscribe((response) => {
			this.loggedInUser = response;
		
			switch (this.loggedInUser.role) {
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
		});
	}
}
