// Angular
import {Injectable} from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';

// RxJS
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
// toaster
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
	constructor(private toastr : ToastrService, private router : Router,) {}

	// intercept request and add token
	intercept(request : HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>> {
		if(request.url.indexOf('api/account/login') === -1) {
			const userData = localStorage.getItem('user_data');
			if (userData) {
				const userToken = JSON.parse(userData).user_details.accessToken;
				request = request.clone({
					setHeaders: {
						'Authorization': "Bearer" + " " + userToken,
						// 'Access-Control-Allow-Headers': '*'
					}
				});
			}
		}

		return next.handle(request).pipe(map((event : HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				// this.errorDialogService.openDialog(event);
			}
			return event;
		}), catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				// redirect logout
				localStorage.removeItem('user_data');
				this.router.navigate(['/auth/login']);
				// this.toastr.error("Your Session has expired!", 'Error', {
				// 	timeOut: 3000
				// });
			} else {
				if (error.error !== undefined) {
					const errorMessage = error && error.error && error.error.errorMessages && error.error.errorMessages[0] || 'Something Went Wrong'
					if (!error['success']) {
						this.toastr.error(errorMessage, 'Error', {timeOut: 3000});
						return throwError(error);
					}
				}
			}
			return throwError(error);

		}));

		// return next.handle(request).pipe(
		//     tap((event: HttpEvent<any>) => {
		//         if (event instanceof HttpResponse) {
		//             console.log('event--->>>', event);
		//         }
		//         return event;
		// 	})

		// 	);

		// return next.handle(request).pipe(
		// 	tap(
		// 		event => {
		// 			if (event instanceof HttpResponse) {
		// 			  console.log('all looks good');
		// 			  http response status code
		// 			}
		// 		},
		// 		error => {
		// 			this.toastr.error(error.error.errorMessages[0], 'Error', {
		// 				timeOut: 3000
		// 			});
		// 		  console.log('--- end of response---');
		// 		}
		// 	)
		// );
	}
}
