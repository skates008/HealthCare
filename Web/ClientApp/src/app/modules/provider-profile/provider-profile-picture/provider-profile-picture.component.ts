// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Observable, of, Subscription} from 'rxjs';
// Lodash
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from './../../../core/reducers';
// Services and Models
import {
	User,
	Permission,
	selectUserById,
	selectAllPermissions,
	AuthService,
	RolesListRequested,
	selectRolesInStore,
} from './../../../core/auth';
import { delay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CommunicationService } from '../communication.service';
import { LayoutUtilsService, MessageType } from './../../../core/_base/crud';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'kt-provider-profile-picture',
	templateUrl: './provider-profile-picture.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfilePictureDialogComponent implements OnInit, OnDestroy {
	// Public properties
	fileData: File = null;
	previewUrl:any = null;
	fileUploadProgress: string = null;
	uploadedFilePath: string = null;
	// Private properties
	private componentSubscriptions: Subscription;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	hasButtonDisable: boolean = true;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ProfilePictureDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<ProfilePictureDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private auth: AuthService,
		private router: Router,
		private toastr: ToastrService,
		private communicationService: CommunicationService,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

 
fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
}
 
preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
		this.hasButtonDisable = true;
		const message = `Please upload image file`;
		this.toastr.error(message, 'Error', {
			timeOut: 3000
		  });
      	return;
	// } else {
	// 	if (this.fileData[0].size < 200 * 200) {
	// 		console.log('check height and width');
	// 	}
    //   if (this.fileData[0].size < 2000000) {
	// 	  // checking size here - 2MB}
	// 	  console.log('check 2 mb');
	//   }
	}

 
	this.hasButtonDisable = false;
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}
 
onSubmit() {
    const formData = new FormData();
	 formData.append('file', this.fileData);
	  this.auth.uploadProfileImage(formData).subscribe(res => {
		if(res.success){
			this.communicationService.emitChange();
			this.dialogRef.close();
			const message = `Profile image have been saved`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Update, 3000, true, true);
		} else {
			const message = `Sorry ! Something went wrong.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Delete, 3000, true, true);
		}
	})
    //   this.http.post('url/to/your/api', formData)
    //     .subscribe(res => {
    //       console.log(res);
    //       this.uploadedFilePath = res.data.filePath;
    //       alert('SUCCESS !!');
    //     })
}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
			// tslint:disable-next-line:no-string-throw
			return `Change profile picture`;
	}

}
