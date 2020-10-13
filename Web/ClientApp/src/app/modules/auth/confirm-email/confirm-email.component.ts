import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../core/auth';

@Component({
  selector: 'kt-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  confirmEmailSuccess: boolean;
  confirmEmailText: string = "Confirm Email";

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router,

  ) { 
  }

    ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
        const code = params['code'];
        this.auth.confirmEmail(code).subscribe(res=>{
          if(res.success){
            this.confirmEmailText = "Your account has been verified!" ;
          }else{
            this.confirmEmailText = "Invalid Token!";

          }
        })
      })
    } 
}
