import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';
import { IUpdateUser } from '../model/user.model';
import { IUser } from 'src/app/core/model/auth-page.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private userAPIUrl = '';
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private localDataService: LocalDataService
  ) {
    this.userAPIUrl = this.authService.getApiUrl() + '/user';
  }

  getUserDetails() {
    return this.http
      .get<IAPIResponse>(this.userAPIUrl)
      .pipe(map((res: IAPIResponse) => this.setupData(res)));
  }

  udpateUserDetails(userDetails: IUpdateUser) {
    return this.http
      .patch<IAPIResponse>(this.userAPIUrl, userDetails)
      .pipe(map((res) => this.setupData(res)));
  }

  deleteUser() {
    return this.http.delete<IAPIResponse>(this.userAPIUrl).pipe(
      tap(() => {
        this.localDataService.localTokenData = '';
        this.localDataService.localUserData = {};
      })
    );
  }

  logoutOfAllDevices() {
    const url = `${this.userAPIUrl}/logoutFromDevices`;
    const sessionToken = this.localDataService.localTokenData;
    const userId = (this.localDataService.localUserData as IUser).id;
    let requestObject = { userId, sessionToken };

    return this.http
      .patch<IAPIResponse>(url, requestObject)
      .pipe(map((res) => this.setupData(res)));
  }

  getStash() {
    const url = `${this.userAPIUrl}/stash`;
    return this.http
      .get<IAPIResponse>(url)
      .pipe(map((res) => this.setupData(res)));
  }

  private setupData(res: IAPIResponse): any {
    if (res.Status === APIStatusMessage.Success) {
      return res.Data;
    }
    return null;
  }
}
