import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AuthPageType,
  IResetPassword,
} from 'src/app/core/model/auth-page.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { APIStatusMessage } from 'src/app/shared/model/basic-api.model';
import {
  ICustomFormBody,
  IFormControlBody,
} from 'src/app/shared/model/form.model';
import { FormsService } from 'src/app/shared/service/forms.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  newPass = '';
  reEnterPass = '';
  token = '';
  customFormBody!: ICustomFormBody;

  authPageType = AuthPageType;
  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formService: FormsService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.activatedRoute.params.subscribe((param) => {
      this.token = param['token'];
    });
  }

  ngOnInit(): void {
    this.setCustomFormConfig(
      this.resetConfig,
      this.authPageType.ResetPasswordMessage,
      [this.authPageType.ResetPassword]
    );
    this.subscriptions.add(
      this.formService.formData$.subscribe({
        next: (res: IResetPassword) => {
          if (res) {
            if (res.password !== res.reEnterPassword) {
              const config: MatSnackBarConfig = {
                duration: 5 * 1000,
              };
              this._snackBar.open("Passwords did not match",'',config);
            }else{
              this.resetPassword(res.password);
            }
          }
        },
      })
    );
  }

  private get resetConfig(): IFormControlBody[] {
    return [
      {
        controlLabel: 'Password',
        controlName: 'password',
        controlType: 'password',
        controlValidation: { required: true, newPassword: true },
      },
      {
        controlLabel: 'Re-Password',
        controlName: 'reEnterPassword',
        controlType: 'password',
        controlValidation: { required: true, newPassword: true },
      },
    ];
  }

  private setCustomFormConfig(
    controls: IFormControlBody[],
    formName: string,
    btnActions: string[]
  ) {
    this.customFormBody = {
      controls: controls,
      formName: formName,
      btnNames: btnActions,
    };
  }

  resetPassword(password: string) {
    this.authService.resetPassword(this.token, password).subscribe({
      next: (res) => {
        if (res.Status === APIStatusMessage.Success) {
          const config: MatSnackBarConfig = {
            duration: 5 * 1000,
          };
          this._snackBar.open(res.Message,'',config);
          this.router.navigateByUrl('/auth/login');
        }
      },
      error: (err) => {
        console.log(err)
      } 
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
