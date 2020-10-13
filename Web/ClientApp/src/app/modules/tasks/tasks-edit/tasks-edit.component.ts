import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgModule, OnDestroy, Inject, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

// Services and Models
import {
	Task,
	TaskUpdated,
	selectTaskById,
	TaskOnServerCreated,
	selectTasksActionLoading,
	Notification,
	selectTaskCreatedSuccess
} from './../../../core/auth';
import { AppState } from './../../../core/reducers';
import { SubheaderService, LayoutConfigService } from './../../../core/_base/layout';
import { LayoutUtilsService, MessageType, QueryParamsModel } from './../../../core/_base/crud';

import { MatDatepicker, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {
	MAT_MOMENT_DATE_FORMATS,
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';


@Component({
	selector: 'kt-tasks-edit',
	templateUrl: './tasks-edit.component.html',
	styleUrls: ['./tasks-edit.component.scss'],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' },
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
	],
})
export class TasksEditComponent implements OnInit, OnDestroy {

	@ViewChild('picker', { static: true }) datePicker: MatDatepicker<Date>;
	@ViewChild('wizard', { static: true }) el: ElementRef;
	@ViewChild('stages', { static: true }) ele: ElementRef;

	minDate: Date;
	maxDate: Date;

	task: Task;
	taskId$: Observable<number>;
	oldTask: Task;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	taskForm: FormGroup;
	hasFormErrors: boolean = false;
	private subscriptions: Subscription[] = [];
	appointmentDetails: object;
	participantList: any;
	resetButton: boolean = true;
	@Output() onItemAdd: EventEmitter<any> = new EventEmitter<any>();

	constructor(private activatedRoute: ActivatedRoute,
		public dialog: MatDialog,
		private router: Router,
		private taskFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private _location: Location,
		private layoutConfigService: LayoutConfigService) {
		if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
			this.appointmentDetails = this.router.getCurrentNavigation().extras.state;
		}

		  // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
		  const currentYear = new Date().getFullYear();
		  this.minDate = new Date();
		  this.maxDate = new Date(currentYear + 2, 11, 31);
	}

	ngOnInit() {
		this.loading$ = this.store.pipe(select(selectTasksActionLoading));
		this.task = new Task();
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id) {
				this.store.pipe(select(selectTaskById(id))).subscribe(res => {
					if (res) {
						this.task = res;
						this.oldTask = Object.assign({}, this.task);
						this.initTask();
						this.resetButton = true;
					}
				});
			} else {
				this.task.clear();
				this.oldTask = Object.assign({}, this.task);
				this.initTask();
				this.resetButton = false;
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	// get total calc. value
	getTotal(selectedItem, index) {
		if (this.taskForm && this.taskForm.controls && selectedItem && selectedItem.taxRate && selectedItem.unitPrice && selectedItem.quantity) {
			const total: number = selectedItem.quantity * selectedItem.unitPrice * (1 - ((selectedItem.discount || 0) / 100)) * (1 + (selectedItem.taxRate / 100));
			const values = this.taskForm.value.taskItem;
			values.splice(index, 1, { ...selectedItem, itemTotal: total });
			this.taskForm.controls['taskItem'].setValue(values, { emitEvent: false });
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	initTask() {
		this.createForm(this.appointmentDetails);
		if (!this.task.id) {
			this.subheaderService.setTitle('Create Task');
			return;
		}
		this.subheaderService.setTitle('Edit Task');
	}

	createForm(appointmentDetails) {
		this.taskForm = this.taskFB.group({
			issueDate: [this.task.issueDate],
			dueDate: [this.task.dueDate],
			title: [this.task.title],
			status: [this.task.status],
			description: [this.task.description]
		})
		this.onChanges();
	}

	onChanges(): void {
		this.taskForm.valueChanges.subscribe(val => {
			val.taskItem && val.taskItem.length && val.taskItem.map((item, index) => this.getTotal(item, index));
		});

	}

	// add task Item
	addTaskItem() {
		let taskFormArray = this.taskForm.controls.taskItem as FormArray;
		let arraylen = taskFormArray.length;

		let newTaskFormGroup: FormGroup = this.taskFB.group({
			item: [],
			quantity: [, Validators.min(1)],
			unitPrice: [, Validators.min(0)],
			type: [],
			serialNo: [],
			supplier: [],
			costPrice: [, Validators.min(1)],
			discount: [, Validators.min(0)],
			code: [],
			itemTotal: [, Validators.min(1)]
		})
		taskFormArray.insert(arraylen, newTaskFormGroup);
	}


	goBackWithId() {
		// const url = `/tasks/tasks`;
		// this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
		this.back();
	}

	refreshTask(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/tasks/tasks/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	reset() {
		this.task = Object.assign({}, this.oldTask);
		this.createForm("reset");
		this.hasFormErrors = false;
		this.taskForm.markAsPristine();
		this.taskForm.markAsUntouched();
		this.taskForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.taskForm.controls;
		if (this.taskForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedTask = this.prepareTask();

		if (editedTask.id) {
			this.updateTask(editedTask, withBack);
			return;
		}

		this.addTask(editedTask, withBack);
	}

	prepareTask(): Task {
		const controls = this.taskForm.controls;
		const _task = new Task();
		_task.clear();
		_task.description = controls['description'].value;
		_task.dueDate = controls['dueDate'].value;
		_task.status = controls['status'].value;
		_task.id = this.task.id;
		_task.issueDate = new Date();
		_task.title = controls['title'].value;
		return _task;
	}

	prepareNotification() {
		const _notification = new Notification();
		_notification.clear();
		_notification.id = undefined;
		_notification.notify = "therapist";
		_notification.type = "task";
		_notification.message = this.taskForm.controls['title'].value;
		_notification.taskId = 1111;
		_notification.read = false;
		_notification.time = new Date();
		return _notification;
	}

	addTask(_task: Task, withBack: boolean = false) {
		this.store.dispatch(new TaskOnServerCreated({ task: _task }));
		const addSubscription = this.store.pipe(select(selectTaskCreatedSuccess)).subscribe(success => {
			if(success){
			const message = `New task successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
			this.goBackWithId();
		}
		});
		this.subscriptions.push(addSubscription);
	}

	updateTask(_task: Task, withBack: boolean = false) {
		const updatedTask: Update<Task> = {
			id: _task.id,
			changes: _task
		};

		this.store.dispatch(new TaskUpdated({
			partialTask: updatedTask,
			task: _task
		}));
		this.store.pipe(select(selectTaskCreatedSuccess)).subscribe(success => {
			if(success){
		const message = `Task changes have been saved`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
		this.goBackWithId();
	   }});
	}

	getComponentTitle() {
		let result = 'Create Task';
		if (!this.task || !this.task.id) {
			return result;
		}

		result = `Edit ${this.task.title}`;
		return result;
	}

	editTask(id) {
		this.router.navigate(['../tasks/edit', id], { relativeTo: this.activatedRoute });
	}

	/** Alect Close event */
	onAlertClose(any) {
		this.hasFormErrors = false;
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	back() {
		this._location.back();
	}
}
