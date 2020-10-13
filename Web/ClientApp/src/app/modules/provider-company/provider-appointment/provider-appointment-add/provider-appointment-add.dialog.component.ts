// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialogRef,
	MAT_DIALOG_DATA,
	MatDatepicker } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// CRUD
import { TypesUtilsService, LayoutUtilsService } from '../../../../core/_base/crud';
// Services and Models
import {
	AppointmentType,
	AppointmentTypeOnServerCreated,
	selectAppointmentTypeActionLoading,
	selectAppointmentTypeIsSuccess,
} from '../../../../core/auth';
import { AppointmentTypeService } from '../../../../core/_services';

@Component({
	selector: 'kt-provider-appointment-add-dialog',
	templateUrl: './provider-appointment-add.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class ProviderAppointmentAddDialogComponent implements OnInit, OnDestroy {
	// Public properties
	appointmentType: AppointmentType;
	appointmentTypeForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	participantId;
	// Private properties
	private componentSubscriptions: Subscription;
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;


	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ProviderAppointmentDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<ProviderAppointmentAddDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private service: AppointmentTypeService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService) {
	}


	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.store.pipe(select(selectAppointmentTypeActionLoading)).subscribe(res => this.viewLoading = res);
		this.createForm();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm() {
		this.appointmentTypeForm = this.fb.group({
			name: ['', Validators.required],
			isBillable: ['', Validators.required],
		});
	}

	/**
	 * Returns page name
	 */
	getTitle(): string {
		return 'Add New Appointment Type';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.appointmentTypeForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared appointmentType
	 */
	prepareAppointmentType(): any {
		const controls = this.appointmentTypeForm.controls;
		const appointmentType = new AppointmentType();
		appointmentType.name = controls.name.value;
		appointmentType.isBillable = controls.isBillable.value;
		return appointmentType;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.appointmentTypeForm.controls;
		/** check form */
		if (this.appointmentTypeForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const addAppointmentType = this.prepareAppointmentType();
		this.createAppointmentType(addAppointmentType);

	}

	/**
	 * Create appointmentType
	 *
	 * @param _appointmentType: AppointmentTypeModel
	 */
	createAppointmentType(data) {
		this.store.dispatch(new AppointmentTypeOnServerCreated({ appointmentType: data}));
		this.componentSubscriptions = this.store.pipe(
			select(selectAppointmentTypeIsSuccess),
		).subscribe(success => {
			if (!success) {
				return;
			}

			this.dialogRef.close({ data, isEdit: false });
		});
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
