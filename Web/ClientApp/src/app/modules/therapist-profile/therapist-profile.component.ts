import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from './../../core/reducers';
import { selectUserById, User, UsersPageRequested } from './../../core/auth';
import { QueryParamsModel } from './../../core/_base/crud';
// CRUD

@Component({
  selector: 'kt-therapist-profile',
  templateUrl: './therapist-profile.component.html',
  styleUrls: ['./therapist-profile.component.scss']
})
export class TherapistProfileComponent implements OnInit {

  user: User;
  loading$: any;

  constructor(private store: Store<AppState>, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loadUserDetails();
  }
  loadUserDetails() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
    );
    this.store.dispatch(new UsersPageRequested({ page: queryParams }));
    this.store.pipe(select(selectUserById(1))).subscribe(res => {
      if (res) {
        this.user = res;
        // this.rolesSubject.next(this.user.roles);
        // this.addressSubject.next(this.user.address);
        // this.soicialNetworksSubject.next(this.user.socialNetworks);
        // this.oldUser = Object.assign({}, this.user);
        // this.initUser();
      }
    });
  }

  editTherapist(id) {
    this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
  }
  filterConfiguration(): any {
    const filter: any = {};
    return filter;
  }

}
