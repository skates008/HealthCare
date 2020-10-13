// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { Store } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// CRUD
import { TypesUtilsService, LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
// Services and Models
import {
	AppointmentType,
	AppointmentTypeFileDeleted
} from '../../../../core/auth';
import { AppointmentTypeService } from '../../../../core/_services';
import moment from 'moment';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-provider-appointment-edit-dialog',
	templateUrl: './provider-appointment-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ProviderAppointmentEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	appointmentType: AppointmentType;
	appointmentTypeForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	appointmentTypeId;
	participantId;
	// Private properties
	private componentSubscriptions: Subscription;
	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ProviderAppointmentEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(
		public dialogRef: MatDialogRef<ProviderAppointmentEditDialogComponent>,
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
		this.appointmentTypeForm = this.fb.group({
			name: ['', Validators.required],
			isBillable: ['', Validators.required],
		});

		this.appointmentTypeId = this.data.appointment.id;

		this.loadAppointmentTypeDetails();

	}

	loadAppointmentTypeDetails() {
		// called service directly coze store was causing some issue with loading data.
		this.service.getAppointmentTypeById(this.appointmentTypeId).subscribe(res => {
			if (res.success) {
				this.appointmentType = res.data;
				this.appointmentTypeForm.patchValue({
					id: this.appointmentType.id,
					name: this.appointmentType.name,
					isBillable: this.appointmentType.isBillable,
				});
				this.createForm(this.appointmentType);
			}
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm(note) {
		this.appointmentTypeForm = this.fb.group({
			id: [''],
			name: [note.name, Validators.required],
			isBillable: [note.isBillable, Validators.required],
		});
	}

	/**
	 * Returns page name
	 */
	getTitle(): string {
			return `Edit Appointment Type`;
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
		appointmentType.id = this.appointmentTypeId;
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
		this.updateAppointmentType(addAppointmentType, this.appointmentTypeId);

	}

	/**
	 * Update appointmentType
	 *
	 * @param _appointmentType: AppointmentTypeModel
	 */
	updateAppointmentType(appointmentType, appointmentTypeId) {
		this.service.updateAppointmentType(appointmentType, appointmentTypeId).subscribe(res => {
			if (res.success) {
				const message = `AppointmentType has been successfully updated.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
			}
			this.dialogRef.close({ appointmentType, isEdit: false });
		});
	}


	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
