import { Component, OnInit } from '@angular/core';

import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../../core/reducers';
import { Setting, SettingUpdated, SettingPageRequested, selectQueryResultSetting } from './../../../core/auth';
import { QueryParamsModel } from './../../../core/_base/crud';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';

@Component({
  selector: 'kt-duration',
  templateUrl: './duration.component.html'
})
export class DurationsComponent implements OnInit {

  constructor(private store: Store<AppState>, private layoutUtilsService: LayoutUtilsService,
  ) { }
  setting: Setting;
  segmentedhour: number;
  timeinNumber: number;
  settingDetails: any;

  ngOnInit() {
	this.setting = new Setting;
	this.setting.standardAppointmentTime = '';
	this.loadSettings();
  }

  onSubmit(setting) {
	if (!this.setting.standardAppointmentTime) {
		return;
	}
	// this.setting.standardAppointmentTime == "1 hour" ? this.setting.standardAppointmentTime = "60 minutes" : this.setting.standardAppointmentTime;
	this.timeinNumber = parseInt(this.setting.standardAppointmentTime.split(' ')[0]);
	for (let i = 1; i <= 6; i++) {
		if (this.timeinNumber == 60 / i) {
		this.segmentedhour = i;
		}
	}
	const prepareSetting = this.prepareSetting(this.settingDetails);
	this.updateSetting(prepareSetting);
  }

  loadSettings() {
	const queryParams = new QueryParamsModel(
		this.filterConfiguration(),
	);
	this.store.dispatch(new SettingPageRequested({ page: queryParams, user_id: 1 }));
	this.store.pipe(select(selectQueryResultSetting)).subscribe(res => {
		if (res.total == 0) {
		return;
		}
		this.settingDetails = res.data[0];
		this.segmentedhour = this.settingDetails.hoursegment;

	});
  }

  prepareSetting(_setting) {
	const setting = new Setting;
	setting.id = _setting.id;
	setting.userId = _setting.userId;
	setting.standardAppointmentTime = this.setting.standardAppointmentTime;
	setting.hoursegment = this.segmentedhour;
	return setting;
  }

  updateSetting(_setting) {
	const updatedSetting: Update<Setting> = {
		id: _setting.id,
		changes: _setting
	}
	this.store.dispatch(new SettingUpdated({
		partialSetting: updatedSetting,
		setting: _setting
	}));
	const message = `Changes have been saved`;
	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
	const filter: any = {};
	return filter;
  }



}
