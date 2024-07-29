import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICustomFormBody,
  IFormControlBody,
} from 'src/app/shared/model/form.model';
import { AuthPageType, ICreateUser, ILoginUser } from '../../../core/model/auth-page.model';
import { FormsService } from 'src/app/shared/service/forms.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { APIStatusMessage, IAPIResponse } from 'src/app/shared/model/basic-api.model';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
//TODO: Refactor the whole component
export class AuthPageComponent implements OnInit, OnDestroy {
  public customFormBody!: ICustomFormBody;
  public authPageType = AuthPageType;
  private subscriptions = new Subscription();
  private currentRoute = '';
  public runFunction!: Function;

  functionMap: { [key: string]: Function } = {
    login: (param: any) => this.login(param),
    register: (param: any) => this.register(param),
    reset: (param: any) => this.reset(param),
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private formService: FormsService,
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.checkAndSetCustomFormConfig();
    this.subscriptions.add(
      this.formService.formData$.subscribe({
        next: (res : ILoginUser | ICreateUser) => {
          if(res){
            if (this.runFunction) this.runFunction(res);  
          }
        },
      })
    );
  }

  private checkAndSetCustomFormConfig() {
    this.activatedRoute.params.subscribe((param) => {
      this.currentRoute = param['authType'];
      this.runFunction = this.functionMap[this.currentRoute];
      switch (this.currentRoute) {
        case 'login':
          this.setCustomFormConfig(
            this.loginConfig,
            this.authPageType.LoginMessage,
            [this.authPageType.Login]
          );

          break;
        case 'register':
          this.setCustomFormConfig(
            this.registerConfig,
            this.authPageType.RegisterMessage,
            [this.authPageType.Register]
          );
          break;
        case 'reset':
          this.setCustomFormConfig(
            this.resetPassConfig,
            this.authPageType.ResetPasswordMessage,
            [this.authPageType.ResetPassword, 'forgot Password']
          );
          break;
        default:
          '';
      }
    });
  }
  //TODO: Create backend service to get the config for authentication pages
  // and fetech it here with only on function
  private get loginConfig(): IFormControlBody[] {
    return [
      {
        controlLabel: 'Email',
        controlName: 'email',
        controlType: 'email',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'Password',
        controlName: 'password',
        controlType: 'password',
        controlValidation: { required: true },
      },
    ];
  }

  private get registerConfig(): IFormControlBody[] {
    return [
      {
        controlLabel: 'Username',
        controlName: 'username',
        controlType: 'text',
        controlValidation: { required: false },
      },
      {
        controlLabel: 'Full Name',
        controlName: 'fullname',
        controlType: 'text',
        controlValidation: {},
      },
      {
        controlLabel: 'Phone Number',
        controlName: 'phone',
        controlType: 'text',
        controlValidation: {},
      },
      {
        controlLabel: 'Age',
        controlName: 'age',
        controlType: 'text',
        controlValidation: {},
      },
      {
        controlLabel: 'City',
        controlName: 'city',
        controlType: 'text',
        controlValidation: {},
      },
      {
        controlLabel: 'Profile Picture',
        controlName: 'displaypicture',
        controlType: 'text',
        controlValidation: {},
      },
      {
        controlLabel: 'Email',
        controlName: 'email',
        controlType: 'email',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'Password',
        controlName: 'password',
        controlType: 'password',
        controlValidation: { required: true },
      },
    ];
  }

  private get resetPassConfig(): IFormControlBody[] {
    return [
      {
        controlLabel: 'Email',
        controlName: 'email',
        controlType: 'email',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'Current Password',
        controlName: 'currentPassword',
        controlType: 'password',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'New Password',
        controlName: 'newPassword',
        controlType: 'password',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'Re-Enter new password',
        controlName: 'reenterNewPassword',
        controlType: 'password',
        controlValidation: { required: true },
      },
    ];
  }

  private login(formData: ILoginUser) {
    this.authService.login(formData).subscribe({
      next: (res: IAPIResponse) => {
        if (res.Status === APIStatusMessage.Success) {
          this.formService.currentData = null
          this.router.navigateByUrl('/profile');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private register(formData: ICreateUser) {
    formData.userRole = 'user'
    this.authService.register(formData).subscribe({
      next: (res: IAPIResponse) => {
        if(res.Status === APIStatusMessage.Success){
          this.formService.currentData = null
          this.router.navigateByUrl('/auth/login');
        }
      }
    });
  }

  private reset(formData: unknown) {
    this.authService.resetPassword(formData);
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

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
