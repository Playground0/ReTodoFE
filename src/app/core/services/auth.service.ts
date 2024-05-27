import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LocalDataService } from './localdata.service';
import {
  ICreateUser,
  ILoginUser,
  IUser,
  IUserAPI,
} from '../model/auth-page.model';
import { Router } from '@angular/router';
import { FormsService } from 'src/app/shared/service/forms.service';
import { APIStatusMessage, IAPIData } from 'src/app/shared/model/basic-api.model';

@Injectable({
  providedIn: 'root',
})
//TODO: Refactor the whole service
export class AuthService {
  isLocalHost: boolean = false;
  apiUrl: string = this.isLocalHost
    ? 'http://localhost:8000/api/v1'
    : 'https://retodobe.onrender.com/api/v1';
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
    const token = this.localDataService.localTokenData;
    return token ? true : false;
  }

  public login(loginDetails: ILoginUser): Observable<IAPIData> {
    return this.http
      .patch<IAPIData>(`${this.apiUrl}/auth/login`, loginDetails)
      .pipe(
        map((res: IAPIData) => {
          const user: IUserAPI | null  = res.Data ? res.Data as IUserAPI : null;
          if (user){
            this.localDataService.localTokenData = user.sessionToken
              ? user.sessionToken
              : '';
            let userData: IUser = {
              email: res.Data?.email,
              id: res.Data?.id,
              userRole: res.Data?.userRole,
              username: res.Data?.username,
            };
            this.localDataService.localUserData = userData;
            this.setLoggedIn(true);
          }
          return res;
        })
      );
  }

  public register(loginDetails: ICreateUser) : Observable<IAPIData>{
    return this.http.post<IAPIData>(`${this.apiUrl}/auth/register`, loginDetails);
  }

  public logout(email: string): Observable<IAPIData> {
    const sessionToken = this.localDataService.localTokenData;
    const requestObject = { email, sessionToken };
    return this.http
      .patch<IAPIData>(`${this.apiUrl}/auth/logout`, requestObject)
      .pipe(
        map((res: IAPIData) => {
          if (res.Status === APIStatusMessage.Success) {
            this.localDataService.removeLocalData(this.tokenName);
            this.localDataService.removeLocalData(this.userDataName);
            this.formService.currentData = null;
            this.isUserLoggedIn.next(false);
            this.router.navigateByUrl('/auth/login');
          }
          return res;
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
