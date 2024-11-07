import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICustomFormBody,
  IFormControlBody,
} from 'src/app/shared/model/form.model';
import {
  AuthPageType,
  ICreateUser,
  ILoginUser,
} from '../../../core/model/auth-page.model';
import { FormsService } from 'src/app/shared/service/forms.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/shared/service/loader.service';

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
  private snackBarConfig: MatSnackBarConfig = {
    duration: 5 * 1000,
  };

  functionMap: { [key: string]: Function } = {
    login: (param: any) => this.login(param),
    register: (param: any) => this.register(param),
    forgotpass: (param: any) => this.forgotpass(param),
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private formService: FormsService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  public ngOnInit(): void {
    this.checkAndSetCustomFormConfig();
    this.subscriptions.add(
      this.formService.formData$.subscribe({
        next: (res: ILoginUser | ICreateUser) => {
          if (res) {
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
      this.formService.currentData = null;
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
        case 'forgotpass':
          this.setCustomFormConfig(
            this.forgotPassConfig,
            this.authPageType.ForgotPasswordMessage,
            [this.authPageType.ForgotPassword]
          );
          break;
        default:
          '';
      }
    });
  }
  //TODO: Create backend service to get the snackBarConfig for authentication pages
  // and fetech it here with only on function
  private get loginConfig(): IFormControlBody[] {
    return [
      {
        controlLabel: 'Email',
        controlName: 'email',
        controlType: 'email',
        controlValidation: { required: true, email: true },
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
        controlValidation: { required: true },
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
        controlValidation: { phoneNumber: true },
      },
      {
        controlLabel: 'Age',
        controlName: 'age',
        controlType: 'text',
        controlValidation: { age: true },
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
        controlValidation: { required: true, email: true },
      },
      {
        controlLabel: 'Password',
        controlName: 'password',
        controlType: 'password',
        controlValidation: { required: true, newPassword: true },
      },
    ];
  }

  private get forgotPassConfig(): IFormControlBody[] {
    return [
      {
        controlLabel: 'Email',
        controlName: 'email',
        controlType: 'email',
        controlValidation: { required: true, email: true },
      },
    ];
  }

  private login(formData: ILoginUser) {
    this.loaderService.setLoader(true);
    this.authService.login(formData).subscribe({
      next: (res: IAPIResponse) => {
        this.loaderService.setLoader(false);
        if (res.Status === APIStatusMessage.Success) {
          this.formService.currentData = null;
          this.router.navigateByUrl('/todo/inbox');
          this._snackBar.open('You are logged in !!', '', this.snackBarConfig);
          return;
        }
        if (res.Status === APIStatusMessage.Error) {
          this._snackBar.open(res.Message, '', this.snackBarConfig);
          return;
        }
      },
      error: (err) => {
        this.handleError(err)
        this.loaderService.setLoader(false);
      },
    });
  }

  private register(formData: ICreateUser) {
    this.loaderService.setLoader(true);
    formData.userRole = 'user';
    this.authService.register(formData).subscribe({
      next: (res: IAPIResponse) => {
        this.loaderService.setLoader(false);
        if (res.Status === APIStatusMessage.Success) {
          this.formService.currentData = null;
          this.router.navigateByUrl('/auth/login');
          this._snackBar.open('Registration Complete, Please log in!!', '', this.snackBarConfig);
          return;
        }
        if (res.Status === APIStatusMessage.Error) {
          this._snackBar.open(res.Message, '', this.snackBarConfig);
          return;
        }
      },
      error: (err) => {
        this.handleError(err)
        this.loaderService.setLoader(false);
      },
    });
  }

  private forgotpass(formData: any) {
    this.loaderService.setLoader(true);
    this.authService.forgotPassword(formData?.email as string).subscribe({
      next: (res: IAPIResponse) => {
        this.loaderService.setLoader(false);
        if (res.Status === APIStatusMessage.Success) {
          this._snackBar.open(res.Message, '', this.snackBarConfig);
          this.router.navigateByUrl('/auth/login');
          return;
        }
        if (res.Status === APIStatusMessage.Error) {
          this._snackBar.open(res.Message, '', this.snackBarConfig);
          return;
        }
      },
      error: (err) => {
        this.handleError(err)
        this.loaderService.setLoader(false);
      },
    });
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

  handleError(errorResponse: any) {
    const error = errorResponse.error;
    this._snackBar.open(error.Message, '', this.snackBarConfig);
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
