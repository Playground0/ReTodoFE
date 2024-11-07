import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { IUpdateUser, IUserDetails } from 'src/app/private/model/user.model';
import { UserApiService } from 'src/app/private/services/user-api.service';
import { APIStatusMessage } from 'src/app/shared/model/basic-api.model';
import {
  ICustomFormBody,
  IFormControlBody,
} from 'src/app/shared/model/form.model';
import { FormsService } from 'src/app/shared/service/forms.service';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userDetailsForm!: FormGroup;
  customFormConfig!: ICustomFormBody;
  data!: IUserDetails;
  snackBarConfig: MatSnackBarConfig = {
    duration: 50000,
  };
  constructor(
    private userService: UserApiService,
    private formService: FormsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getUserDetails();
    this.getFormValue();
  }

  initializeForm() {
    const customFormControls: IFormControlBody[] = [
      {
        controlLabel: 'Username',
        controlName: 'username',
        controlType: 'text',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'Email',
        controlName: 'email',
        controlType: 'email',
        controlValidation: { required: true },
      },
      {
        controlLabel: 'Full Name',
        controlName: 'fullname',
        controlType: 'text',
      },
      {
        controlLabel: 'Age',
        controlName: 'age',
        controlType: 'text',
      },
    ];
    this.customFormConfig = {
      controls: customFormControls,
      formName: '',
      btnNames: ['Update Details'],
    };
  }

  getUserDetails() {
    this.loaderService.setLoader(true);
    this.userService.getUserDetails().subscribe({
      next: (res) => {
        this.loaderService.setLoader(false);
        this.data = res;
      },
      error: (err) => {
        this.handleError(err);
        this.loaderService.setLoader(false);
      },
    });
  }

  getFormValue() {
    this.formService.formData$.subscribe({
      next: (res) => {
        if (res) {
          const userDetails = res as IUpdateUser;
          this.userService.udpateUserDetails(userDetails).subscribe({
            next: (res) => {
              this.data = res as IUserDetails;
            },
          });
        }
      },
    });
  }

  resetPassword() {
    this.loaderService.setLoader(true);
    this.authService.forgotPassword(this.data.email).subscribe({
      next: (res) => {
        this.loaderService.setLoader(false);
        if (res.Status === APIStatusMessage.Success) {
          this.snackBar.open('Email sent', '', this.snackBarConfig);
          return
        }
        if(res.Status === APIStatusMessage.Error){
          this.snackBar.open('Something went wrong! Please try again', '', this.snackBarConfig);
          return;
        }
      },
      error: (err) => {
        this.handleError(err);
        this.loaderService.setLoader(false);
      }
    });
  }

  logOutOfAllDevices() {
    this.loaderService.setLoader(true);
    this.userService.logoutOfAllDevices().subscribe({
      next: (res) => {
        this.loaderService.setLoader(false);
        this.snackBar.open('Logged out of all devices', '', this.snackBarConfig);
      },
      error: (err) => {
        this.loaderService.setLoader(false);
      }
    });
  }

  deleteAccount() {
    this.loaderService.setLoader(true);
    this.userService.deleteUser().subscribe({
      next: (res) => {
        this.loaderService.setLoader(false);
        if (res.Status === APIStatusMessage.Success) {
          this.router.navigateByUrl('/auth/login');
          return;
        }
        if(res.Status === APIStatusMessage.Error){
          this.snackBar.open(res.Message, '', this.snackBarConfig);
          return;
        }
      },
      error: (err) => {
        this.handleError(err);
        this.loaderService.setLoader(false)
      }
    });
  }

  handleError(errorResponse: any) {
    const error = errorResponse.error;
    this.snackBar.open(error.Message, '', this.snackBarConfig);
  }
}
