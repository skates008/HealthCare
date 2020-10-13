import {
	Component, OnInit, ChangeDetectionStrategy, ElementRef,
	ChangeDetectorRef, OnDestroy, Query, ViewChild
} from '@angular/core';

import { Profile, ProfileUpdated, selectIsProfileCreateSuccess, ProviderAccount, Provider, ProviderBilling } from './../../../core/auth';
import { Store, select } from '@ngrx/store';
import { AuthService, CompanyService } from './../../../core/_services';
import { AppState } from './../../../core/reducers';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsModel } from './../../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { MatDatepicker, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { Update } from '@ngrx/entity';
import { CommunicationService } from '../communication.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
	selector: 'kt-provider-billingSetting',
	templateUrl: './provider-billingSetting.component.html',
	styleUrls: ['./provider-billingSetting.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderbillingSettingComponent implements OnInit {
	@ViewChild('paginator', { static: true }) paginator: MatPaginator;
	@ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

	loading$: Observable<boolean>;
	profile: ProviderBilling;
	private subscriptions: Subscription[] = [];
	profileForm: FormGroup;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasFormErrors: boolean = false;
	showBillingFields: boolean = false;
	htmlContent = '';
	action: string = "billing" ;

	constructor(
		private store: Store<AppState>,
		private router: Router,
		private subheaderService: SubheaderService,
		private profileFB: FormBuilder,
		private auth: AuthService,
		private companyService: CompanyService,
		private communicationService: CommunicationService,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
	) {

	}

	editorConfig: AngularEditorConfig = {
		editable: true,
		  spellcheck: true,
		  height: 'auto',
		  minHeight: '200',
		  maxHeight: 'auto',
		  width: 'auto',
		  minWidth: '0',
		  translate: 'yes',
		  enableToolbar: false,
		  showToolbar: true,
		  placeholder: 'Enter payment details',
		  defaultParagraphSeparator: '',
		  defaultFontName: '',
		  defaultFontSize: '',
		  fonts: [
			{class: 'arial', name: 'Arial'},
			{class: 'times-new-roman', name: 'Times New Roman'},
			{class: 'calibri', name: 'Calibri'},
			{class: 'comic-sans-ms', name: 'Comic Sans MS'}
		  ],
		  customClasses: [
		  {
			name: 'quote',
			class: 'quote',
		  },
		  {
			name: 'redText',
			class: 'redText'
		  },
		  {
			name: 'titleText',
			class: 'titleText',
			tag: 'h1',
		  },
		],
		toolbarHiddenButtons: [
		  ['bold', 'italic'],
		  ['fontSize']
		]
	};

	ngOnInit() {
		this.profile = new ProviderBilling();
		this.createForm();

		this.companyService.getCompanyEditList().subscribe(res=>{
			if (res.data) {
				this.profile = res.data.billingSettings;
				this.profileForm.patchValue(this.profile);
				this.initProfile();
				}
		})
	}

	initProfile() {
		this.subheaderService.setTitle('Provider');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Billing/Invoice' }
		]);
	}

	createForm() {
		this.profileForm = this.profileFB.group({
			billingCycle: ['', Validators.required],
			billingDayOfMonth: [''],
			billingDayOfWeek: [''],
			billingTimeOfDay: ['', Validators.required],
			billingWeekCycle: [''],

			invoicePaymentText: [''],
			invoiceReferenceFormat: [''],
			paymentDueInDays: ['']
		})
	}

	isBillingSelected(index, value) {
		this.showBillingFields = value;
	}

	prepareProfile(): ProviderBilling {
		const controls = this.profileForm.controls;

		const billingDetails = new ProviderBilling();
		billingDetails.clear();
		billingDetails.billingCycle = controls['billingCycle'].value;
		billingDetails.billingDayOfMonth = controls['billingDayOfMonth'].value;
		billingDetails.billingDayOfWeek = controls['billingDayOfWeek'].value;
		billingDetails.billingTimeOfDay = controls['billingTimeOfDay'].value;
		billingDetails.billingWeekCycle = controls['billingWeekCycle'].value;

		billingDetails.invoicePaymentText = controls['invoicePaymentText'].value;
		billingDetails.invoiceReferenceFormat = controls['invoiceReferenceFormat'].value;
		billingDetails.paymentDueInDays = controls['paymentDueInDays'].value;
		// billingDetails.action = this.action;

		const value: any =
			{
				"action": this.action,
				"billingSettings": billingDetails
			}

		return value;
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.profileForm.controls;
		if (!this.profileForm.valid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}

		const editedProfile = this.prepareProfile();
		this.updateProfile(editedProfile, withBack);
		return;
	}

	updateProfile(_profile: ProviderBilling, withBack: boolean = false) {
		this.companyService.updateCompany(_profile).subscribe(res => {
			if(res.success){
				const message = `Billing Setting changes have been saved`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
		})


		// const addSubscription = this.store.pipe(select(selectIsProfileCreateSuccess)).subscribe(success => {
		// 	console.log('Status:', success);
		// 	if(!success){
		// 		return;
		// 	} else {
		// 		this.communicationService.emitChange()
		// 		const message = `Profile changes have been saved`;
		// 		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		// 	}
		// });
		// this.subscriptions.push(addSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}


	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

}
