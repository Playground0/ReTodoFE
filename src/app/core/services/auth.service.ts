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
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';

@Injectable({
  providedIn: 'root',
})
//TODO: Refactor the whole service
export class AuthService {
  isLocalHost: boolean = window.location.hostname === 'localhost' ? true : false;
  private apiUrl: string = this.isLocalHost
    ? 'http://localhost:8000/api/v1'
    : 'https://retodobe-production.up.railway.app/api/v1';
  private clientUrl: string = this.isLocalHost
    ? 'http://localhost:4200'
    : 'https://re-todo-fe.vercel.app';
  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();
  private readonly tokenCookieName = 'JWT-TOKEN';

  constructor(
    private http: HttpClient,
    private localDataService: LocalDataService,
    private router: Router,
    private formService: FormsService
  ) {}

  public isLoggedIn(): boolean {
    const token = this.localDataService.localTokenData;
    return token ? true : false;
  }
  //TODO: Refactor the below code
  public login(loginDetails: ILoginUser): Observable<IAPIResponse> {
    return this.http
      .patch<IAPIResponse>(`${this.apiUrl}/auth/login`, loginDetails, {
        withCredentials: true,
      })
      .pipe(
        map((res: IAPIResponse) => {
          const user: IUserAPI | null = res.Data
            ? (res.Data as IUserAPI)
            : null;
          if (user) {
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

  public register(loginDetails: ICreateUser): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(
      `${this.apiUrl}/auth/register`,
      loginDetails
    );
  }

  public logout(email: string): Observable<IAPIResponse> {
    const sessionToken = this.localDataService.localTokenData;
    const requestObject = { email, sessionToken };
    return this.http
      .patch<IAPIResponse>(`${this.apiUrl}/auth/logout`, requestObject)
      .pipe(
        map((res: IAPIResponse) => {
          if (res.Status === APIStatusMessage.Success) {
            this.localDataService.localTokenData = '';
            this.localDataService.localUserData = '';
            this.formService.currentData = null;
            this.isUserLoggedIn.next(false);
            this.router.navigateByUrl('/auth/login');
          }
          return res;
        })
      );
  }

  public forgotPassword(email: string): Observable<IAPIResponse> {
    const requestObject = {
      email,
      url: this.clientUrl,
    };
    return this.http.post<IAPIResponse>(
      `${this.apiUrl}/auth/forgot-password`,
      requestObject
    );
  }

  public resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(`${this.apiUrl}/auth/reset-password`, {
      email,
      token,
      newPassword,
    });
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

  public getApiUrl() {
    return this.apiUrl;
  }

  private getTokenFromCookie(): string | null {
    console.log(document.cookie);
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${this.tokenCookieName}`));
    return cookieValue ? cookieValue.split('=')[1] : null;
  }

  public getJWTToken(): string | null {
    return this.getTokenFromCookie();
  }

  hasValidToken(): boolean {
    return !!this.getTokenFromCookie();
  }

  isTokenExpired(): boolean {
    const token = this.getJWTToken();
    if (!token) return true;

    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  refreshAccessTokens(): Observable<any> {
    return this.http.get<IAPIResponse>(`${this.apiUrl}/auth/refresh-token`, {
      withCredentials: true,
    });
  }

  hardLogoutUser() {
    this.localDataService.localTokenData = ''; //To bypass interceptors
    this.http
      .patch<IAPIResponse>(`${this.apiUrl}/auth/hard-logout-user`, {})
      .subscribe({
        next: (res) => {
          if (res.Code === 200) {
            this.localDataService.localTokenData = '';
            this.localDataService.localUserData = '';
            this.formService.currentData = null;
            this.isUserLoggedIn.next(false);
            this.router.navigateByUrl('/auth/login');
            console.warn('User was logged out because of long inactivity!');
          }
        },
        error: () => {
          this.localDataService.localTokenData = '';
          this.localDataService.localUserData = '';
          this.formService.currentData = null;
          this.isUserLoggedIn.next(false);
          this.router.navigateByUrl('/auth/login');
          console.warn(
            'Cookies were not cleared but user was successfuly logged out due to inactivity!.'
          );
        },
      });
  }
}
