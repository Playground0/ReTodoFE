import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { LocalDataService } from './localdata.service';
import {
  ICreateUser,
  ILoginUser,
  IUser,
} from 'src/app/public/models/auth-page.model';
import { Router } from '@angular/router';
import { FormsService } from 'src/app/shared/service/forms.service';

@Injectable({
  providedIn: 'root',
})
//TODO: Refactor the whole service
export class AuthService {
  isLocalHost: boolean = false;
  apiUrl: string = this.isLocalHost ? 'http://localhost:8000/api/v1' : 'https://retodobe.onrender.com/api/v1';
  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();
  private tokenName: string = 'rtdAuthToken';
  private userDataName: string = 'rtdUserData';

  constructor(
    private http: HttpClient,
    private localDataService: LocalDataService,
    private router: Router,
    private formService: FormsService
  ) {}

  public isAuthenticated(): boolean {
    const token = this.localDataService.tokenLocalData;
    return token ? true : false;
  }

  public login(loginDetails: ILoginUser) {
    return this.http.patch(`${this.apiUrl}/auth/login`, loginDetails).pipe(
      map((res: any) => {
        this.localDataService.tokenLocalData = res?.response?.sessionToken;
        let userData: IUser = {
          email: res.response?.email,
          id: res.response?.id,
          userRole: res.response?.userRole,
          username: res.response?.username,
        };
        this.localDataService.userLocalData = userData;
        this.setLoggedIn(true);
        return res;
      })
    );
  }

  public register(loginDetails: ICreateUser) {
    return this.http.post(`${this.apiUrl}/auth/register`, loginDetails);
  }

  public logout(email: string) {
    const sessionToken = this.localDataService.tokenLocalData;
    const requestObject = { email, sessionToken };
    return this.http.patch(`${this.apiUrl}/auth/logout`, requestObject).pipe(
      map((res: any) => {
        if (res.Action_Status === 'Success') {
          this.localDataService.removeLocalData(this.tokenName);
          this.localDataService.removeLocalData(this.userDataName);
          this.formService.currentData = null;
          this.isUserLoggedIn.next(false);
          this.router.navigateByUrl('/auth/login');
          return res;
        }
      })
    );
  }

  public resetPassword(loginDetails: unknown) {
    console.log('reset password');
  }

  //Use it when we have set this value to true manually
  public confirmUserLoggedIn() {
    if (this.isUserLoggedIn.value) {
      return;
    }
    this.isUserLoggedIn.next(true);
  }

  private setLoggedIn(value: boolean) {
    this.isUserLoggedIn.next(value);
  }
}
