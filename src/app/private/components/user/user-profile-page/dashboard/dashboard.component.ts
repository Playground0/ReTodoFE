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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userDetailsForm!: FormGroup;
  customFormConfig!: ICustomFormBody;
  data!: IUserDetails;
  constructor(
    private userService: UserApiService,
    private formService: FormsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
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
    this.userService.getUserDetails().subscribe({
      next: (res) => {
        this.data = res;
      },
    });
  }

  getFormValue(){
    this.formService.formData$.subscribe({
      next: (res) => {
        if(res){
          const userDetails = res as IUpdateUser
          this.userService.udpateUserDetails(userDetails).subscribe({
            next: (res) => {
              this.data = res as IUserDetails
            }
          })
        }
      }
    })
  }

  resetPassword(){
    this.authService.forgotPassword(this.data.email).subscribe({
      next: (res) => {
        if(res.Status === APIStatusMessage.Success){
          const snackBarConfig : MatSnackBarConfig = {
            duration : 50000
          } 
          this.snackBar.open('Email sent', '', snackBarConfig)
        }
        console.log(res)
      }
    })
  }

  logOutOfAllDevices(){
    this.userService.logoutOfAllDevices().subscribe({
      next: (res) => {
        const config: MatSnackBarConfig = {
          duration: 5000
        } 
        this.snackBar.open("Logged out of all devices",'',config)
      }
    })
  }

  deleteAccount(){
    this.userService.deleteUser().subscribe({
      next: (res) => {
        if(res.Status === APIStatusMessage.Success){
          this.router.navigateByUrl('/auth/login')
        }
      }
    });
  }
}
